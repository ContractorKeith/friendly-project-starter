import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Users } from "lucide-react";

export const UserManagement = () => {
  const session = useSession();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [role, setRole] = useState<"admin" | "team_member">("team_member");

  const handleInviteUser = async () => {
    try {
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
        data: {
          username,
          role,
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User invited successfully",
      });

      setEmail("");
      setUsername("");
      setRole("team_member");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">User Management</CardTitle>
        <Users className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Select value={role} onValueChange={(value: "admin" | "team_member") => setRole(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="team_member">Team Member</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleInviteUser} className="w-full">
            Invite User
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};