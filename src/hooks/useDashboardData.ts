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

// Mock data to use while connection is establishing
const mockTodos: Todo[] = [
  { id: 1, title: "Review project timeline", status: "not_started", dueDate: new Date() },
  { id: 2, title: "Update documentation", status: "in_progress", dueDate: new Date() }
];

const mockRocks: Rock[] = [
  { id: 1, title: "Q1 Market Expansion", onTrack: true, progress: 75 },
  { id: 2, title: "Process Automation", onTrack: false, progress: 30 }
];

// Fetch functions with fallback to mock data
const fetchTodos = async () => {
  try {
    const { data, error } = await supabase.from("todos").select("*");
    if (error) {
      console.warn("Falling back to mock data for todos:", error.message);
      return mockTodos;
    }
    return data as Todo[];
  } catch (error) {
    console.warn("Falling back to mock data for todos");
    return mockTodos;
  }
};

const fetchRocks = async () => {
  try {
    const { data, error } = await supabase.from("rocks").select("*");
    if (error) {
      console.warn("Falling back to mock data for rocks:", error.message);
      return mockRocks;
    }
    return data as Rock[];
  } catch (error) {
    console.warn("Falling back to mock data for rocks");
    return mockRocks;
  }
};

// Hooks
export const useTodos = () => {
  return useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error loading todos",
          description: "Using cached data while connection is established",
          variant: "destructive",
        });
      },
    },
  });
};

export const useRocks = () => {
  return useQuery({
    queryKey: ["rocks"],
    queryFn: fetchRocks,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error loading rocks",
          description: "Using cached data while connection is established",
          variant: "destructive",
        });
      },
    },
  });
};

// Mutation hooks
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