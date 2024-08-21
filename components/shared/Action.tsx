import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateProjectForm } from "./CreateProjectForm";
import { JoinProjectForm } from "./JoinProjectForm";

function Action({ actionType }: { actionType: "create" | "join" }) {
  if (actionType === "create") {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="font-medium w-full sm:w-1/2 py-8"
            variant="outline"
          >
            Create project
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Create prject and click Save when you're done.
            </DialogDescription>
          </DialogHeader>
          <CreateProjectForm />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="font-medium w-full sm:w-1/2 py-8"
          variant="secondary"
        >
          Join project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join Project</DialogTitle>
          <DialogDescription>Search project by Id</DialogDescription>
        </DialogHeader>
        <JoinProjectForm />
      </DialogContent>
    </Dialog>
  );
}

export default Action;
