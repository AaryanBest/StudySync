import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import StudyMusicPlayer from "./StudyMusicPlayer";
import FocusMode from "./FocusMode";
import StudyStatisticsChart from "./StudyStatisticsChart";
import StudySubjectsChart from "./StudySubjectsChart";
import StudyStreakCard from "./StudyStreakCard";
import ProductivityScoreCard from "./ProductivityScoreCard";
import {
  Brain,
  Clock,
  Target,
  Sparkles,
  RefreshCw,
  Calendar,
  BookOpen,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);
  const [isNewUser, setIsNewUser] = useState(true);
  const [isStudying, setIsStudying] = useState(false);
  const [studyTimer, setStudyTimer] = useState(0);
  const [currentSubject, setCurrentSubject] = useState("Mathematics");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [yearGoals, setYearGoals] = useState({
    totalHoursGoal: 500,
    subjectsToMaster: 5,
    currentProgress: 0,
  });
  const [realtimeStats, setRealtimeStats] = useState({
    focusScore: 85,
    distractions: 0,
    sessionsCompleted: 0,
  });

  // Subjects for the new user to choose from
  const subjects = [
    "Mathematics",
    "Physics",
    "Computer Science",
    "Literature",
    "History",
    "Chemistry",
    "Biology",
    "Economics",
  ];

  useEffect(() => {
    if (user) {
      loadStats();
      checkIfNewUser();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [user]);

  const loadStats = async () => {
    const { data } = await supabase
      .from("study_stats")
      .select("*")
      .eq("user_id", user?.id)
      .single();

    setStats(data);
  };

  const checkIfNewUser = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("study_sessions")
      .select("count")
      .eq("user_id", user.id);

    // If no study sessions, consider as new user
    setIsNewUser(data && data.length === 0);
  };

  const resetDashboard = async () => {
    if (!user) return;

    try {
      // Reset stats for the new year
      await supabase.from("study_stats").upsert({
        user_id: user.id,
        total_study_time_minutes: 0,
        current_streak: 0,
        last_study_date: new Date().toISOString(),
        completion_percentage: 0,
        distraction_score: 0,
        updated_at: new Date().toISOString(),
      });

      toast({
        title: "Dashboard Reset",
        description: "Your dashboard has been reset for the new year!",
      });

      // Reload stats
      loadStats();
      setIsNewUser(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset dashboard",
        variant: "destructive",
      });
    }
  };

  const startStudySession = () => {
    setIsStudying(true);
    setRealtimeStats((prev) => ({
      ...prev,
      focusScore: 100,
      distractions: 0,
    }));

    // Start timer
    timerRef.current = setInterval(() => {
      setStudyTimer((prev) => prev + 1);

      // Simulate real-time changes
      if (Math.random() > 0.9) {
        simulateDistraction();
      }
    }, 1000);

    toast({
      title: "Study Session Started",
      description: `You are now studying ${currentSubject}. Stay focused!`,
    });
  };

  const endStudySession = async () => {
    if (!user) return;

    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const studyMinutes = Math.floor(studyTimer / 60);

    try {
      // Record the study session
      await supabase.from("study_sessions").insert({
        user_id: user.id,
        subject: currentSubject,
        duration_minutes: studyMinutes > 0 ? studyMinutes : 1, // Minimum 1 minute
        created_at: new Date().toISOString(),
        scheduled_start: new Date().toISOString(),
      });

      // Update stats
      const { data: statsData } = await supabase
        .from("study_stats")
        .select("total_study_time_minutes, current_streak")
        .eq("user_id", user.id)
        .single();

      if (statsData) {
        await supabase.from("study_stats").upsert({
          user_id: user.id,
          total_study_time_minutes:
            (statsData.total_study_time_minutes || 0) + studyMinutes,
          current_streak: statsData.current_streak + 1,
          last_study_date: new Date().toISOString(),
          last_session_minutes: studyMinutes,
          updated_at: new Date().toISOString(),
        });
      }

      toast({
        title: "Study Session Completed",
        description: `You studied ${currentSubject} for ${formatTime(studyTimer)}!`,
      });

      // Reset timer and update UI
      setStudyTimer(0);
      setIsStudying(false);
      setRealtimeStats((prev) => ({
        ...prev,
        sessionsCompleted: prev.sessionsCompleted + 1,
      }));
      setIsNewUser(false);

      // Reload stats
      loadStats();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save study session",
        variant: "destructive",
      });
    }
  };

  const simulateDistraction = () => {
    // Simulate a distraction during study
    setRealtimeStats((prev) => ({
      ...prev,
      distractions: prev.distractions + 1,
      focusScore: Math.max(50, prev.focusScore - 5),
    }));
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {!isNewUser && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetDashboard}
              className="flex items-center gap-1"
            >
              <RefreshCw className="w-4 h-4" /> Reset for New Year
            </Button>
          )}
        </div>
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full flex items-center gap-2">
          <Calendar className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-purple-800">
            {new Date().getFullYear()} Study Goals
          </span>
        </div>
      </div>

      {isNewUser ? (
        <Card className="mb-8 border-2 border-purple-200 bg-purple-50/30">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Welcome to StudySync!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 text-center">
              <p className="text-lg">
                Let's set up your dashboard for productive studying
              </p>

              <div className="grid gap-4 max-w-md mx-auto">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Choose a subject to start studying:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {subjects.map((subject) => (
                      <Button
                        key={subject}
                        variant={
                          currentSubject === subject ? "default" : "outline"
                        }
                        onClick={() => setCurrentSubject(subject)}
                        className="justify-start"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        {subject}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={startStudySession}
                  className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="lg"
                >
                  Start Your First Study Session
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Real-time study session */}
      {isStudying && (
        <Card className="mb-8 border-2 border-green-200 bg-green-50/30 animate-pulse">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Live Study Session: {currentSubject}</span>
              <span className="text-xl">{formatTime(studyTimer)}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="text-sm font-medium">Current Focus Score</div>
                  <div className="text-2xl font-bold text-green-600">
                    {realtimeStats.focusScore}%
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">Distractions</div>
                  <div className="text-2xl font-bold text-red-500">
                    {realtimeStats.distractions}
                  </div>
                </div>
                <Button onClick={endStudySession} variant="destructive">
                  End Session
                </Button>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-sm">Focus Level</span>
                  <span className="text-sm">{realtimeStats.focusScore}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${realtimeStats.focusScore > 80 ? "bg-green-500" : realtimeStats.focusScore > 50 ? "bg-yellow-500" : "bg-red-500"}`}
                    style={{ width: `${realtimeStats.focusScore}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top row - Focus tools */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {!isStudying ? (
          <FocusMode />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Study Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-center">
                <div className="text-4xl font-bold text-purple-600">
                  {formatTime(studyTimer)}
                </div>
                <p className="text-muted-foreground">
                  Keep going! You're doing great!
                </p>
                <Button
                  onClick={endStudySession}
                  variant="outline"
                  className="w-full"
                >
                  Complete Session
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        <StudyMusicPlayer />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Study Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-purple-600 mb-1">
                  Total Study Time
                </p>
                <p className="text-3xl font-bold text-purple-700">
                  {stats?.total_study_time_minutes ? (
                    <>
                      {Math.floor(stats.total_study_time_minutes / 60)}h{" "}
                      {stats.total_study_time_minutes % 60}m
                    </>
                  ) : (
                    "0h 0m"
                  )}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-green-600 mb-1">
                    Last Session
                  </p>
                  <p className="text-xl font-semibold text-green-700">
                    {stats?.last_session_minutes ? (
                      <>
                        {Math.floor(stats.last_session_minutes / 60)}h{" "}
                        {stats.last_session_minutes % 60}m
                      </>
                    ) : (
                      "No sessions"
                    )}
                  </p>
                </div>

                <div className="bg-amber-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-amber-600 mb-1">
                    Current Streak
                  </p>
                  <p className="text-xl font-semibold text-amber-700">
                    {stats?.current_streak || 0} days
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle row - Charts */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <StudyStatisticsChart />
        <StudySubjectsChart />
      </div>

      {/* Bottom row - Additional stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StudyStreakCard />
        <ProductivityScoreCard />
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              {new Date().getFullYear()} Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Annual Study Goal</span>
                  <span className="text-sm text-muted-foreground">
                    {stats?.total_study_time_minutes
                      ? Math.floor(stats.total_study_time_minutes / 60)
                      : 0}
                    /{yearGoals.totalHoursGoal} hours
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{
                      width: `${Math.min(100, ((stats?.total_study_time_minutes || 0) / (yearGoals.totalHoursGoal * 60)) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Sessions Completed
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {realtimeStats.sessionsCompleted}/100 sessions
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                    style={{
                      width: `${(realtimeStats.sessionsCompleted / 100) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Subjects Mastered</span>
                  <span className="text-sm text-muted-foreground">
                    {yearGoals.currentProgress}/{yearGoals.subjectsToMaster}{" "}
                    subjects
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                    style={{
                      width: `${(yearGoals.currentProgress / yearGoals.subjectsToMaster) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
