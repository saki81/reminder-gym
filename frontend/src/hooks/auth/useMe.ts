import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../api/authApi";
import { useAuth } from "../shared/useAuth";


export function useMe() {
   const { login, setLoading } = useAuth();

   const { data, isFetched } = useQuery({
       queryKey: ["me"],
       queryFn: authApi.me,

       retry: false,

       staleTime: 1000 * 60 * 5,
   });

   useEffect(() => {
    // Session valid → store user in context
    if (data?.data?.user) {
      login(data.data.user);
    }
 
    // Query settled (success or error) → stop blocking the UI
    if (isFetched) {
      setLoading(false);
    }
  }, [data, isFetched]);

}