import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Users, Settings, Archive, Timer, LayoutDashboard, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "@supabase/auth-helpers-react";

export function MainNav() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const session = useSession();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
        toast({
          title: "Error",
          description: "Failed to log out. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log("Logged out successfully");
        navigate("/login");
      }
    } catch (error) {
      console.error("Unexpected error during logout:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user) {
        return null;
      }

      try {
        const { data: existingProfile, error: fetchError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .maybeSingle();

        if (fetchError) throw fetchError;
        return existingProfile;
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!session?.user?.id,
    retry: false,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const isAdmin = profile?.role === "admin";

  if (isLoading || !session) {
    return null;
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto justify-between">
        <NavigationMenu>
          <NavigationMenuList className="gap-2">
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <Timer className="w-4 h-4 mr-2" />
                  Meeting Timer
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/dashboard">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {isAdmin && (
              <>
                <NavigationMenuItem>
                  <Link to="/admin">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <Users className="w-4 h-4 mr-2" />
                      User Management
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/admin/settings">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <Settings className="w-4 h-4 mr-2" />
                      Org Settings
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/admin/archived">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      <Archive className="w-4 h-4 mr-2" />
                      Archived Meetings
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </>
            )}
            <NavigationMenuItem>
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  Profile Settings
                </Button>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}