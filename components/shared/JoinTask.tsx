"use client";

import { Button } from "../ui/button";
import { UserRoundPlus } from "lucide-react";
import { joinTaskFunc, getTaskStatus } from "@/lib/actions/project.actions"; // Import the joinTask action and getTaskStatus
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { handleError } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const JoinTask = ({
  projectId,
  taskId,
  taskStatus,
}: {
  projectId: string;
  taskId: string;
  taskStatus: string;
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const handleJoin = async () => {
    try {
      const response = await joinTaskFunc(projectId, taskId);
      if (response === "success") {
        router.refresh();
        toast({
          title: "Joined the task successfully",
        });
      } else if (response === "already_complete") {
        toast({
          title: "Couldn't join the task",
          description:"Task is already completed",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to join task",
          description: response,
          variant: "destructive",
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  let taskPos;

  if (taskStatus === "designing" || taskStatus === "pending_designing") {
    taskPos = "Designer";
  } else if (
    taskStatus === "development" ||
    taskStatus === "pending_development"
  ) {
    taskPos = "Developer";
  } else if (taskStatus === "testing" || taskStatus === "pending_testing") {
    taskPos = "Tester";
  } else if (
    taskStatus === "deployment" ||
    taskStatus === "pending_deployment"
  ) {
    taskPos = "Deployer";
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="onPrentHover border-0" size="icon">
          <UserRoundPlus className="opacity-50 transition-all" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure to to join as a {taskPos}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleJoin}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default JoinTask;
