import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Brain, Clock, Sparkles, Sun, Moon, Zap, Plus } from "lucide-react";

export default function StudyPlanner() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    mood: "",
    timeAvailable: "1-2",
    energyLevel: "high",
    subjects: [] as string[],
  });
  const [suggestedSubjects, setSuggestedSubjects] = useState<string[]>([]);
  const [studyPlan, setStudyPlan] = useState<any>(null);

  const generateSubjectSuggestions = (mood: string, energyLevel: string) => {
    const suggestions = {
      energetic: {
        high: ["Mathematics", "Programming", "Physics", "Language Learning"],
        medium: ["History", "Literature", "Biology", "Chemistry"],
        low: ["Art History", "Philosophy", "Music Theory", "Psychology"],
      },
      focused: {
        high: ["Data Structures", "Calculus", "Research Methods", "Economics"],
        medium: [
          "Business Studies",
          "Geography",
          "Political Science",
          "Statistics",
        ],
        low: [
          "Creative Writing",
          "Sociology",
          "Environmental Science",
          "Design",
        ],
      },
      relaxed: {
        high: [
          "Foreign Languages",
          "Computer Science",
          "Engineering",
          "Finance",
        ],
        medium: ["Marketing", "Psychology", "Anthropology", "Communication"],
        low: ["Literature", "Art", "Music", "Film Studies"],
      },
    };

    return suggestions[mood as keyof typeof suggestions]?.[energyLevel] || [];
  };

  const getStudyTechnique = (
    subject: string,
    energyLevel: string,
    index: number,
  ) => {
    const techniques = {
      high: [
        "Active Recall",
        "Feynman Technique",
        "Mind Mapping",
        "Practice Problems",
        "Teaching Others",
      ],
      medium: [
        "Cornell Note-Taking",
        "Spaced Repetition",
        "Concept Mapping",
        "Summarization",
        "Question Generation",
      ],
      low: [
        "Simple Note-Taking",
        "Audio Recording",
        "Visual Learning",
        "Flashcards",
        "Mind Mapping",
      ],
    };

    const subjectSpecificTechniques = {
      Mathematics: ["Problem Solving", "Formula Practice", "Concept Mapping"],
      Programming: [
        "Code Practice",
        "Project Building",
        "Documentation Reading",
      ],
      Physics: ["Problem Sets", "Concept Visualization", "Lab Work Review"],
      "Language Learning": [
        "Immersion Practice",
        "Vocabulary Drills",
        "Conversation Practice",
      ],
      History: ["Timeline Creation", "Source Analysis", "Event Mapping"],
      Literature: ["Critical Reading", "Character Analysis", "Theme Mapping"],
    };

    // Mix general and subject-specific techniques
    const generalTechniques =
      techniques[energyLevel as keyof typeof techniques];
    const specificTechniques =
      subjectSpecificTechniques[
        subject as keyof typeof subjectSpecificTechniques
      ] || [];

    const allTechniques = [...generalTechniques, ...specificTechniques];
    return allTechniques[index % allTechniques.length];
  };

  const generateAIPlan = () => {
    const planHours =
      answers.timeAvailable === "1-2"
        ? 1.5
        : answers.timeAvailable === "2-4"
          ? 3
          : 5;

    const sessions = [];
    let currentHour = 9;

    const blockLength =
      answers.energyLevel === "high"
        ? 45
        : answers.energyLevel === "medium"
          ? 30
          : 20;

    const totalBlocks = Math.floor((planHours * 60) / (blockLength + 10));
    let subjectIndex = 0;

    for (let i = 0; i < totalBlocks; i++) {
      const currentSubject =
        answers.subjects[subjectIndex % answers.subjects.length];
      sessions.push({
        startTime: `${currentHour}:00`,
        duration: blockLength,
        type: "study",
        activity: `${currentSubject} Study Session`,
        subject: currentSubject,
        technique: getStudyTechnique(currentSubject, answers.energyLevel, i),
      });

      sessions.push({
        startTime: `${currentHour}:${blockLength}`,
        duration: 10,
        type: "break",
        recommendations: [
          "Stand up and stretch",
          "Drink water",
          "Deep breathing",
        ],
      });

      currentHour += 1;
      subjectIndex++;
    }

    return sessions;
  };

  const handleMoodSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const suggestions = generateSubjectSuggestions(
      answers.mood,
      answers.energyLevel,
    );
    setSuggestedSubjects(suggestions);
    setStep(2);

    if (user) {
      await supabase.from("ai_subject_suggestions").insert({
        user_id: user.id,
        mood: answers.mood,
        energy_level: answers.energyLevel,
        suggested_subjects: suggestions,
      });
    }
  };

  const handlePlanSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    try {
      const schedule = generateAIPlan();
      await supabase.from("ai_study_plans").upsert({
        user_id: user.id,
        plan_date: new Date().toISOString().split("T")[0],
        schedule,
      });

      setStudyPlan({ schedule });
      setStep(3);
      toast({
        title: "Study plan created!",
        description: "Your personalized study plan is ready.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create plan",
        variant: "destructive",
      });
    }
  };

  const addCustomSubject = (value: string) => {
    if (value && !answers.subjects.includes(value)) {
      setAnswers({
        ...answers,
        subjects: [...answers.subjects, value],
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">AI Study Planner</h1>

      <div className="max-w-2xl mx-auto">
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                How are you feeling today?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleMoodSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>Current Mood</Label>
                    <RadioGroup
                      value={answers.mood}
                      onValueChange={(value) =>
                        setAnswers({ ...answers, mood: value })
                      }
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="energetic" id="energetic" />
                        <Label
                          htmlFor="energetic"
                          className="flex items-center gap-2"
                        >
                          <Sun className="w-4 h-4" /> Energetic
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="focused" id="focused" />
                        <Label
                          htmlFor="focused"
                          className="flex items-center gap-2"
                        >
                          <Zap className="w-4 h-4" /> Focused
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="relaxed" id="relaxed" />
                        <Label
                          htmlFor="relaxed"
                          className="flex items-center gap-2"
                        >
                          <Moon className="w-4 h-4" /> Relaxed
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label>Energy Level</Label>
                    <RadioGroup
                      value={answers.energyLevel}
                      onValueChange={(value) =>
                        setAnswers({ ...answers, energyLevel: value })
                      }
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="high" id="high" />
                        <Label htmlFor="high">High</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium">Medium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="low" id="low" />
                        <Label htmlFor="low">Low</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!answers.mood || !answers.energyLevel}
                >
                  Get Subject Suggestions
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Select Your Subjects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePlanSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label>AI Suggested Subjects</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {suggestedSubjects.map((subject) => (
                        <Button
                          key={subject}
                          type="button"
                          variant={
                            answers.subjects.includes(subject)
                              ? "default"
                              : "outline"
                          }
                          className="w-full justify-start"
                          onClick={() => {
                            const newSubjects = answers.subjects.includes(
                              subject,
                            )
                              ? answers.subjects.filter((s) => s !== subject)
                              : [...answers.subjects, subject];
                            setAnswers({ ...answers, subjects: newSubjects });
                          }}
                        >
                          {subject}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Add Your Own Subjects</Label>
                    <div className="flex gap-2">
                      <Input
                        id="customSubject"
                        className="mt-2"
                        placeholder="e.g., Mathematics, History, Programming"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomSubject(
                              (e.target as HTMLInputElement).value,
                            );
                            (e.target as HTMLInputElement).value = "";
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-2"
                        onClick={() => {
                          const input = document.getElementById(
                            "customSubject",
                          ) as HTMLInputElement;
                          addCustomSubject(input.value);
                          input.value = "";
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {answers.subjects.map((subject) => (
                        <Badge
                          key={subject}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => {
                            setAnswers({
                              ...answers,
                              subjects: answers.subjects.filter(
                                (s) => s !== subject,
                              ),
                            });
                          }}
                        >
                          {subject} ×
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>How much time do you have?</Label>
                    <RadioGroup
                      value={answers.timeAvailable}
                      onValueChange={(value) =>
                        setAnswers({ ...answers, timeAvailable: value })
                      }
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1-2" id="1-2" />
                        <Label htmlFor="1-2">1-2 hours</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2-4" id="2-4" />
                        <Label htmlFor="2-4">2-4 hours</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="4+" id="4+" />
                        <Label htmlFor="4+">4+ hours</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={answers.subjects.length === 0}
                >
                  Generate Study Plan
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {step === 3 && studyPlan && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Your Study Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {studyPlan.schedule.map((block: any, index: number) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${block.type === "study" ? "bg-purple-50" : "bg-green-50"}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">
                        {block.type === "study" ? (
                          <div className="flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            {block.activity}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Break Time
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(`2000/01/01 ${block.startTime}`)
                          .toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })
                          .toUpperCase()}{" "}
                        ({block.duration} min)
                      </div>
                    </div>

                    {block.type === "study" && (
                      <div className="mt-2 space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Technique:</span>{" "}
                          {block.technique}
                        </div>
                      </div>
                    )}

                    {block.type === "break" && (
                      <div className="text-sm text-green-600 mt-2">
                        💡 Suggested: {block.recommendations[0]}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep(1);
                    setStudyPlan(null);
                    setAnswers({
                      mood: "",
                      timeAvailable: "1-2",
                      energyLevel: "high",
                      subjects: [],
                    });
                  }}
                >
                  Create New Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
