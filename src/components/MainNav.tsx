import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { supabase } from "@/lib/supabase";

export function MainNav() {
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const isAdmin = profile?.role === "admin";

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Meeting Timer
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/dashboard">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Dashboard
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            {isAdmin && (
              <>
                <NavigationMenuItem>
                  <Link to="/admin">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Admin
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/admin/settings">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Org Settings
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </>
            )}
            <NavigationMenuItem>
              <Link to="/profile">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Profile
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}