import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function MainNav() {
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
            <NavigationMenuItem>
              <Link to="/admin">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Admin
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}