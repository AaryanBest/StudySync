import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Calendar } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function StudyStreakCard() {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [lastWeekDays, setLastWeekDays] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStreakData();
    }
  }, [user]);

  const loadStreakData = async () => {
    setLoading(true);
    try {
      // Get study stats
      const { data: statsData } = await supabase
        .from("study_stats")
        .select("current_streak, longest_streak")
        .eq("user_id", user?.id)
        .single();

      if (statsData) {
        setStreak(statsData.current_streak || 0);
        setLongestStreak(statsData.longest_streak || 0);
      }

      // Get study sessions from the past 7 days to show activity
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: sessionsData } = await supabase
        .from("study_sessions")
        .select("created_at")
        .eq("user_id", user?.id)
        .gte("created_at", sevenDaysAgo.toISOString());

      // Create a map of days with activity
      const daysWithActivity = new Set<string>();
      if (sessionsData) {
        sessionsData.forEach((session) => {
          const date = new Date(session.created_at).toISOString().split("T")[0];
          daysWithActivity.add(date);
        });
      }

      // Check each of the last 7 days
      const weekActivity = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        weekActivity.push(daysWithActivity.has(dateStr));
      }

      setLastWeekDays(weekActivity);
    } catch (error) {
      console.error("Error loading streak data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Study Streak
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500">
                  {streak}
                </div>
                <div className="text-sm text-muted-foreground">
                  Current Streak
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-500">
                  {longestStreak}
                </div>
                <div className="text-sm text-muted-foreground">
                  Longest Streak
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Last 7 days</span>
              </div>
              <div className="flex justify-between">
                {lastWeekDays.map((active, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - (6 - i));
                  const day = date
                    .toLocaleDateString(undefined, { weekday: "short" })
                    .charAt(0);

                  return (
                    <div key={i} className="flex flex-col items-center">
                      <div className="text-xs text-muted-foreground mb-1">
                        {day}
                      </div>
                      <div
                        className={`w-8 h-8 rounded-md flex items-center justify-center ${active ? "bg-gradient-to-br from-orange-400 to-pink-500 text-white" : "bg-gray-100 text-gray-400"}`}
                      >
                        {active ? "✓" : ""}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
