import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";

// Types
export interface Todo {
  id: number;
  title: string;
  status: "not_started" | "in_progress" | "complete";
  dueDate: Date;
  assigned_to: string | null;
  meeting_id: number | null;
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
const fetchTodos = async (userId: string | undefined) => {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("assigned_to", userId);
  if (error) throw error;
  return data as Todo[];
};

const fetchRocks = async (userId: string | undefined) => {
  const { data, error } = await supabase
    .from("rocks")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  return data as Rock[];
};

// Query hooks
export const useTodos = () => {
  const session = useSession();
  return useQuery({
    queryKey: ["todos", session?.user?.id],
    queryFn: () => fetchTodos(session?.user?.id),
    enabled: !!session?.user?.id,
  });
};

export const useRocks = () => {
  const session = useSession();
  return useQuery({
    queryKey: ["rocks", session?.user?.id],
    queryFn: () => fetchRocks(session?.user?.id),
    enabled: !!session?.user?.id,
  });
};

// Mutation hooks
export const useAddTodo = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  
  return useMutation({
    mutationFn: async (todo: Omit<Todo, "id">) => {
      const { data, error } = await supabase
        .from("todos")
        .insert([{ ...todo, user_id: session?.user?.id }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", session?.user?.id] });
      toast({
        title: "Success",
        description: "Todo added successfully",
      });
    },
  });
};

export const useAddRock = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  
  return useMutation({
    mutationFn: async (rock: Omit<Rock, "id">) => {
      const { data, error } = await supabase
        .from("rocks")
        .insert([{ ...rock, user_id: session?.user?.id }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rocks", session?.user?.id] });
      toast({
        title: "Success",
        description: "Rock added successfully",
      });
    },
  });
};

// Update mutations
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  
  return useMutation({
    mutationFn: async (todo: Partial<Todo> & { id: number }) => {
      const { error } = await supabase
        .from("todos")
        .update(todo)
        .eq("id", todo.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", session?.user?.id] });
      toast({
        title: "Success",
        description: "Todo updated successfully",
      });
    },
  });
};

export const useUpdateRock = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  
  return useMutation({
    mutationFn: async (rock: Partial<Rock> & { id: number }) => {
      const { error } = await supabase
        .from("rocks")
        .update(rock)
        .eq("id", rock.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rocks", session?.user?.id] });
      toast({
        title: "Success",
        description: "Rock updated successfully",
      });
    },
  });
};