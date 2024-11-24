import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Flag, AlertTriangle } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";

interface Issue {
  id: number;
  title: string;
  priority: "low" | "medium" | "high";
  description?: string;
  owner_id: string;
  meeting_id?: number;
}

export const IssuesDashboard = ({ meetingId }: { meetingId?: number }) => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newTitle, setNewTitle] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  useRealtimeSync();

  const { data: issues, isLoading } = useQuery({
    queryKey: ["issues", session?.user?.id],
    queryFn: async () => {
      const query = supabase
        .from("issues")
        .select("*")
        .eq("user_id", session?.user?.id);
      
      if (meetingId) {
        query.eq("meeting_id", meetingId);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Issue[];
    },
    enabled: !!session?.user?.id,
  });

  const addIssue = useMutation({
    mutationFn: async (newIssue: Omit<Issue, "id">) => {
      const { data, error } = await supabase
        .from("issues")
        .insert([{ ...newIssue, user_id: session?.user?.id }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      toast({
        title: "Success",
        description: "Issue added successfully",
      });
      setNewTitle("");
      setPriority("medium");
    },
  });

  const handleAddIssue = () => {
    if (!newTitle.trim()) return;
    
    addIssue.mutate({
      title: newTitle,
      priority,
      owner_id: session?.user?.id || "",
      meeting_id: meetingId,
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">My Issues</CardTitle>
        <Flag className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Add new issue..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1"
            />
            <Select
              value={priority}
              onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAddIssue}>Add</Button>
          </div>
          <div className="space-y-2">
            {issues?.map((issue) => (
              <div key={issue.id} className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <span>{issue.title}</span>
                  {issue.priority === "high" && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <span className={`text-sm ${
                  issue.priority === "high" 
                    ? "text-red-500" 
                    : issue.priority === "medium" 
                    ? "text-yellow-500" 
                    : "text-green-500"
                }`}>
                  {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};