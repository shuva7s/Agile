"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getProjectById } from "@/lib/actions/project.actions";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  searchingProjectId: z
    .string().length(24, "project id must contain 16 characters"),
});

export function JoinProjectForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      searchingProjectId: "",
    },
  });

  const { toast } = useToast();
  const router = useRouter();

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let project = await getProjectById(values.searchingProjectId);
      if (!project) {
        toast({
          title: "No projects found",
          description: "Enter a valid project ID",
        });
      } else {
        router.push(`/project/${values.searchingProjectId}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="searchingProjectId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter a valid project ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter Project Id" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full"
          type="submit"
        >
          Search
        </Button>
      </form>
    </Form>
  );
}
