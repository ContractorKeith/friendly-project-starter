import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Timer } from "@/components/Timer";
import { SegueInput } from "@/components/SegueInput";
import { ScorecardReview } from "@/components/ScorecardReview";
import { RockReview } from "@/components/RockReview";
import { Headlines } from "@/components/Headlines";
import { TodoList } from "@/components/TodoList";
import { IDSManager } from "@/components/IDSManager";
import { MeetingConclusion } from "@/components/MeetingConclusion";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const MEETING_SEGMENTS = [
  { name: "Segue", duration: 5 },
  { name: "Scorecard Review", duration: 5 },
  { name: "Rock Review", duration: 5 },
  { name: "Headlines", duration: 5 },
  { name: "ToDos", duration: 5 },
  { name: "IDS", duration: 60 },
  { name: "Conclude", duration: 5 }
];

const Index = () => {
  const [meetingProgress, setMeetingProgress] = useState(0);
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  useRealtimeSync();

  // Convert Issue to Todo
  const convertIssueToTodo = useMutation({
    mutationFn: async ({ issueId, title }: { issueId: number; title: string }) => {
      // Create new todo
      const { data: todo, error: todoError } = await supabase
        .from("todos")
        .insert([{
          title,
          status: "not_started",
          user_id: session?.user?.id,
        }])
        .select()
        .single();

      if (todoError) throw todoError;

      // Delete the original issue
      const { error: deleteError } = await supabase
        .from("issues")
        .delete()
        .eq("id", issueId);

      if (deleteError) throw deleteError;

      return todo;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      toast({
        title: "Success",
        description: "Issue converted to Todo successfully",
      });
    },
  });

  // Convert Todo to Issue
  const convertTodoToIssue = useMutation({
    mutationFn: async ({ todoId, title }: { todoId: number; title: string }) => {
      // Create new issue
      const { data: issue, error: issueError } = await supabase
        .from("issues")
        .insert([{
          title,
          priority: "medium",
          user_id: session?.user?.id,
          owner_id: session?.user?.id,
        }])
        .select()
        .single();

      if (issueError) throw issueError;

      // Delete the original todo
      const { error: deleteError } = await supabase
        .from("todos")
        .delete()
        .eq("id", todoId);

      if (deleteError) throw deleteError;

      return issue;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      toast({
        title: "Success",
        description: "Todo converted to Issue successfully",
      });
    },
  });

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-[75%] mx-auto space-y-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Level 10 Meeting</h1>
          <Timer 
            initialMinutes={90} 
            onProgressChange={setMeetingProgress} 
            segments={MEETING_SEGMENTS}
          />
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Meeting Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={meetingProgress} className="w-full" />
          </CardContent>
        </Card>

        <div className="space-y-8">
          <SegueInput />
          <ScorecardReview />
          <RockReview />
          <Headlines />
          <TodoList 
            onConvertToIssue={(todoId, title) => 
              convertTodoToIssue.mutate({ todoId, title })
            }
          />
          <IDSManager 
            onConvertToTodo={(issueId, title) => 
              convertIssueToTodo.mutate({ issueId, title })
            }
          />
          <MeetingConclusion />
        </div>
      </div>
    </div>
  );
};

export default Index;