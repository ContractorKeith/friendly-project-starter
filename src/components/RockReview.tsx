import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Diamond, Calendar as CalendarIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

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
          profiles (username)
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

  const handleAddRock = () => {
    if (!title.trim()) return;
    
    addRock.mutate({
      title,
      owner_id: assignedTo || session?.user?.id || "",
      due_date: dueDate?.toISOString(),
      meeting_id: meetingId,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Rock Review (5 min)</CardTitle>
        <Diamond className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Add new rock..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
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
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : 'Pick a due date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button onClick={handleAddRock} className="w-full">Add Rock</Button>
          </div>

          <div className="space-y-4">
            {rocks?.map((rock) => (
              <div key={rock.id} className="space-y-2 border-b pb-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{rock.title}</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {rock.due_date && (
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {format(new Date(rock.due_date), 'MMM d, yyyy')}
                      </div>
                    )}
                    {rock.profiles?.username && (
                      <span>• Owner: {rock.profiles.username}</span>
                    )}
                  </div>
                </div>
                <Progress value={rock.progress || 0} className="h-2" />
                <span className="text-sm text-muted-foreground">{rock.progress || 0}% Complete</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};