import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Target,
  Calendar,
  Zap,
  BarChart,
  Users,
  Timer,
  Lightbulb,
  Trophy,
  BookOpen,
} from "lucide-react";

export default function FeaturesList() {
  const features = [
    {
      icon: Target,
      title: "Smart Study Goals",
      subtitle: "Stay on Track!",
      description: [
        "Set personalized daily & weekly study targets",
        "Track progress with a visual completion bar",
        "AI-powered goal suggestions based on study history",
      ],
    },
    {
      icon: Calendar,
      title: "Scheduled Study Sessions",
      subtitle: "Never Study Alone!",
      description: [
        "Plan & schedule study sessions with friends",
        "Get automated reminders for upcoming sessions",
        "Join public study groups or create private ones",
      ],
    },
    {
      icon: Zap,
      title: "Quick Start Study Mode",
      subtitle: "Instant Productivity!",
      description: [
        "Jump into a focused study session with one tap",
        "Choose between Silent Mode, Pomodoro, or Q&A Study",
        "AI detects distractions & sends focus reminders",
      ],
    },
    {
      icon: BarChart,
      title: "Progress & Streak Tracker",
      subtitle: "Build Consistency!",
      description: [
        "Daily & weekly streaks to boost motivation",
        "See your total study time & best focus days",
        "Earn achievements & badges for consistency",
      ],
    },
    {
      icon: Users,
      title: "Group Study & Challenges",
      subtitle: "Make Studying Social!",
      description: [
        "Join live study rooms & stay accountable with friends",
        "Participate in Focus Challenges (who can study the longest?)",
        "AI detects distractions & alerts your group in real-time",
      ],
    },
    {
      icon: Timer,
      title: "Live Focus Timer",
      subtitle: "Boost Concentration!",
      description: [
        "Pomodoro timer with custom study/break durations",
        "Live countdown for ongoing sessions",
        "Option to extend sessions without losing streaks",
      ],
    },
    {
      icon: Lightbulb,
      title: "AI Study Insights & Tips",
      subtitle: "Study Smarter, Not Harder!",
      description: [
        "AI analyzes your focus patterns & suggests better study schedules",
        "Get personalized study tips & efficiency hacks",
        "AI-generated focus music for deep concentration",
      ],
    },
    {
      icon: Trophy,
      title: "Leaderboard & Rewards",
      subtitle: "Turn Study into a Game!",
      description: [
        "Compete with friends on a study leaderboard",
        "Earn StudySync coins & redeem them for app perks",
        "Unlock exclusive themes & avatars by hitting milestones",
      ],
    },
    {
      icon: BookOpen,
      title: "Distraction Alerts & Focus Analytics",
      subtitle: "Stay on Track!",
      description: [
        "AI detects app-switching & sends real-time alerts",
        "See focus vs. distraction time breakdown in analytics",
        "Get weekly reports on your best & worst study habits",
      ],
    },
  ];

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            Features That Keep You Focused & Accountable
          </span>
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          StudySync combines AI-powered tools with social accountability to help
          you study more effectively
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-8">
          <TabsTrigger value="all">All Features</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-t-purple-500"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 rounded-full bg-purple-100">
                      <feature.icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                  <p className="text-sm font-medium text-purple-600">
                    {feature.subtitle}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.description.map((item, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <span className="text-purple-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="productivity" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features
              .filter((f) =>
                [
                  "Smart Study Goals",
                  "Quick Start Study Mode",
                  "Live Focus Timer",
                  "AI Study Insights & Tips",
                  "Distraction Alerts & Focus Analytics",
                ].includes(f.title),
              )
              .map((feature, index) => (
                <Card
                  key={index}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-t-purple-500"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-2 rounded-full bg-purple-100">
                        <feature.icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <p className="text-sm font-medium text-purple-600">
                      {feature.subtitle}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.description.map((item, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-purple-500 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features
              .filter((f) =>
                [
                  "Scheduled Study Sessions",
                  "Group Study & Challenges",
                  "Progress & Streak Tracker",
                  "Leaderboard & Rewards",
                ].includes(f.title),
              )
              .map((feature, index) => (
                <Card
                  key={index}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-t-purple-500"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="p-2 rounded-full bg-purple-100">
                        <feature.icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <p className="text-sm font-medium text-purple-600">
                      {feature.subtitle}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.description.map((item, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-purple-500 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
