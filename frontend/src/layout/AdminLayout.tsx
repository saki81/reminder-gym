
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

      <div className="flex h-svh w-full overflow-hidden bg-zinc-950">

      <AdminSidebar />

      {/* right column */}
      <div className="flex flex-1 flex-col overflow-hidden">

     {/* Admin topbar */}
                <header
            className="flex h-14 items-center gap-3 border-b
                       border-zinc-800 bg-zinc-900 px-4 shrink-0"
          >
            <SidebarTrigger
              className="text-zinc-400 hover:text-zinc-100 transition-colors"
            />
            <span className="text-sm font-semibold text-zinc-100">
              Admin Panel
            </span>
          </header>
         
         <main className="flex-1 overflow-auto p-4 lg:p-6 bg-zinc-950">
            {children}
         </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
