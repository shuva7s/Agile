"use client";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { handleError } from "@/lib/utils";
const MoveToDoneButton = ({
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
      // const response = await moveTaskToTodo(projectId, taskId);
      let response
      if (response === "success") {
        router.refresh();
        toast({
          title: "Task moved to TODO",
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
            className="self-end rounded-full onPrentHover"
            size="icon"
            onClick={handleClick}
            disabled={isProcessing} // Disable button during processing
          >
            <ArrowRight className="opacity-50 transition-all" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Push to TODO</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MoveToDoneButton;
