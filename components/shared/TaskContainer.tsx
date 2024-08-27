import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import AddRequirement from "@/components/shared/AddRequirement";
import TaskCard from "./TaskCard";
import {
  getAllDeploymentTasks,
  getAllDesigningTasks,
  getAllDevelopmentTasks,
  getAllDoneTasks,
  getAllTestingTasks,
  getProjectRequirements,
  getUserJoinedTasks,
} from "@/lib/actions/project.actions";
import { ITask } from "@/lib/database/models/project.model";
import { handleError } from "@/lib/utils";

const TaskContainer = async ({
  type,
  isHost,
  projectId,
}: {
  type:
    | "requirements"
    | "designing"
    | "development"
    | "testing"
    | "deployment"
    | "done"
    | "your_tasks";
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
              <h3 className="text-xl font-medium">
                <span>0</span>
                &nbsp; All Requirements
              </h3>
            </AccordionTrigger>
            <AccordionContent className="p-3 border-x grid gap-3 auto-grid-small">
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
  } else if (type === "designing") {
    try {
      const designingCards = await getAllDesigningTasks(projectId);
      return (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="bg-secondary/30 px-4 hover:bg-secondary md:border-r">
              <h3 className="text-xl font-medium">
                <span>1</span>
                &nbsp; Designing
              </h3>
            </AccordionTrigger>
            <AccordionContent className="p-3 border-x grid gap-3 auto-grid-small">
              {designingCards && designingCards.length > 0 ? (
                designingCards.map((task: ITask) => (
                  <TaskCard
                    key={task._id.toString()}
                    task={task}
                    projectId={projectId}
                    taskCardType={
                      isHost ? "desighning_host" : "desighning_nohost"
                    }
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
  } else if (type === "development") {
    try {
      const developmentCards = await getAllDevelopmentTasks(projectId);
      return (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="bg-secondary/30 px-4 hover:bg-secondary md:border-l">
              <h3 className="text-xl font-medium">
                <span>2</span>
                &nbsp; Development
              </h3>
            </AccordionTrigger>
            <AccordionContent className="p-3 border-x grid gap-3 auto-grid-small">
              {developmentCards && developmentCards.length > 0 ? (
                developmentCards.map((task: ITask) => (
                  <TaskCard
                    key={task._id.toString()}
                    task={task}
                    projectId={projectId}
                    taskCardType={
                      isHost ? "development_host" : "development_nohost"
                    }
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
  } else if (type === "testing") {
    try {
      const testingCards = await getAllTestingTasks(projectId);
      return (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="bg-secondary/30 px-4 hover:bg-secondary md:border-r">
              <h3 className="text-xl font-medium">
                <span>3</span>
                &nbsp; Testing
              </h3>
            </AccordionTrigger>
            <AccordionContent className="p-3 border-x grid gap-3 auto-grid-small">
              {testingCards && testingCards.length > 0 ? (
                testingCards.map((task: ITask) => (
                  <TaskCard
                    key={task._id.toString()}
                    task={task}
                    projectId={projectId}
                    taskCardType={isHost ? "testing_host" : "testing_nohost"}
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
  } else if (type === "deployment") {
    try {
      const deploymentCards = await getAllDeploymentTasks(projectId);
      return (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="bg-secondary/30 px-4 hover:bg-secondary md:border-l">
              <h3 className="text-xl font-medium">
                <span>4</span>
                &nbsp; Deployment
              </h3>
            </AccordionTrigger>
            <AccordionContent className="p-3 border-x grid gap-3 auto-grid-small">
              {deploymentCards && deploymentCards.length > 0 ? (
                deploymentCards.map((task: ITask) => (
                  <TaskCard
                    key={task._id.toString()}
                    task={task}
                    projectId={projectId}
                    taskCardType={
                      isHost ? "deployment_host" : "deployment_nohost"
                    }
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
  } else if (type === "done") {
    try {
      const doneCards = await getAllDoneTasks(projectId);
      return (
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="bg-secondary/30 px-4 hover:bg-secondary">
              <h3 className="text-xl font-medium">
                <span>5</span>
                &nbsp; Done
              </h3>
            </AccordionTrigger>
            <AccordionContent className="p-3 border-x grid gap-3 auto-grid-small">
              {doneCards && doneCards.length > 0 ? (
                doneCards.map((task: ITask) => (
                  <TaskCard
                    key={task._id.toString()}
                    task={task}
                    projectId={projectId}
                    taskCardType={isHost ? "done_host" : "done_nohost"}
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
  } else if (type === "your_tasks") {
    try {
      const yourTasks = await getUserJoinedTasks(projectId);
      return (
        <div className="p-3 border-x grid gap-3 auto-grid-small">
          {yourTasks && yourTasks.length > 0 ? (
            yourTasks.map((task: ITask) => (
              <TaskCard
                key={task._id.toString()}
                task={task}
                projectId={projectId}
                taskCardType="your_tasks"
              />
            ))
          ) : (
            <p>No tasks to show</p>
          )}
        </div>
      );
    } catch (error) {
      handleError(error);
    }
  }
};

export default TaskContainer;
