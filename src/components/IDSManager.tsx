import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MessageSquare, AlertTriangle, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface Issue {
  id: number;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  status: boolean;
  owner_id: string;
  meeting_id: number | null;
  due_date?: string;
  profiles: { username: string };
}

interface IDSManagerProps {
  meetingId?: number;
  onConvertToTodo?: (issueId: number, title: string) => void;
}

export const IDSManager = ({ meetingId, onConvertToTodo }: IDSManagerProps) => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [dueDate, setDueDate] = useState<Date>();
  const [assignedTo, setAssignedTo] = useState<string>("");

  // Fetch users for assignment
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

  // Fetch issues with owner information
  const { data: issues, isLoading } = useQuery({
    queryKey: ["issues", meetingId],
    queryFn: async () => {
      const query = supabase
        .from("issues")
        .select(`
          *,
          profiles!issues_owner_id_fkey (username)
        `)
        .order("priority", { ascending: false });

      if (meetingId) {
        query.eq("meeting_id", meetingId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Issue[];
    },
  });

  // Add new issue
  const addIssue = useMutation({
    mutationFn: async (newIssue: Omit<Issue, "id" | "profiles">) => {
      const { data, error } = await supabase
        .from("issues")
        .insert([newIssue])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate(undefined);
      setAssignedTo("");
      toast({
        title: "Success",
        description: "Issue added successfully",
      });
    },
  });

  // Update issue status
  const updateIssueStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: boolean }) => {
      const { error } = await supabase
        .from("issues")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues"] });
      toast({
        title: "Success",
        description: "Issue status updated",
      });
    },
  });

  const handleSubmit = () => {
    if (!title.trim()) return;

    addIssue.mutate({
      title,
      description,
      priority,
      owner_id: assignedTo || session?.user?.id || "",
      status: true,
      meeting_id: meetingId || null,
      due_date: dueDate?.toISOString(),
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">IDS Issues</CardTitle>
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Issue title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Select value={priority} onValueChange={(value: "high" | "medium" | "low") => setPriority(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
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
                  <Calendar className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : 'Pick a due date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button onClick={handleSubmit} className="w-full">Add Issue</Button>
          </div>

          <div className="space-y-4">
            {issues?.map((issue) => (
              <div
                key={issue.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{issue.title}</h3>
                    {issue.priority === "high" && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{issue.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    {issue.due_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(issue.due_date), 'MMM d, yyyy')}
                      </div>
                    )}
                    {issue.profiles?.username && (
                      <span>• Owner: {issue.profiles.username}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {onConvertToTodo && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onConvertToTodo(issue.id, issue.title)}
                    >
                      Convert to Todo
                    </Button>
                  )}
                  <Switch
                    checked={issue.status}
                    onCheckedChange={(checked) =>
                      updateIssueStatus.mutate({ id: issue.id, status: checked })
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};