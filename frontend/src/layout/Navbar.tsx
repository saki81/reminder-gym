import { LogOut, User, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { GymSwitcher } from "@/components/gym/GymSwitcher";
import { useAuth } from "@/hooks/shared/useAuth";
import { useLogout } from "@/hooks/auth/useLogout";

export const Navbar = () => {
    const { user } = useAuth();
    const { mutate: logout, isPending } = useLogout();
   
    const initials = user?.name
       ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
       : user?.email?.[0]?.toUpperCase() ?? "?";
    
    return (
      <header className="sticky top-0 z-40 flex h-14 items-center gap-3
                           border-b bg-card/80 backdrop-blur-sm px-4">
        
        {/* Mobile sidebar toggle */}
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
         <Separator orientation="vertical" className="h-5"/>
          <GymSwitcher />
              <div className="flex-1" />
 
            {/* User dropdown */}
           <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2">
            <Avatar className="size-7">
              <AvatarFallback className="bg-primary text-primary-foreground
                                         text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-sm font-medium
                             max-w-120px truncate">
              {user?.name ?? user?.email}
            </span>
            <ChevronDown size={14} className="text-muted-foreground" />
    
        </DropdownMenuTrigger>
 
        <DropdownMenuContent align="end" className="w-48">
         <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium truncate">
                {user?.name ?? "User"}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.email}
              </span>
            </div>
          </DropdownMenuLabel>
 
          <DropdownMenuSeparator />
 
          <DropdownMenuItem className="flex items-center">
            
            <User size={14} className="mr-2" />
            <Link to="/profile" className="cursor-pointer">
              Profile
            </Link>
          </DropdownMenuItem>
 
          <DropdownMenuSeparator />
 
          <DropdownMenuItem
            onClick={() => logout()}
            disabled={isPending}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            <LogOut size={14} className="mr-2" />
            {isPending ? "Logging out…" : "Log out"} 
          </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
    )
}