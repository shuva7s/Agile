"use client";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
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
import { Button } from "../ui/button";
import { deleteMemberAction } from "@/lib/actions/other.actions";

type memberDeletionProps = {
  hostClerkId: string;
  projectId: string;
  memberName: string;
  memberClerkId: string;
};

const RemoveMember = ({
  hostClerkId,
  projectId,
  memberName,
  memberClerkId,
}: memberDeletionProps) => {
  const { toast } = useToast();
  const router = useRouter();
  async function handleOnclick() {
    try {
      const msg = await deleteMemberAction({
        hostClerkId,
        projectId,
        memberClerkId,
      });
      if (msg === "success") toast({ title: "Member removed successfully." });
      else if (msg === "nhf") toast({ title: "No host found." });
      else if (msg === "npf") toast({ title: "No project found." });
      else toast({ title: "Something went wrong..!" });
      router.refresh();
    } catch (error) {
      toast({ title: "Something went wrong..!" });
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="destructive">Remove</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. Member{" "}
            <span className="font-semibold">@{memberName}</span> will be removed
            from this project.
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

export default RemoveMember;
