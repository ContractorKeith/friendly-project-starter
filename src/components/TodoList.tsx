import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckSquare, Calendar } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

interface TodoListProps {
  onConvertToIssue?: (todoId: number, title: string) => void;
}

export const TodoList = ({ onConvertToIssue }: TodoListProps) => {
  const session = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: todos, isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("todos")
        .select(`
          *,
          profiles (username)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
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

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">ToDos (5 min)</CardTitle>
        <CheckSquare className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
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
                        <Calendar className="h-3 w-3" />
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
      </CardContent>
    </Card>
  );
};