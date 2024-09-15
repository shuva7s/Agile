"use client";
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
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { deleteProject } from "@/lib/actions/project.actions";

const DeleteProjectButton = ({ projectId }: { projectId: string }) => {
  const { toast } = useToast();
  const router = useRouter();
  async function handleOnclick() {
    try {
      const msg = await deleteProject(projectId);
      if (msg === "success") toast({ title: "Project deleted successfully." });
      else if (msg === "npf") toast({ title: "No project found." });
      else toast({ title: "Something went wrong..!" });
      router.replace("/");
    } catch (error) {
      toast({ title: "Something went wrong..!" });
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will delete this project and all its associated data.
            This can not be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleOnclick}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteProjectButton;
