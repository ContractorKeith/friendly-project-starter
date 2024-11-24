import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar as CalendarIcon, CheckSquare } from "lucide-react";
import { useTodos, useUpdateTodo } from "@/hooks/useDashboardData";

export const TodoDashboard = () => {
  const { data: todos, isLoading } = useTodos();
  const updateTodo = useUpdateTodo();
  const [date, setDate] = useState<Date>();

  const handleStatusChange = (todoId: number, status: "not_started" | "in_progress" | "complete") => {
    updateTodo.mutate({ id: todoId, status });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">My ToDos</CardTitle>
        <CheckSquare className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {todos?.map((todo) => (
            <div key={todo.id} className="flex flex-col space-y-2 border-b pb-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{todo.title}</span>
                <Select 
                  defaultValue={todo.status}
                  onValueChange={(value: "not_started" | "in_progress" | "complete") => 
                    handleStatusChange(todo.id, value)
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[140px] pl-3 text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {todo.dueDate ? format(new Date(todo.dueDate), "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};