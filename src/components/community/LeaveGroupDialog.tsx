import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface LeaveGroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  groupName: string;
  onLeaveSuccess: () => void;
}

export function LeaveGroupDialog({
  isOpen,
  onClose,
  groupId,
  groupName,
  onLeaveSuccess,
}: LeaveGroupDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleLeave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await supabase
        .from("study_group_members")
        .delete()
        .eq("group_id", groupId)
        .eq("user_id", user.id);

      toast({
        title: "Left group",
        description: `You have left the ${groupName} study group`,
      });
      onLeaveSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to leave the group",
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
          <DialogTitle>Leave Study Group</DialogTitle>
          <DialogDescription>
            Are you sure you want to leave the {groupName} study group?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleLeave}
            disabled={isLoading}
          >
            {isLoading ? "Leaving..." : "Leave Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
