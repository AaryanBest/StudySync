import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, BookOpen } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

interface SubjectData {
  subject: string;
  minutes: number;
  color: string;
}

export default function StudySubjectsChart() {
  const { user } = useAuth();
  const [subjectsData, setSubjectsData] = useState<SubjectData[]>([]);
  const [loading, setLoading] = useState(true);

  const colors = [
    "#8b5cf6", // purple-500
    "#ec4899", // pink-500
    "#3b82f6", // blue-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#6366f1", // indigo-500
    "#14b8a6", // teal-500
  ];

  useEffect(() => {
    if (user) {
      loadSubjectsData();
    }
  }, [user]);

  const loadSubjectsData = async () => {
    setLoading(true);
    try {
      const { data: sessionsData } = await supabase
        .from("study_sessions")
        .select("subject, duration_minutes")
        .eq("user_id", user?.id);

      const subjectMap = new Map<string, number>();

      if (sessionsData && sessionsData.length > 0) {
        sessionsData.forEach((session) => {
          const subject = session.subject || "General";
          subjectMap.set(
            subject,
            (subjectMap.get(subject) || 0) + session.duration_minutes,
          );
        });
      } else {
        // Sample data if no data exists
        subjectMap.set("Mathematics", 120);
        subjectMap.set("Physics", 90);
        subjectMap.set("Computer Science", 150);
        subjectMap.set("Literature", 60);
      }

      // Convert map to array and sort by minutes (descending)
      const sortedData = Array.from(subjectMap.entries())
        .map(([subject, minutes], index) => ({
          subject,
          minutes,
          color: colors[index % colors.length],
        }))
        .sort((a, b) => b.minutes - a.minutes);

      setSubjectsData(sortedData);
    } catch (error) {
      console.error("Error loading subjects data:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalMinutes = subjectsData.reduce(
    (sum, item) => sum + item.minutes,
    0,
  );

  // Calculate the percentage and angles for the pie chart
  let startAngle = 0;
  const segments = subjectsData.map((item) => {
    const percentage = (item.minutes / totalMinutes) * 100;
    const degrees = (percentage / 100) * 360;
    const segment = {
      ...item,
      percentage,
      startAngle,
      endAngle: startAngle + degrees,
    };
    startAngle += degrees;
    return segment;
  });

  // Function to convert degrees to SVG arc path
  const describeArc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
  ) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "L",
      x,
      y,
      "Z",
    ].join(" ");
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number,
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Study Subjects
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative w-48 h-48 mx-auto">
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                {segments.map((segment, i) => (
                  <path
                    key={i}
                    d={describeArc(
                      50,
                      50,
                      40,
                      segment.startAngle,
                      segment.endAngle,
                    )}
                    fill={segment.color}
                    stroke="white"
                    strokeWidth="1"
                  />
                ))}
                <circle cx="50" cy="50" r="25" fill="white" />
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-lg font-bold"
                >
                  {totalMinutes}
                </text>
                <text
                  x="50"
                  y="60"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs"
                >
                  minutes
                </text>
              </svg>
            </div>

            <div className="space-y-2">
              {segments.map((segment, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    <span className="text-sm font-medium">
                      {segment.subject}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {segment.minutes} min ({segment.percentage.toFixed(1)}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
