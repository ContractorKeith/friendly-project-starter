import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Target } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface CompanyKPIsProps {
  meetingId?: number;
}

export const CompanyKPIs = ({ meetingId }: CompanyKPIsProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newKpiName, setNewKpiName] = useState("");
  const [newKpiValue, setNewKpiValue] = useState("");
  const [newKpiTarget, setNewKpiTarget] = useState("");

  const { data: kpis, isLoading } = useQuery({
    queryKey: ["company-kpis", meetingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_kpis")
        .select("*")
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const addKpi = useMutation({
    mutationFn: async (kpi: { name: string; value: string; target: string; meeting_id?: number }) => {
      const { data, error } = await supabase
        .from("company_kpis")
        .insert([kpi])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-kpis"] });
      setNewKpiName("");
      setNewKpiValue("");
      setNewKpiTarget("");
      toast({
        title: "Success",
        description: "KPI added successfully",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKpiName || !newKpiValue || !newKpiTarget) return;
    
    addKpi.mutate({
      name: newKpiName,
      value: newKpiValue,
      target: newKpiTarget,
      meeting_id: meetingId,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Company KPIs</CardTitle>
        <Target className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-4">
          <div className="grid grid-cols-3 gap-2">
            <Input
              placeholder="KPI Name"
              value={newKpiName}
              onChange={(e) => setNewKpiName(e.target.value)}
            />
            <Input
              placeholder="Current Value"
              value={newKpiValue}
              onChange={(e) => setNewKpiValue(e.target.value)}
            />
            <Input
              placeholder="Target"
              value={newKpiTarget}
              onChange={(e) => setNewKpiTarget(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">Add KPI</Button>
        </form>
        
        <div className="space-y-4">
          {kpis?.map((kpi) => (
            <div key={kpi.id} className="flex justify-between items-center">
              <span className="font-medium">{kpi.name}</span>
              <div className="space-x-4">
                <span className="text-sm">Current: {kpi.value}</span>
                <span className="text-sm text-muted-foreground">Target: {kpi.target}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};