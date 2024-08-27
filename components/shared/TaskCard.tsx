import { IPerson, ITask } from "@/lib/database/models/project.model";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import MoveToDesigningButton from "./MoveToDesigningButton";
import MoveBackToRequirement from "./MoveBackToRequirement";
import AssignMemberToTask from "./AssignMemberToTask";
import JoinTask from "./JoinTask";
import DeleteTask from "./DeleteTask";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import DoneTask from "./DoneTask";

const TaskCard = ({
  task,
  projectId,
  taskCardType,
}: {
  task: ITask;
  projectId: string;
  taskCardType:
    | "requirement"
    | "desighning_host"
    | "desighning_nohost"
    | "development_host"
    | "development_nohost"
    | "testing_host"
    | "testing_nohost"
    | "deployment_host"
    | "deployment_nohost"
    | "done_host"
    | "done_nohost"
    | "your_tasks";
}) => {
  return (
    <Card className="hover:bg-secondary/20 transition-all">
      <CardHeader className="flex flex-col gap-4">
        <p className="whitespace-nowrap text-lg overflow-hidden overflow-ellipsis">
          {task.task}
        </p>
      </CardHeader>
      <CardContent className="p-0 my-2">
        <div className="flex items-center ml-2">
          {task.assignedPeople.slice(0, 3).map((person: IPerson) => (
            <Avatar key={person._id.toString()} className="-ml-2 border-2">
              <AvatarImage src={person.userImage} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ))}
          {task.assignedPeople.length > 3 && (
            <Link
              href={`/project/${projectId}/members`}
              className="ml-2 text-sm text-muted-foreground hover:underline"
            >
              +{task.assignedPeople.length - 3} more
            </Link>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-0">
        {taskCardType === "requirement" && (
          <div className="flex flex-row gap-4">
            <DeleteTask taskId={task._id.toString()} projectId={projectId} />
            <MoveToDesigningButton
              taskId={task._id.toString()}
              projectId={projectId}
            />
          </div>
        )}
        {taskCardType === "desighning_host" && (
          <div className="flex flex-row gap-4">
            <MoveBackToRequirement
              taskId={task._id.toString()}
              projectId={projectId}
            />
            <JoinTask
              projectId={projectId}
              taskId={task._id.toString()}
              taskStatus={task.taskLocation}
            />
            <AssignMemberToTask
              taskId={task._id.toString()}
              projectId={projectId}
            />
          </div>
        )}
        {taskCardType === "desighning_nohost" && (
          <div className="flex flex-row gap-4">
            <JoinTask
              projectId={projectId}
              taskId={task._id.toString()}
              taskStatus={task.taskLocation}
            />
          </div>
        )}
        {taskCardType === "your_tasks" && (
          <div>
            <DoneTask
              projectId={projectId}
              taskId={task._id.toString()}
              taskStatus={task.taskLocation}
              taskDoneOrNot={task.isComplete}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
