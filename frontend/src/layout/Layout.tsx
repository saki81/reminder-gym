
/*type Props = {
    children: React.ReactNode
}

export default function Layout ({ children }: Props) {
  return (
    <div>Layout</div>
  )
}*/

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Navbar }     from "./Navbar";
import { Toaster }    from "@/components/ui/sonner";
import { useGym }     from "@/hooks/shared/useGym";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const { currentGym } = useGym();

  return (
    <SidebarProvider>
      <Toaster position="top-right" richColors />

      <div className="flex h-svh w-full overflow-hidden">

      <AppSidebar /> 

        <div className="flex flex-1 flex-col overflow-hidden">

        <Navbar />

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </main>

        </div>
      </div>
    </SidebarProvider>
  );
}
