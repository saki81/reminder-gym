import { NavLink,Link } from "react-router-dom";
import {
  LayoutDashboard,
  Dumbbell,
  Wrench,
  Tag,
  Settings,
  Building2,
  LogOut,
  ArrowDownRight,
  ArrowBigRight,
  ArrowRightIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useAuth }   from "@/hooks/shared/useAuth";
import { useLogout } from "@/hooks/auth/useLogout";



type NavItem = {
  to:     string;
  label:  string;
  icon:   React.ElementType;
  roles?: string[];
};

const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard",   label: "Dashboard",    icon: LayoutDashboard },
  { to: "/equipment",   label: "Equipment",    icon: Dumbbell },
  { to: "/maintenance", label: "Maintenance",  icon: Wrench },
  { to: "/categories",  label: "Categories",   icon: Tag },
  { to: "/gym",         label: "My Gyms",      icon: Building2 },
  {
    to:    "/gym/settings",
    label: "Gym Settings",
    icon:  Settings,
    roles: ["OWNER", "ADMIN"],
  },
];

//  AppSidebar

export function AppSidebar() {
  const { user, hasRole } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.roles || hasRole(item.roles)
  );

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "?";

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center
                          rounded-lg bg-primary shrink-0">
            <Dumbbell size={16} color="white" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">Reminder Gym</p>
            <p className="text-[11px] text-muted-foreground truncate">
              Management
            </p>
          </div>
        </div>
      </SidebarHeader>

     
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton >
                    <NavLink
                      to={item.to}
                      end={item.to === "/gym"}
                      className={({ isActive }) =>
                        [
                          "flex items-center gap-3 rounded-lg px-3 py-2",
                          "text-sm transition-colors duration-150",
                          isActive
                            ? "bg-primary w-full text-primary-foreground font-medium"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        ].join(" ")
                      }
                    >
                      <item.icon size={17} className="shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

   
      <SidebarFooter className="border-t p-3 z-10">
        {/* Go to Admin panel*/}
        <SidebarMenuButton className="cursor-pointer">
        {hasRole(["ADMIN"]) && (
          <Link 
            to="/admin" 
            className="flex items-center text-md text-muted-foreground
                       hover:text-accent-foreground cursor-pointer transition-colors p-2"
          >
            Go to Admin Panel
            <ArrowRightIcon size={13}/> 
          </Link>        
        )}
         </SidebarMenuButton>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">
                {user?.name ?? "User"}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {user?.role}
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            disabled={isPending}
            aria-label="Log out"
            className="p-1.5 rounded-md text-muted-foreground
                       hover:bg-accent hover:text-foreground
                       transition-colors disabled:opacity-50 shrink-0"
          >
            <LogOut size={15} />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}