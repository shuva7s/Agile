"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useUser } from "@clerk/nextjs";
import { createProject } from "@/lib/actions/project.actions";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { DialogClose } from "../ui/dialog";
import { handleError } from "@/lib/utils";

const formSchema = z.object({
  projectName: z.string().min(3, "Project name must be atleast 3 characters"),
  projectDescription: z.string().optional(),
});

export function CreateProjectForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      projectDescription: "",
    },
  });

  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Prepare the data for creating the project
      const projectData: CreateProjectParams = {
        hostClerkId: user?.id || "",
        projectName: values.projectName,
        projectDescription: values.projectDescription || "",
        people: [], // Array of objects with userId and username
        logs: [], // Array of log objects
        todo: [], // Array of task objects for todo
        inProgress: [], // Array of task objects for in-progress
        testing: [], // Array of task objects for testing
        done: [], // Array of task objects for done
        joinRequests: [], // Array of join request objects
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Call the createProject function
      const newProject = await createProject(projectData);
      console.dir(newProject);

      if (newProject) {
        form.reset();

        const date = new Date(newProject.createdAt);
        const dateFormatter = new Intl.DateTimeFormat("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        const timeFormatter = new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        const formattedDate = dateFormatter.format(date);
        const formattedTime = timeFormatter.format(date);
        const formattedDateTime = `${formattedDate} at ${formattedTime}`;

        toast({
          title: "New Project Created",
          description: formattedDateTime,
        });

        router.push(`/project/${newProject._id}`);
        router.refresh();
      }
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input required placeholder="Project Name" {...field} />
              </FormControl>
              <FormDescription>This is your project name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="projectDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Input placeholder="Project Description" {...field} />
              </FormControl>
              <FormDescription>This is project description.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogClose asChild>
          <Button type="submit">Save</Button>
        </DialogClose>
      </form>
    </Form>
  );
}
