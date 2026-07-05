
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AdminSidebar } from "./AdminSidebar";

type Props = {
    children: React.ReactNode
}

export default function AdminLayout ({ children }: Props) {
  return (
    <SidebarProvider>
      <Toaster position="top-right" richColors />

      <div className="flex h-svh w-full overflow-hidden ">

      <AdminSidebar />

      {/* right column */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Admin topbar */}
         <header
            className="sticky top-0 z-40 flex h-14 items-center gap-3
                           border-b bg-card/80 backdrop-blur-sm px-4"
          >
            <SidebarTrigger className="text-muted-foreground hover:text-foreground"
            />
            <span className="text-sm font-semibold">
              Admin Panel
            </span>
          </header>
         
         <main className="flex-1 overflow-y-auto p-4 lg:p-6 ">
            {children}
         </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
