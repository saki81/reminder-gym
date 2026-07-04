import { NavLink, Link }  from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Dumbbell,
  ArrowLeft,
  LogOut,
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
import { useAuth } from "@/hooks/shared/useAuth";
import { useLogout } from "@/hooks/auth/useLogout";


const ADMIN_NAV = [
  { to: "/admin",        label: "Overview",  icon: LayoutDashboard, end: true },
  { to: "/admin/gyms",   label: "Gyms",      icon: Building2 },
  { to: "/admin/users",  label: "Users",     icon: Users },

]

export function AdminSidebar() {
   const { user } = useAuth();
   const { mutate: logout, isPending } = useLogout();

   console.log("user role:", user?.role);

   const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "?";


    return (
    <Sidebar className="border-r border-zinc-800 bg-zinc-900">
 
   
      <SidebarHeader className="border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center
                          rounded-lg bg-primary shrink-0">
            <Dumbbell size={16} color="white" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-100 truncate">
              Reminder Gym
            </p>
            <p className="text-[11px] text-zinc-400 truncate">
              Admin Panel
            </p>
          </div>
        </div>
      </SidebarHeader>
 
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-500 text-[11px]
                                        uppercase tracking-wider">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ADMIN_NAV.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton >
                    <NavLink
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        [
                          "flex items-center gap-3 rounded-lg px-3 py-2",
                          "text-sm transition-colors duration-150",
                          isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
                        ].join(" ")
                      }
                    >
                      <item.icon size={16} className="shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
 
  
      <SidebarFooter className="border-t border-zinc-800 p-3 space-y-3">
 
        {/* Back to app */}
        <Link
          to="/gym"
          className="flex items-center gap-2 text-xs text-zinc-400
                     hover:text-zinc-100 transition-colors px-1"
        >
          <ArrowLeft size={13} />
          Back to app
        </Link>
 
        {/* User info + logout */}
        {user && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex size-7 items-center justify-center
                              rounded-full bg-primary/20 text-primary
                              text-xs font-semibold shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-zinc-100 truncate">
                  {user.name ?? "Admin"}
                </p>
                <p className="text-[11px] text-zinc-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
 
            <button
              onClick={() => logout()}
              disabled={isPending}
              aria-label="Log out"
              className="p-1.5 rounded-md text-zinc-500
                         hover:bg-zinc-800 hover:text-red-400
                         transition-colors disabled:opacity-50 shrink-0"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
 
      </SidebarFooter>
    </Sidebar>
  );


}