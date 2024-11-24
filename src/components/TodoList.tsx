import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CheckSquare, Calendar as CalendarIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { useState } from "react";

interface TodoListProps {
  onConvertToIssue?: (todoId: number, title: string) => void;
  meetingId?: number;
}

export const TodoList = ({ onConvertToIssue, meetingId }: TodoListProps) => {
  const session = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [assignedTo, setAssignedTo] = useState<string>("");

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("active", true);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: todos, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("todos")
        .select(`
          *,
          profiles!todos_assigned_to_fkey (username)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const addTodo = useMutation({
    mutationFn: async (todo: { title: string; assigned_to?: string; due_date?: string; meeting_id?: number }) => {
      const { data, error } = await supabase
        .from("todos")
        .insert([{
          ...todo,
          status: "not_started",
          user_id: session?.user?.id,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setNewTodoTitle("");
      setDueDate(undefined);
      setAssignedTo("");
      toast({
        title: "Success",
        description: "Todo added successfully",
      });
    },
  });

  const updateTodo = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const { error } = await supabase
        .from("todos")
        .update({ status })
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast({
        title: "Success",
        description: "Todo updated successfully",
      });
    },
  });

  const handleAddTodo = () => {
    if (!newTodoTitle.trim()) return;
    
    addTodo.mutate({
      title: newTodoTitle,
      assigned_to: assignedTo,
      due_date: dueDate?.toISOString(),
      meeting_id: meetingId,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">ToDos (5 min)</CardTitle>
        <CheckSquare className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Add new todo..."
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
            />
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger>
                <SelectValue placeholder="Assign to..." />
              </SelectTrigger>
              <SelectContent>
                {users?.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : 'Pick a due date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button onClick={handleAddTodo} className="w-full">Add Todo</Button>
          </div>

          <div className="space-y-4">
            {todos?.map((todo) => (
              <div key={todo.id} className="flex items-center justify-between space-x-2 border-b pb-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.status === "complete"}
                    onCheckedChange={(checked) =>
                      updateTodo.mutate({
                        id: todo.id,
                        status: checked ? "complete" : "not_started",
                      })
                    }
                  />
                  <div className="flex flex-col">
                    <label htmlFor={`todo-${todo.id}`} className="font-medium">
                      {todo.title}
                    </label>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {todo.due_date && (
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          {format(new Date(todo.due_date), 'MMM d, yyyy')}
                        </div>
                      )}
                      {todo.profiles?.username && (
                        <span>• Assigned to: {todo.profiles.username}</span>
                      )}
                    </div>
                  </div>
                </div>
                {onConvertToIssue && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onConvertToIssue(todo.id, todo.title)}
                  >
                    Convert to Issue
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};