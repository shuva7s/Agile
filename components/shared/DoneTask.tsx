// components/DoneTask.tsx

"use client"; // Ensure this is a client component

import { CheckCircle, Check } from "lucide-react"; // Import icons from Lucide React
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { toggleTaskCompletion } from "@/lib/actions/project.actions";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { handleError } from "@/lib/utils";

export default function DoneTask({
  projectId,
  taskId,
  taskStatus,
  taskDoneOrNot,
}: {
  projectId: string;
  taskId: string;
  taskStatus: string;
  taskDoneOrNot: boolean;
}) {
  // const [isComplete, setIsComplete] = useState(taskDoneOrNot);
  const router = useRouter();
  const { toast } = useToast();

  const handleToggle = async () => {
    // setIsComplete((prevStatus) => !prevStatus);
    try {
      const response = await toggleTaskCompletion(projectId, taskId);
      if (response === "success") {
        router.refresh();
      } else {
        toast({
          title: "Failed to change task status",
          description: response,
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
          {taskDoneOrNot ? (
            <CheckCircle className="text-green-500" />
          ) : (
            <Check className="text-muted-foreground" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Mark as {taskDoneOrNot ? "Undone" : "Done"}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleToggle}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
