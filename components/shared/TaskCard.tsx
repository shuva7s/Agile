import { ITask } from "@/lib/database/models/project.model";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import MoveToTodoButton from "./MoveToTodoButton";
import Link from "next/link";
import { Button } from "../ui/button";
import { UserRoundPlus } from "lucide-react";
import MoveBackToRequirement from "./MoveBackToRequirement";
import { CirclePlus } from "lucide-react";
const TaskCard = ({
  task,
  projectId,
  taskCardType,
}: {
  task: ITask;
  projectId: string;
  taskCardType: "requirement" | "todoHost" | "todoNoHost";
}) => {
  return (
    <Card className="hover:bg-secondary/20 transition-all">
      <CardHeader className="flex flex-col gap-4">
        <p className="whitespace-nowrap text-lg overflow-hidden overflow-ellipsis">
          {task.task}
        </p>
        {taskCardType === "requirement" && (
          <MoveToTodoButton
            taskId={task._id.toString()}
            projectId={projectId}
          />
        )}
        {taskCardType === "todoHost" && (
          <div className="flex flex-row gap-4">
            <Button asChild variant="outline" size="icon">
              <Link className="onPrentHover" href={""}>
                <UserRoundPlus className="opacity-50 transition-all" />
              </Link>
            </Button>
            <MoveBackToRequirement
              taskId={task._id.toString()}
              projectId={projectId}
            />
          </div>
        )}
        {taskCardType === "todoNoHost" && (
          <div className="flex flex-row gap-4">
            <Button variant="outline" size="icon" className="onPrentHover border-0">
              <CirclePlus className="opacity-50 transition-all" />
            </Button>
          </div>
        )}
      </CardHeader>
    </Card>
  );
};

export default TaskCard;
