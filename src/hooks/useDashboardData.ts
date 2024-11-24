import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

// Types
export interface Todo {
  id: number;
  title: string;
  status: "not_started" | "in_progress" | "complete";
  dueDate: Date;
}

export interface Rock {
  id: number;
  title: string;
  onTrack: boolean;
  progress: number;
}

export interface Issue {
  id: number;
  title: string;
  priority: "low" | "medium" | "high";
}

export interface Metric {
  id: number;
  name: string;
  value: string;
  target: string;
}

// Fetch functions
const fetchTodos = async () => {
  const { data, error } = await supabase.from("todos").select("*");
  if (error) throw error;
  return data as Todo[];
};

const fetchRocks = async () => {
  const { data, error } = await supabase.from("rocks").select("*");
  if (error) throw error;
  return data as Rock[];
};

const fetchIssues = async () => {
  const { data, error } = await supabase.from("issues").select("*");
  if (error) throw error;
  return data as Issue[];
};

const fetchMetrics = async () => {
  const { data, error } = await supabase.from("metrics").select("*");
  if (error) throw error;
  return data as Metric[];
};

// Hooks
export const useTodos = () => {
  return useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });
};

export const useRocks = () => {
  return useQuery({
    queryKey: ["rocks"],
    queryFn: fetchRocks,
  });
};

export const useIssues = () => {
  return useQuery({
    queryKey: ["issues"],
    queryFn: fetchIssues,
  });
};

export const useMetrics = () => {
  return useQuery({
    queryKey: ["metrics"],
    queryFn: fetchMetrics,
  });
};

// Mutation hooks
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (todo: Partial<Todo> & { id: number }) => {
      const { error } = await supabase
        .from("todos")
        .update(todo)
        .eq("id", todo.id);
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
};

export const useUpdateRock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (rock: Partial<Rock> & { id: number }) => {
      const { error } = await supabase
        .from("rocks")
        .update(rock)
        .eq("id", rock.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rocks"] });
      toast({
        title: "Success",
        description: "Rock updated successfully",
      });
    },
  });
};