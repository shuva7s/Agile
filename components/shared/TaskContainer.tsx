import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import AddRequirement from "@/components/shared/AddRequirement";
import TaskCard from "./TaskCard";
import {
  getAllTodos,
  getProjectRequirements,
} from "@/lib/actions/project.actions";
import { ITask } from "@/lib/database/models/project.model";
import { handleError } from "@/lib/utils";

const TaskContainer = async ({
  type,
  isHost,
  projectId,
}: {
  type: "requirements" | "all_todo" | "in_progress" | "done" | "my_tasks";
  isHost: boolean;
  projectId: string;
}) => {
  if (type === "requirements" && isHost) {
    try {
      const requirements = await getProjectRequirements(projectId);
      return (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="bg-secondary/30 px-4 hover:bg-secondary">
              <h3 className="text-xl font-medium">All Requirements</h3>
            </AccordionTrigger>
            <AccordionContent className="px-2 py-4 rounded-md grid gap-4 auto-grid-small">
              <AddRequirement projectId={projectId} />
              {requirements.map((task: ITask) => (
                <TaskCard
                  key={task._id.toString()}
                  task={task}
                  projectId={projectId}
                  taskCardType="requirement"
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    } catch (error) {
      handleError(error);
    }
  } else if (type === "all_todo") {
    try {
      const todoCards = await getAllTodos(projectId);
      return (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="bg-secondary/30 px-4 hover:bg-secondary">
              <h3 className="text-xl font-medium">All TODO</h3>
            </AccordionTrigger>
            <AccordionContent className={` ${isHost? "flex flex-col gap-2 p-2 py-4" :"grid auto-grid-small gap-4 px-2 py-4"}`}>
              {todoCards && todoCards.length > 0 ? (
                todoCards.map((task: ITask) => (
                  <TaskCard
                    key={task._id.toString()}
                    task={task}
                    projectId={projectId}
                    taskCardType={isHost ? "todoHost" : "todoNoHost"}
                  />
                ))
              ) : (
                <p>No tasks to show</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    } catch (error) {
      handleError(error);
    }
  } else if (type === "in_progress" && isHost) {
    return (
      <div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="bg-secondary/30 px-4 hover:bg-secondary">
              <h3 className="text-xl font-medium">In progress</h3>
            </AccordionTrigger>
            <AccordionContent className="rounded-md">
              In progress
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  } else if (type === "done" && isHost) {
    return (
      <div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="bg-secondary/30 px-4 hover:bg-secondary">
              <h3 className="text-xl font-medium">Done</h3>
            </AccordionTrigger>
            <AccordionContent className="rounded-md">Done</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  } else if (type === "my_tasks" && !isHost) {
    return (
      <section>
        <h3 className="text-2xl font-bold">Your tasks</h3>
        <div className="grid auto-grid-small gap-4">
          No tasks to show
        </div>
      </section>
    );
  }
};

export default TaskContainer;
