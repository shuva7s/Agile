"use client";

import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { handleError } from "@/lib/utils";
import { moveTaskBackToRequirements } from "@/lib/actions/project.actions";
import { Undo2 } from "lucide-react";
const MoveBackToRequirement = ({
  taskId,
  projectId,
}: {
  taskId: string;
  projectId: string;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const handleClick = async () => {
    setIsProcessing(true); // Disable the button
    try {
      const response = await moveTaskBackToRequirements(projectId, taskId);
      if (response === "success") {
        router.refresh();
        toast({
          title: "Task moved back to Requirements",
        });
      } else {
        toast({
          title: "Failed to move task",
          variant: "destructive",
        });
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsProcessing(false); // Re-enable the button
    }
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="rounded-full onPrentHover"
            size="icon"
            onClick={handleClick}
            disabled={isProcessing} // Disable button during processing
          >
            <Undo2 className="opacity-50 transition-all" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Move back to requirements</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MoveBackToRequirement;
