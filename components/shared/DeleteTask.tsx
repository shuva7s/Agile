"use client";
import { Button } from "../ui/button";
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
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { handleError } from "@/lib/utils";
import { Trash } from "lucide-react";
import { deleteRequirement } from "@/lib/actions/project.actions";

const DeleteTask = ({
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
      const response = await deleteRequirement(projectId, taskId);
      if (response === "success") {
        router.refresh();
        toast({
          title: "Requirement deleted",
        });
      } else {
        toast({
          title: "Failed to delete requirement",
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
        <Button
          variant="outline"
          className="self-end rounded-full onPrentHover"
          size="icon"
        >
          <Trash className="opacity-50 transition-all w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
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

export default DeleteTask;
