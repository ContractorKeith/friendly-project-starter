import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Flag } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";

interface MeetingConclusionProps {
  meetingId?: number;
  onArchiveSuccess?: () => void;
}

export const MeetingConclusion = ({ meetingId, onArchiveSuccess }: MeetingConclusionProps) => {
  const [rating, setRating] = useState("");
  const [messages, setMessages] = useState("");
  const { toast } = useToast();

  const archiveMeeting = useMutation({
    mutationFn: async (data: { rating: number; messages: string }) => {
      // First, fetch all the current meeting data
      const [
        { data: rocks },
        { data: todos },
        { data: issues },
        { data: kpis }
      ] = await Promise.all([
        supabase.from("rocks").select("*").eq("meeting_id", meetingId),
        supabase.from("todos").select("*").eq("meeting_id", meetingId),
        supabase.from("issues").select("*").eq("meeting_id", meetingId),
        supabase.from("company_kpis").select("*").eq("meeting_id", meetingId),
      ]);

      // Archive the meeting
      const { data: archived, error } = await supabase
        .from("archived_meetings")
        .insert([{
          meeting_date: new Date().toISOString(),
          meeting_rating: data.rating,
          cascading_messages: data.messages,
          rocks_data: rocks,
          todos_data: todos,
          issues_data: issues,
          scorecard_data: kpis,
        }])
        .select()
        .single();

      if (error) throw error;
      return archived;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Meeting archived successfully",
      });
      setRating("");
      setMessages("");
      onArchiveSuccess?.();
    },
  });

  const handleArchive = () => {
    if (!rating) return;
    
    archiveMeeting.mutate({
      rating: parseInt(rating),
      messages,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Conclusion (5 min)</CardTitle>
        <Flag className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Meeting Rating (1-10)</label>
          <Input
            type="number"
            min="1"
            max="10"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="Rate the meeting..."
          />
        </div>
        <div>
          <label className="text-sm font-medium">Cascading Messages</label>
          <Textarea
            value={messages}
            onChange={(e) => setMessages(e.target.value)}
            placeholder="Add messages for other teams..."
          />
        </div>
        <Button
          onClick={handleArchive}
          className="w-full"
          disabled={!rating}
        >
          Archive Meeting
        </Button>
      </CardContent>
    </Card>
  );
};