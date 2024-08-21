"use client";
import { Button } from "../ui/button";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addRequirement } from "@/lib/actions/project.actions";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { handleError } from "@/lib/utils";

const formSchema = z.object({
  taskName: z.string().min(2).max(50),
});

const AddRequirement = ({ projectId }: { projectId: string }) => {
  const router = useRouter();
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await addRequirement(projectId, values.taskName);

      if (response === "invalid_id") {
        router.refresh();
        toast({
          title: "Invalid Project ID",
        });
      } else if (response === "not_found") {
        router.refresh();
        toast({
          title: "Project not Found",
        });
      } else if (response === "success") {
        router.refresh();
        toast({
          title: "Task saved",
        });
      } else {
        router.refresh();
        toast({
          title: "An error occurred while adding the requirement",
        });
      }
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="min-h-20 h-full w-full" variant="secondary">
          Add requirement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add requirement</DialogTitle>
          <DialogDescription>Add a requirement and save.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="taskName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name of the task.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogClose asChild>
              <Button type="submit">Save</Button>
            </DialogClose>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRequirement;
