import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface CreateRoomDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRoomDialog({ isOpen, onClose }: CreateRoomDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      // Create the room
      const { data: room, error: roomError } = await supabase
        .from("study_rooms")
        .insert({
          title: formData.get("title") as string,
          description: formData.get("description") as string,
          mode: formData.get("mode") as "silent" | "timed" | "qa",
          host_id: user.id,
          is_active: true,
          max_participants:
            parseInt(formData.get("maxParticipants") as string) || 10,
        })
        .select()
        .single();

      if (roomError) throw roomError;

      // Join the room as host
      const { error: participantError } = await supabase
        .from("room_participants")
        .insert({
          room_id: room.id,
          user_id: user.id,
          is_muted: true,
        });

      if (participantError) throw participantError;

      toast({
        title: "Room created!",
        description: "Your study room has been created successfully.",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create room",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Study Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Room Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Math Study Group"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="What will you be studying?"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Study Mode</Label>
            <RadioGroup
              defaultValue="silent"
              name="mode"
              className="grid grid-cols-3 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="silent" id="silent" />
                <Label htmlFor="silent">Silent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="timed" id="timed" />
                <Label htmlFor="timed">Timed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="qa" id="qa" />
                <Label htmlFor="qa">Q&A</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxParticipants">Max Participants</Label>
            <Input
              id="maxParticipants"
              name="maxParticipants"
              type="number"
              defaultValue="10"
              min="2"
              max="50"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Room"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
