import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";

export interface Todo {
  id: number;
  title: string;
  status: "not_started" | "in_progress" | "complete";
  due_date: string | null;
  assigned_to: string | null;
  meeting_id: number | null;
  user_id: string | null;
}

export interface Rock {
  id: number;
  title: string;
  on_track: boolean;
  progress: number;
  owner_id: string;
  due_date: string | null;
  meeting_id: number | null;
  user_id: string | null;
}

export const useTodos = () => {
  const session = useSession();
  return useQuery({
    queryKey: ["todos", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .eq("user_id", session?.user?.id);
      if (error) throw error;
      return data as Todo[];
    },
    enabled: !!session?.user?.id,
  });
};

export const useRocks = () => {
  const session = useSession();
  return useQuery({
    queryKey: ["rocks", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rocks")
        .select("*")
        .eq("user_id", session?.user?.id);
      if (error) throw error;
      return data as Rock[];
    },
    enabled: !!session?.user?.id,
  });
};

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
    mutationFn: async (rock: { 
      title: string;
      owner_id: string;
      due_date?: Date;
      meeting_id?: number | null;
      progress?: number;
      on_track?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("rocks")
        .insert([{
          title: rock.title,
          owner_id: rock.owner_id,
          due_date: rock.due_date?.toISOString(),
          meeting_id: rock.meeting_id,
          progress: rock.progress || 0,
          on_track: rock.on_track || true,
          user_id: session?.user?.id
        }])
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

export const useUpdateRock = () => {
  const queryClient = useQueryClient();
  const session = useSession();
  
  return useMutation({
    mutationFn: async (rock: { id: number } & Partial<{
      title: string;
      on_track: boolean;
      progress: number;
      due_date: Date;
    }>) => {
      const updateData: any = { ...rock };
      if (rock.due_date) {
        updateData.due_date = rock.due_date.toISOString();
      }
      
      const { error } = await supabase
        .from("rocks")
        .update(updateData)
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