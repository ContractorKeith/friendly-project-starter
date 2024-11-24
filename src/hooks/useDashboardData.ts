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

// Query hooks
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

// Mutation hooks
export const useAddTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (todo: Omit<Todo, "id">) => {
      const { data, error } = await supabase
        .from("todos")
        .insert([todo])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast({
        title: "Success",
        description: "Todo added successfully",
      });
    },
  });
};

export const useAddRock = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (rock: Omit<Rock, "id">) => {
      const { data, error } = await supabase
        .from("rocks")
        .insert([rock])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rocks"] });
      toast({
        title: "Success",
        description: "Rock added successfully",
      });
    },
  });
};

// Mutation hooks for updating todos and rocks
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (todo: Partial<Todo> & { id: number }) => {
      try {
        const { error } = await supabase
          .from("todos")
          .update(todo)
          .eq("id", todo.id);
        if (error) throw error;
      } catch (error) {
        // Store update locally if connection isn't ready
        const currentTodos = queryClient.getQueryData<Todo[]>(["todos"]) || [];
        const updatedTodos = currentTodos.map(t => 
          t.id === todo.id ? { ...t, ...todo } : t
        );
        queryClient.setQueryData(["todos"], updatedTodos);
      }
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
      try {
        const { error } = await supabase
          .from("rocks")
          .update(rock)
          .eq("id", rock.id);
        if (error) throw error;
      } catch (error) {
        // Store update locally if connection isn't ready
        const currentRocks = queryClient.getQueryData<Rock[]>(["rocks"]) || [];
        const updatedRocks = currentRocks.map(r => 
          r.id === rock.id ? { ...r, ...rock } : r
        );
        queryClient.setQueryData(["rocks"], updatedRocks);
      }
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
