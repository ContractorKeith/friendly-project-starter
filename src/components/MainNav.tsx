import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { 
  Button,
  buttonVariants
} from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { Users, Settings, Archive, Timer, LayoutDashboard } from "lucide-react";

export function MainNav() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      console.log("Profile data:", data); // Debug log
      return data;
    },
    retry: 1,
  });

  console.log("Current profile role:", profile?.role); // Debug log

  const isAdmin = profile?.role === "admin";

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
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
      </div>
    </div>
  );
}