import { useMe }     from "./hooks/auth/useMe";
import { AppRouter } from "./routes/AppRouter";
import { Toaster } from "./components/ui/sonner";

 
export default function App() {
  useMe();
  return ( 
    <>
     <AppRouter/> 
    {/* <Toaster /> */}
    </>
 )
}
