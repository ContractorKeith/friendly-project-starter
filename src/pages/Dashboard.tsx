import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { TodoDashboard } from "@/components/individual/TodoDashboard";
import { RocksDashboard } from "@/components/individual/RocksDashboard";
import { ScorecardDashboard } from "@/components/individual/ScorecardDashboard";
import { IssuesDashboard } from "@/components/individual/IssuesDashboard";

const Dashboard = () => {
  const session = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate("/login");
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;