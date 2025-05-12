import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { CreateRoomDialog } from "./CreateRoomDialog";
import { useAuth } from "@/lib/auth";

export default function StudyRoomsList() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadRooms();
    subscribeToRooms();
  }, []);

  const loadRooms = async () => {
    const { data } = await supabase
      .from("study_rooms")
      .select("*, room_participants(count)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    setRooms(data || []);
  };

  const subscribeToRooms = () => {
    supabase
      .channel("study_rooms")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "study_rooms" },
        () => loadRooms(),
      )
      .subscribe();
  };

  const joinRoom = async (roomId: string) => {
    if (!user) return;

    // Join the room
    await supabase.from("room_participants").upsert({
      room_id: roomId,
      user_id: user.id,
      is_muted: true,
    });

    navigate(`/study-room/${roomId}`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Study Rooms</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" /> Create Room
        </Button>
        <CreateRoomDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card key={room.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">{room.title}</CardTitle>
              <Badge variant="outline">
                <Users className="w-4 h-4 mr-2" />
                {room.room_participants?.[0]?.count || 0}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{room.description}</p>
              <div className="flex justify-between items-center">
                <Badge variant="secondary" className="capitalize">
                  {room.mode} Mode
                </Badge>
                <Button variant="outline" onClick={() => joinRoom(room.id)}>
                  Join Room
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
