import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Timer, Pause, Play } from "lucide-react";

export default function FocusMode() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        if (sessionStartTime) {
          const elapsed = Math.floor(
            (new Date().getTime() - sessionStartTime.getTime()) / 1000,
          );
          setElapsedTime(elapsed);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isActive, sessionStartTime]);

  const startFocusMode = async () => {
    if (!user) return;

    const startTime = new Date();
    setSessionStartTime(startTime);
    setIsActive(true);

    try {
      // Create active session
      await supabase.from("active_sessions").insert({
        user_id: user.id,
        start_time: startTime.toISOString(),
        end_time: new Date(startTime.getTime() + 3600000).toISOString(), // 1 hour default
        subject: "Focus Mode",
      });

      // Update study stats to start tracking time
      await supabase.from("study_stats").upsert({
        user_id: user.id,
        last_study_date: startTime.toISOString(),
        updated_at: startTime.toISOString(),
      });

      toast({
        title: "Focus Mode Started",
        description: "Your study time is now being tracked.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start focus mode",
        variant: "destructive",
      });
    }
  };

  const endFocusMode = async () => {
    if (!user || !sessionStartTime) return;

    const endTime = new Date();
    const durationMinutes = Math.floor(
      (endTime.getTime() - sessionStartTime.getTime()) / 60000,
    );

    try {
      // Update study stats
      const { data: statsData } = await supabase
        .from("study_stats")
        .select("total_study_time_minutes")
        .eq("user_id", user.id)
        .single();

      const newTotalTime =
        (statsData?.total_study_time_minutes || 0) + durationMinutes;

      await supabase.from("study_stats").upsert({
        user_id: user.id,
        total_study_time_minutes: newTotalTime,
        last_study_date: endTime.toISOString(),
      });

      // End active session
      await supabase
        .from("active_sessions")
        .update({ end_time: endTime.toISOString() })
        .eq("user_id", user.id)
        .is("end_time", null);

      setIsActive(false);
      setSessionStartTime(null);
      setElapsedTime(0);

      toast({
        title: "Focus Mode Ended",
        description: `You studied for ${durationMinutes} minutes!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to end focus mode",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="w-5 h-5" />
          Focus Mode
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold font-mono">
              {formatTime(elapsedTime)}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {isActive ? "Focus mode active" : "Start a focus session"}
            </p>
          </div>

          <Button
            className="w-full"
            variant={isActive ? "destructive" : "default"}
            onClick={isActive ? endFocusMode : startFocusMode}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 mr-2" /> End Session
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" /> Start Focus Mode
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
