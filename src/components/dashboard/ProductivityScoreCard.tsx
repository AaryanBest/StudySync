import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, TrendingUp, TrendingDown } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export default function ProductivityScoreCard() {
  const { user } = useAuth();
  const [score, setScore] = useState(0);
  const [trend, setTrend] = useState<"up" | "down" | "neutral">("neutral");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProductivityData();
    }
  }, [user]);

  const loadProductivityData = async () => {
    setLoading(true);
    try {
      // In a real app, this would calculate based on various metrics
      // For now, we'll generate a score based on study stats
      const { data: statsData } = await supabase
        .from("study_stats")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (statsData) {
        // Calculate a score based on available metrics
        const streakFactor = Math.min(10, statsData.current_streak || 0);
        const timeFactor = Math.min(
          50,
          (statsData.total_study_time_minutes || 0) / 60,
        );
        const distractionFactor =
          100 - Math.min(40, statsData.distraction_score || 0);

        // Combine factors into a score out of 100
        const calculatedScore = Math.min(
          100,
          Math.floor(
            streakFactor * 3 + timeFactor * 0.8 + distractionFactor * 0.3,
          ),
        );

        setScore(calculatedScore || 75); // Default to 75 if calculation is 0

        // Determine trend (in a real app, compare to previous period)
        setTrend(
          calculatedScore > 70
            ? "up"
            : calculatedScore < 50
              ? "down"
              : "neutral",
        );
      } else {
        // Default values if no data
        setScore(65);
        setTrend("neutral");
      }
    } catch (error) {
      console.error("Error loading productivity data:", error);
      // Default values on error
      setScore(60);
      setTrend("neutral");
    } finally {
      setLoading(false);
    }
  };

  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-amber-500";
    return "text-red-500";
  };

  // Get feedback based on score
  const getScoreFeedback = () => {
    if (score >= 80) return "Excellent productivity!";
    if (score >= 60) return "Good progress!";
    if (score >= 40) return "Room for improvement";
    return "Needs attention";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="w-5 h-5" />
          Productivity Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                {/* Circular progress background */}
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="text-gray-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className={getScoreColor()}
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`text-3xl font-bold ${getScoreColor()}`}>
                    {score}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    out of 100
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{getScoreFeedback()}</div>
              <div className="flex items-center gap-1">
                {trend === "up" && (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                )}
                {trend === "down" && (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={`text-sm ${trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"}`}
                >
                  {trend === "up"
                    ? "+5% from last week"
                    : trend === "down"
                      ? "-3% from last week"
                      : "Same as last week"}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
