import { Link } from "react-router-dom";
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
import { Users, Settings, Archive, Timer, LayoutDashboard } from "lucide-react";

export function MainNav() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            console.log("Profile not found, creating new profile for user:", user.id);
            // Profile not found, create a new one
            const { data: newProfile, error: createError } = await supabase
              .from("profiles")
              .insert([{
                id: user.id,
                username: user.email?.split('@')[0] || 'user',
                role: 'team_member',
                email: user.email
              }])
              .select()
              .single();
              
            if (createError) {
              console.error("Error creating profile:", createError);
              throw createError;
            }
            console.log("New profile created:", newProfile);
            return newProfile;
          }
          console.error("Error fetching profile:", error);
          throw error;
        }
        console.log("Existing profile found:", data);
        return data;
      } catch (error) {
        console.error("Error handling profile:", error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1, // Only retry once since we handle profile creation
  });

  const isAdmin = profile?.role === "admin";
  console.log("Profile data:", profile);
  console.log("Is admin?", isAdmin);

  if (isLoading) {
    return null; // Or a loading spinner
  }

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