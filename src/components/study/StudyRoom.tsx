import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Timer, Users, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

interface StudyRoomProps {
  roomId: string;
}

export default function StudyRoom({ roomId }: StudyRoomProps) {
  const { user } = useAuth();
  const [room, setRoom] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [timer, setTimer] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (roomId) {
      loadRoomData();
      subscribeToRoom();
    }
  }, [roomId]);

  useEffect(() => {
    if (timer) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const start = new Date(timer.start_time).getTime();
        const duration = timer.duration_minutes * 60 * 1000;
        const remaining = Math.max(
          0,
          Math.floor((start + duration - now) / 1000),
        );
        setTimeLeft(remaining);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const loadRoomData = async () => {
    // Load room details
    const { data: roomData } = await supabase
      .from("study_rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    setRoom(roomData);

    // Load participants
    const { data: participantsData } = await supabase
      .from("room_participants")
      .select("*, profiles(*)")
      .eq("room_id", roomId);

    setParticipants(participantsData || []);

    // Load active timer
    const { data: timerData } = await supabase
      .from("room_timers")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    setTimer(timerData);
  };

  const subscribeToRoom = () => {
    // Subscribe to room changes
    supabase
      .channel(`room:${roomId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "room_participants" },
        () => loadRoomData(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "room_timers" },
        () => loadRoomData(),
      )
      .subscribe();
  };

  const toggleMute = async () => {
    const newMuteState = !isMuted;
    await supabase
      .from("room_participants")
      .update({ is_muted: newMuteState })
      .eq("room_id", roomId)
      .eq("user_id", user?.id);
    setIsMuted(newMuteState);
  };

  const startTimer = async (duration: number, isBreak: boolean = false) => {
    await supabase.from("room_timers").insert({
      room_id: roomId,
      start_time: new Date().toISOString(),
      duration_minutes: duration,
      is_break: isBreak,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (!room) return null;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{room.title}</h1>
          <p className="text-muted-foreground">{room.description}</p>
        </div>
        <Badge variant="outline" className="text-lg">
          <Users className="w-4 h-4 mr-2" />
          {participants.length} participants
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Study Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={room.mode} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="silent">Silent</TabsTrigger>
                <TabsTrigger value="timed">Timed Focus</TabsTrigger>
                <TabsTrigger value="qa">Q&A</TabsTrigger>
              </TabsList>

              <TabsContent value="silent" className="space-y-4">
                <div className="text-center py-8">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={toggleMute}
                    className={isMuted ? "bg-red-50" : "bg-green-50"}
                  >
                    {isMuted ? (
                      <>
                        <MicOff className="w-4 h-4 mr-2 text-red-500" /> Muted
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2 text-green-500" /> Unmuted
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="timed" className="space-y-4">
                {timer ? (
                  <div className="text-center py-8">
                    <div className="text-4xl font-bold mb-4">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-muted-foreground">
                      {timer.is_break ? "Break Time" : "Focus Time"}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => startTimer(50)}
                    >
                      <Timer className="w-4 h-4 mr-2" /> Start 50min Focus
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => startTimer(10, true)}
                    >
                      <Timer className="w-4 h-4 mr-2" /> Start 10min Break
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="qa" className="space-y-4">
                <div className="text-center py-8">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={toggleMute}
                    className={isMuted ? "bg-red-50" : "bg-green-50"}
                  >
                    {isMuted ? (
                      <>
                        <MessageSquare className="w-4 h-4 mr-2" /> Join
                        Discussion
                      </>
                    ) : (
                      <>
                        <MicOff className="w-4 h-4 mr-2" /> Leave Discussion
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {participants.map((participant) => (
                <div
                  key={participant.user_id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-medium">
                      {participant.profiles?.username?.[0].toUpperCase()}
                    </div>
                    <div>{participant.profiles?.username}</div>
                  </div>
                  {participant.is_muted ? (
                    <MicOff className="w-4 h-4 text-red-500" />
                  ) : (
                    <Mic className="w-4 h-4 text-green-500" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
