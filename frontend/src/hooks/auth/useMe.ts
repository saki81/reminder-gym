import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../api/authApi";
import { useAuth } from "../shared/useAuth";


export function useMe() {

  /*return useQuery({
    queryKey: ["me"],

    queryFn: async () => {
      const res = await authApi.me();
      return res.data.user;
    },

    retry: false,

    staleTime: 1000 * 60 * 5,
  });*/
 
  const { login,logout, setLoading } = useAuth();

  const { data, isFetched, isError } = useQuery({
    queryKey: ["me"],
    queryFn: authApi.me,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data?.data) {
      login(data.data);
      return;
      
    }

    if (isError) {
      logout();
     
     setLoading(false)
     return;
    }

    if (isFetched) {
      setLoading(false);
    }
  }, [data, isFetched , login, logout, setLoading, isError]);
}

/*export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await authApi.me();
      return res.data.user;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}*/