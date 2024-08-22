import { ITask } from "@/lib/database/models/project.model";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import MoveToTodoButton from "./MoveToTodoButton";
import MoveBackToRequirement from "./MoveBackToRequirement";
import AssignMemberToTask from "./AssignMemberToTask";
import JoinTask from "./JoinTask";
const TaskCard = ({
  task,
  projectId,
  taskCardType,
}: {
  task: ITask;
  projectId: string;
  taskCardType: "requirement" | "todoHost" | "todoNoHost" | "in_progress";
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
            <AssignMemberToTask
              taskId={task._id.toString()}
              projectId={projectId}
            />
            <MoveBackToRequirement
              taskId={task._id.toString()}
              projectId={projectId}
            />
          </div>
        )}
        {taskCardType === "todoNoHost" && (
          <div className="flex flex-row gap-4">
            <JoinTask
              projectId={projectId}
              taskId={task._id.toString()}
            />
          </div>
        )}
        {/* {taskCardType === "in_progress" && (
          <div className="flex flex-row gap-4">
            <JoinTask
              projectId={projectId}
              taskId={task._id.toString()}
              userId={userId as string}
            />
          </div>
        )} */}
      </CardHeader>
    </Card>
  );
};

export default TaskCard;
