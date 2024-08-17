import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

const TaskCard = () => {
  return (
    <Card className="min-h-20 hover:bg-primary/10 transition-all">
      <CardHeader>
        <p>Hello wssup</p>
      </CardHeader>
      <CardFooter>people</CardFooter>
    </Card>
  );
};

export default TaskCard;
