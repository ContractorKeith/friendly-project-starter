import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Settings } from "lucide-react";

export const OrgSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [companyName, setCompanyName] = useState("");
  const [meetingDefaults, setMeetingDefaults] = useState("");

  const { data: settings } = useQuery({
    queryKey: ["org-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("org_settings")
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: { setting_key: string; setting_value: any }) => {
      const { error } = await supabase
        .from("org_settings")
        .upsert({
          setting_key: newSettings.setting_key,
          setting_value: newSettings.setting_value,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-settings"] });
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    },
  });

  const handleUpdateSettings = () => {
    updateSettingsMutation.mutate({
      setting_key: "company_settings",
      setting_value: {
        company_name: companyName,
        meeting_defaults: meetingDefaults,
      },
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Organization Settings</CardTitle>
        <Settings className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name</label>
            <Input
              placeholder="Enter company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Meeting Defaults</label>
            <Input
              placeholder="Default meeting duration (minutes)"
              value={meetingDefaults}
              onChange={(e) => setMeetingDefaults(e.target.value)}
            />
          </div>
          <Button onClick={handleUpdateSettings} className="w-full">
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};