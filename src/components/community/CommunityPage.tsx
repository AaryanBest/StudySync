import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Book,
  GraduationCap,
  Calculator,
  Landmark,
  Cpu,
  Globe,
  Users,
  LogOut,
} from "lucide-react";
import { LeaveGroupDialog } from "./LeaveGroupDialog";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";

export default function CommunityPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [members, setMembers] = useState<Record<string, number>>({});
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    loadData();

    // Subscribe to changes in the study_group_members table
    const channel = supabase
      .channel("study_group_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "study_group_members" },
        () => {
          loadData();
          if (user) loadUserGroups();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const loadData = async () => {
    // Load categories
    const { data: categoriesData } = await supabase
      .from("exam_categories")
      .select("*");
    setCategories(categoriesData || []);

    // Load member counts
    const { data: membersData } = await supabase
      .from("study_group_members")
      .select("group_id");

    const memberCounts: Record<string, number> = {};
    if (membersData) {
      // Count occurrences of each group_id
      membersData.forEach((item) => {
        if (memberCounts[item.group_id]) {
          memberCounts[item.group_id]++;
        } else {
          memberCounts[item.group_id] = 1;
        }
      });
    }
    setMembers(memberCounts);
  };

  const getIconForCategory = (name: string) => {
    const icons: Record<string, any> = {
      "10th Grade": Book,
      "12th Grade": GraduationCap,
      "IIT JEE": Calculator,
      UPSC: Landmark,
      GATE: Cpu,
      "Foreign Universities": Globe,
    };
    return icons[name] || Book;
  };

  const [userGroups, setUserGroups] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      loadUserGroups();
    }
  }, [user]);

  const loadUserGroups = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("study_group_members")
      .select("group_id")
      .eq("user_id", user.id);

    setUserGroups(data?.map((item) => item.group_id) || []);
  };

  const joinCategory = async (categoryId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to join study groups",
        variant: "destructive",
      });
      return;
    }

    try {
      // Check if user is already a member
      const { data: existingMembership } = await supabase
        .from("study_group_members")
        .select("*")
        .eq("group_id", categoryId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingMembership) {
        toast({
          title: "Already a member",
          description: "You are already a member of this study group",
        });
        return;
      }

      // Insert the user into the study group members table
      const { error } = await supabase.from("study_group_members").insert({
        group_id: categoryId,
        user_id: user.id,
        joined_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Update local state to reflect the change immediately
      setUserGroups([...userGroups, categoryId]);

      // Update the member count locally
      setMembers({
        ...members,
        [categoryId]: (members[categoryId] || 0) + 1,
      });

      toast({
        title: "Success!",
        description: "You've joined the study group",
      });
    } catch (error) {
      console.error("Join error:", error);
      toast({
        title: "Error",
        description: "Failed to join group. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Study Communities</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Join subject-specific study groups and learn together
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = getIconForCategory(category.name);
          const memberCount = members[category.id] || 0;

          return (
            <Card
              key={category.id}
              className="relative overflow-hidden hover:shadow-lg hover:bg-purple-50/50 transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  {category.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {category.description}
                </p>
                <div className="flex justify-between items-center">
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Users className="w-4 h-4" />
                    {memberCount} members
                  </Badge>
                  {userGroups.includes(category.id) ? (
                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => {
                        setSelectedGroup({
                          id: category.id,
                          name: category.name,
                        });
                        setLeaveDialogOpen(true);
                      }}
                    >
                      <LogOut className="w-4 h-4" /> Leave Group
                    </Button>
                  ) : (
                    <Button
                      onClick={() => joinCategory(category.id)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Join Community
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedGroup && (
        <LeaveGroupDialog
          isOpen={leaveDialogOpen}
          onClose={() => setLeaveDialogOpen(false)}
          groupId={selectedGroup.id}
          groupName={selectedGroup.name}
          onLeaveSuccess={() => {
            setUserGroups(userGroups.filter((id) => id !== selectedGroup.id));
            setMembers({
              ...members,
              [selectedGroup.id]: Math.max(
                0,
                (members[selectedGroup.id] || 1) - 1,
              ),
            });
          }}
        />
      )}
    </div>
  );
}
