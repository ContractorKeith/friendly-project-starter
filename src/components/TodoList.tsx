import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare } from "lucide-react";

export const TodoList = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">ToDos (5 min)</CardTitle>
        <CheckSquare className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="todo1" />
            <label htmlFor="todo1">Update project timeline</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="todo2" />
            <label htmlFor="todo2">Schedule client meeting</label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="todo3" />
            <label htmlFor="todo3">Review quarterly goals</label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};