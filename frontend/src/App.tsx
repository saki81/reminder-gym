import { useMe }     from "./hooks/auth/useMe";
import { AppRouter } from "./routes/AppRouter";
 
export default function App() {
  useMe();
  return  <AppRouter/>;
}
