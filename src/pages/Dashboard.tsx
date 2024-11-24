import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useUser } from "@supabase/auth-helpers-react";
import { TodoDashboard } from "@/components/individual/TodoDashboard";
import { RocksDashboard } from "@/components/individual/RocksDashboard";
import { ScorecardDashboard } from "@/components/individual/ScorecardDashboard";
import { IssuesDashboard } from "@/components/individual/IssuesDashboard";
import { UserManagement } from "@/components/UserManagement";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const Dashboard = () => {
  const session = useSession();
  const user = useUser();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!session) {
      navigate("/");
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">My Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <TodoDashboard />
          <RocksDashboard />
          <ScorecardDashboard />
          <IssuesDashboard />
          {profile?.role === "admin" && <UserManagement />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;