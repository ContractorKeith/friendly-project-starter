import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Diamond } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { RockForm } from "./rocks/RockForm";
import { RockList } from "./rocks/RockList";

interface RockReviewProps {
  meetingId?: number;
}

export const RockReview = ({ meetingId }: RockReviewProps) => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
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

  const { data: rocks, isLoading } = useQuery({
    queryKey: ["rocks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rocks")
        .select(`
          *,
          owner:owner_id (
            username
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const addRock = useMutation({
    mutationFn: async (rock: { title: string; owner_id: string; due_date?: string; meeting_id?: number }) => {
      const { data, error } = await supabase
        .from("rocks")
        .insert([{
          ...rock,
          progress: 0,
          on_track: true,
          user_id: session?.user?.id,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rocks"] });
      setTitle("");
      setDueDate(undefined);
      setAssignedTo("");
      toast({
        title: "Success",
        description: "Rock added successfully",
      });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Rock Review (5 min)</CardTitle>
        <Diamond className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <RockForm
            users={users}
            onSubmit={(data) => addRock.mutate({ ...data, meeting_id: meetingId })}
            title={title}
            setTitle={setTitle}
            assignedTo={assignedTo}
            setAssignedTo={setAssignedTo}
            dueDate={dueDate}
            setDueDate={setDueDate}
          />
          <RockList rocks={rocks} />
        </div>
      </CardContent>
    </Card>
  );
};