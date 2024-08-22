import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { UserRoundPlus } from "lucide-react";
import Link from "next/link";

const AssignMemberToTask = ({
  taskId,
  projectId,
}: {
  taskId: string;
  projectId: string;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="onPrentHover border-0"
            size="icon"
          >
            <Link href={`/project/${projectId}/task/${taskId}`}>
              <UserRoundPlus className="opacity-50 transition-all" />
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Assign member</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AssignMemberToTask;
