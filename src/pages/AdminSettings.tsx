import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { OrgSettings } from "@/components/admin/OrgSettings";
import { supabase } from "@/lib/supabase";

const AdminSettings = () => {
  const session = useSession();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session?.user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (!session) {
      navigate("/");
    } else if (profile && profile.role !== "admin") {
      navigate("/dashboard");
    }
  }, [session, profile, navigate]);

  if (!session || (profile && profile.role !== "admin")) {
    return null;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Organization Settings</h1>
        <OrgSettings />
      </div>
    </div>
  );
};

export default AdminSettings;