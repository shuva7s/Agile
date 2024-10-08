"use client";

import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import { handleError } from "@/lib/utils";
import { moveTaskBackToRequirements } from "@/lib/actions/project.actions";
import { ArrowLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
const MoveBackToRequirement = ({
  taskId,
  projectId,
}: {
  taskId: string;
  projectId: string;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const handleClick = async () => {
    try {
      const response = await moveTaskBackToRequirements(projectId, taskId);
      if (response === "success") {
        router.refresh();
        toast({
          title: "Task moved back to Requirements",
        });
      } else {
        toast({
          title: "Failed to move task",
          variant: "destructive",
        });
      }
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="onPrentHover border-0" size="icon">
          <ArrowLeft className="opacity-50 transition-all" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will remove all the members in this task and move the
            task back to requirements.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleClick}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MoveBackToRequirement;
