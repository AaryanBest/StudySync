import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Timer, AlertCircle, Users, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

export default function FocusChallenge() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeChallenge, setActiveChallenge] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [distractionCount, setDistractionCount] = useState(0);
  const [quote, setQuote] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadChallengeData();
      subscribeToChallenge();
      monitorDistractions();
      loadRandomQuote();
    }
  }, [user]);

  const loadRandomQuote = async () => {
    try {
      // Try to get a quote from the database first
      const { data } = await supabase
        .from("motivational_quotes")
        .select("*")
        .order("random()")
        .limit(1)
        .single();

      if (data) {
        setQuote(data);
        return;
      }

      // If no quotes in DB, use AI-generated quotes about success and focus
      const successQuotes = [
        {
          quote:
            "Success is not final, failure is not fatal: it is the courage to continue that counts.",
          author: "Winston Churchill",
        },
        {
          quote:
            "The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack in will.",
          author: "Vince Lombardi",
        },
        {
          quote:
            "The secret of success is to do the common thing uncommonly well.",
          author: "John D. Rockefeller Jr.",
        },
        {
          quote:
            "Success is not how high you have climbed, but how you make a positive difference to the world.",
          author: "Roy T. Bennett",
        },
        {
          quote:
            "Success is stumbling from failure to failure with no loss of enthusiasm.",
          author: "Winston Churchill",
        },
        {
          quote:
            "The road to success and the road to failure are almost exactly the same.",
          author: "Colin R. Davis",
        },
        {
          quote:
            "Success usually comes to those who are too busy to be looking for it.",
          author: "Henry David Thoreau",
        },
        {
          quote: "Your focus determines your reality.",
          author: "George Lucas",
        },
        {
          quote:
            "Concentrate all your thoughts upon the work in hand. The sun's rays do not burn until brought to a focus.",
          author: "Alexander Graham Bell",
        },
        {
          quote:
            "It's not that I'm so smart, it's just that I stay with problems longer.",
          author: "Albert Einstein",
        },
        {
          quote:
            "The successful warrior is the average man, with laser-like focus.",
          author: "Bruce Lee",
        },
        {
          quote: "Where focus goes, energy flows.",
          author: "Tony Robbins",
        },
        {
          quote:
            "Lack of direction, not lack of time, is the problem. We all have twenty-four hour days.",
          author: "Zig Ziglar",
        },
        {
          quote:
            "The more you lose yourself in something bigger than yourself, the more energy you will have.",
          author: "Norman Vincent Peale",
        },
        {
          quote: "Don't watch the clock; do what it does. Keep going.",
          author: "Sam Levenson",
        },
      ];

      // Select a random quote from our collection
      const randomIndex = Math.floor(Math.random() * successQuotes.length);
      setQuote(successQuotes[randomIndex]);
    } catch (error) {
      console.error("Error loading quote:", error);
      // Fallback quote
      setQuote({
        quote:
          "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
      });
    }
  };

  const loadChallengeData = async () => {
    // Load active challenge
    const { data: challengeData } = await supabase
      .from("focus_challenges")
      .select("*")
      .gte("end_time", new Date().toISOString())
      .order("start_time", { ascending: true })
      .limit(1)
      .single();

    setActiveChallenge(challengeData);

    if (challengeData) {
      // Load participants
      const { data: participantsData } = await supabase
        .from("focus_challenge_participants")
        .select("*, profiles(*)")
        .eq("challenge_id", challengeData.id)
        .order("total_focus_time", { ascending: false });

      setParticipants(participantsData || []);
    }
  };

  const subscribeToChallenge = () => {
    supabase
      .channel("focus_challenges")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "focus_challenge_participants" },
        () => loadChallengeData(),
      )
      .subscribe();
  };

  const monitorDistractions = () => {
    // Monitor window blur events (tab switching)
    const handleVisibilityChange = () => {
      if (document.hidden && activeChallenge) {
        setDistractionCount((prev) => prev + 1);
        updateDistractionCount();
        toast({
          title: "Focus Lost!",
          description: "Stay focused! Switching tabs counts as a distraction.",
          variant: "destructive",
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  };

  const updateDistractionCount = async () => {
    if (!user || !activeChallenge) return;

    await supabase
      .from("focus_challenge_participants")
      .upsert({
        challenge_id: activeChallenge.id,
        user_id: user.id,
        distraction_count: distractionCount + 1,
        last_distraction: new Date().toISOString(),
      })
      .select();
  };

  const joinChallenge = async () => {
    if (!user || !activeChallenge) return;

    try {
      await supabase.from("focus_challenge_participants").upsert({
        challenge_id: activeChallenge.id,
        user_id: user.id,
        distraction_count: 0,
        total_focus_time: 0,
      });

      toast({
        title: "Challenge Joined!",
        description: "Stay focused and minimize distractions to win!",
      });

      loadChallengeData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to join the challenge",
        variant: "destructive",
      });
    }
  };

  const createChallenge = async () => {
    if (!user) return;

    try {
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour challenge

      const { data: challenge } = await supabase
        .from("focus_challenges")
        .insert({
          title: "1 Hour Focus Challenge",
          description: "Stay focused for one hour!",
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          created_by: user.id,
        })
        .select()
        .single();

      if (challenge) {
        await joinChallenge();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create the challenge",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Focus Challenge</h1>
        {!activeChallenge && (
          <Button onClick={createChallenge}>
            <Trophy className="w-4 h-4 mr-2" /> Start New Challenge
          </Button>
        )}
      </div>

      <Card className="mb-6 overflow-hidden border-t-4 border-t-purple-500 shadow-md hover:shadow-lg transition-all duration-300">
        <CardContent className="pt-6 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
          {quote && (
            <div className="text-center space-y-4">
              <p className="text-xl italic text-gray-700 leading-relaxed">
                "{quote.quote}"
              </p>
              <p className="text-sm text-muted-foreground">— {quote.author}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={loadRandomQuote}
                className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 mr-2 text-purple-500" /> Inspire Me
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {activeChallenge ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Active Challenge</span>
                  <Timer className="w-5 h-5 text-purple-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {activeChallenge.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {activeChallenge.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className="text-sm">
                      <Users className="w-4 h-4 mr-1" />
                      {participants.length} Participants
                    </Badge>
                    {!participants.find((p) => p.user_id === user?.id) && (
                      <Button size="sm" onClick={joinChallenge}>
                        Join Challenge
                      </Button>
                    )}
                  </div>

                  {participants.find((p) => p.user_id === user?.id) && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center text-red-600 mb-2">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        Your Distractions
                      </div>
                      <div className="text-2xl font-bold text-red-600">
                        {distractionCount}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Leaderboard</span>
                  <Trophy className="w-5 h-5 text-yellow-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {participants.map((participant, index) => (
                    <div
                      key={participant.user_id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                                ? "bg-gray-400"
                                : index === 2
                                  ? "bg-amber-600"
                                  : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">
                            {participant.profiles?.username}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {participant.distraction_count} distractions
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Trophy className="w-12 h-12 mx-auto text-purple-500" />
                <h3 className="text-lg font-semibold">
                  No Active Focus Challenge
                </h3>
                <p className="text-muted-foreground">
                  Start a new challenge and compete with friends to stay
                  focused!
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
