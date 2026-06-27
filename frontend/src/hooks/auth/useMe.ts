/*import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../../api/authApi";
import { useAuth } from "../shared/useAuth";


export function useMe() {

 
  const { login,logout, setLoading } = useAuth();

  const { data, isFetched, isError } = useQuery({
    queryKey: ["me"],
    queryFn: authApi.me,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data) {
      login(data);
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
}*/

import { useEffect } from "react";
import { useQuery }  from "@tanstack/react-query";
import { authApi }   from "../../api/authApi";
import { useAuth }   from "../shared/useAuth";

export function useMe() {
  const { login, logout, setLoading } = useAuth();

  const { data, isFetched, isError } = useQuery({
    queryKey: ["me"],
    queryFn:  authApi.me,
    retry:    false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (data) {
      // ✅ izvuci user iz axios response
      const user = data.data?.user;
      if (user) {
        login(user);
      }
      setLoading(false);
      return;
    }
    if (isError) {
      logout();
      setLoading(false);
      return;
    }
    if (isFetched) {
      setLoading(false);
    }
  }, [data, isFetched, isError, login, logout, setLoading]);
}