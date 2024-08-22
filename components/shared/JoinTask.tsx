"use client";

import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { CirclePlus } from "lucide-react";
import { joinTaskFunc } from "@/lib/actions/project.actions"; // Import the joinTask action
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { handleError } from "@/lib/utils";

const JoinTask = ({
  projectId,
  taskId,
}: {
  projectId: string;
  taskId: string;
}) => {
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const handleJoin = async () => {
    setIsJoining(true);
    try {
      const response = await joinTaskFunc(projectId, taskId);
      if (response === "success") {
        router.refresh();
        toast({
          title: "Joinded into project successfully",
        });
      } else {
        toast({
          title: `Failed to join task`,
          description: response,
          variant: "destructive",
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="onPrentHover border-0"
            onClick={handleJoin}
            disabled={isJoining}
          >
            <CirclePlus className="opacity-50 transition-all" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Join this task</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default JoinTask;
