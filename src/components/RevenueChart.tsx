import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueChartProps {
  meetingId?: number;
}

export const RevenueChart = ({ meetingId }: RevenueChartProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [revenue, setRevenue] = useState("");

  const { data: meetings } = useQuery({
    queryKey: ["archived-meetings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("archived_meetings")
        .select("meeting_date, revenue")
        .order("meeting_date", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const addRevenue = useMutation({
    mutationFn: async ({ revenue, meetingId }: { revenue: string; meetingId?: number }) => {
      const { data, error } = await supabase
        .from("archived_meetings")
        .insert([{
          meeting_date: new Date().toISOString(),
          revenue: parseFloat(revenue),
          meeting_id: meetingId,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archived-meetings"] });
      setRevenue("");
      toast({
        title: "Success",
        description: "Revenue recorded successfully",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revenue) return;
    
    addRevenue.mutate({ revenue, meetingId });
  };

  const chartData = meetings?.map(meeting => ({
    date: new Date(meeting.meeting_date).toLocaleDateString(),
    revenue: meeting.revenue || 0,
  })) || [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Revenue Tracking</CardTitle>
        <DollarSign className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Enter revenue"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
            />
            <Button type="submit">Record</Button>
          </div>
        </form>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};