import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Calendar, Clock, TrendingUp } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

interface StudyData {
  day: string;
  minutes: number;
}

export default function StudyStatisticsChart() {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState<StudyData[]>([]);
  const [monthlyData, setMonthlyData] = useState<StudyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadStudyData();
    }
  }, [user]);

  const loadStudyData = async () => {
    setLoading(true);
    try {
      // Get study sessions from the past 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: sessionsData } = await supabase
        .from("study_sessions")
        .select("*")
        .eq("user_id", user?.id)
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at", { ascending: true });

      // Process data for weekly chart
      const weeklyMap = new Map<string, number>();
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      days.forEach((day) => weeklyMap.set(day, 0));

      // Process data for monthly chart
      const monthlyMap = new Map<string, number>();
      const now = new Date();
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        monthlyMap.set(dateStr, 0);
      }

      if (sessionsData) {
        sessionsData.forEach((session) => {
          const date = new Date(session.created_at);
          const dayName = days[date.getDay()];
          const dateStr = date.toISOString().split("T")[0];

          // Update weekly data
          weeklyMap.set(
            dayName,
            (weeklyMap.get(dayName) || 0) + session.duration_minutes,
          );

          // Update monthly data
          if (monthlyMap.has(dateStr)) {
            monthlyMap.set(
              dateStr,
              (monthlyMap.get(dateStr) || 0) + session.duration_minutes,
            );
          }
        });
      }

      // Convert maps to arrays for the charts
      const weeklyChartData = days.map((day) => ({
        day,
        minutes: weeklyMap.get(day) || 0,
      }));

      const monthlyChartData = Array.from(monthlyMap.entries())
        .map(([day, minutes]) => ({ day, minutes }))
        .sort((a, b) => a.day.localeCompare(b.day));

      setWeeklyData(weeklyChartData);
      setMonthlyData(monthlyChartData);
    } catch (error) {
      console.error("Error loading study data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Find the max value for scaling
  const weeklyMax = Math.max(...weeklyData.map((d) => d.minutes), 60);
  const monthlyMax = Math.max(...monthlyData.map((d) => d.minutes), 60);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="w-5 h-5" />
          Study Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="weekly" className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> Monthly
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-4">
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Loading data...</p>
              </div>
            ) : (
              <div className="h-64 relative">
                <div className="absolute left-0 bottom-0 h-full w-10 flex flex-col justify-between text-xs text-muted-foreground">
                  <span>{weeklyMax} min</span>
                  <span>{Math.floor(weeklyMax / 2)} min</span>
                  <span>0 min</span>
                </div>
                <div className="absolute left-10 right-0 bottom-0 h-full flex items-end">
                  {weeklyData.map((item, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className="w-4/5 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-md"
                        style={{
                          height: `${Math.max(4, (item.minutes / weeklyMax) * 100)}%`,
                          minHeight: item.minutes > 0 ? "4px" : "0",
                        }}
                      />
                      <div className="mt-2 text-xs font-medium">{item.day}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            {loading ? (
              <div className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Loading data...</p>
              </div>
            ) : (
              <div className="h-64 relative overflow-hidden">
                <div className="absolute left-0 bottom-0 h-full w-10 flex flex-col justify-between text-xs text-muted-foreground">
                  <span>{monthlyMax} min</span>
                  <span>{Math.floor(monthlyMax / 2)} min</span>
                  <span>0 min</span>
                </div>
                <div className="absolute left-10 right-0 bottom-0 h-full overflow-x-auto">
                  <div
                    className="flex items-end"
                    style={{ width: `${monthlyData.length * 40}px` }}
                  >
                    {monthlyData.map((item, index) => (
                      <div
                        key={index}
                        className="w-10 flex flex-col items-center mx-1"
                      >
                        <div
                          className="w-6 bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-md"
                          style={{
                            height: `${Math.max(4, (item.minutes / monthlyMax) * 100)}%`,
                            minHeight: item.minutes > 0 ? "4px" : "0",
                          }}
                        />
                        <div className="mt-2 text-xs font-medium transform -rotate-45 origin-top-left whitespace-nowrap">
                          {new Date(item.day).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
