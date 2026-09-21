import { useEffect } from "react";
import { useQueryClient, useQuery }  from "@tanstack/react-query";
import { authApi }   from "../../api/authApi";
import { useAuth }   from "../shared/useAuth";

// 10 sekundi: 10000
// 8 sati:  8 * 60 * 60 * 1000  = 28800000
// 12 sati: 12 * 60 * 60 * 1000 = 43200000

const SESSION_CHECK_INTERVAL = 10 * 60 * 1000; // 10 minuta

export function useMe() {
  const { login, logout, setLoading } = useAuth();
  const queryClient = useQueryClient()

  const { data, isFetched, isError } = useQuery({
    queryKey: ["me"],
    queryFn:  authApi.me,
    retry:    false,
    staleTime: 1000 * 60 * 5,
    refetchInterval: (query) => (query.state.data ? SESSION_CHECK_INTERVAL : false ),
    refetchIntervalInBackground: true,
  });


  useEffect(() => {

  if (isError) {
    logout();
    setLoading(false);
    queryClient.removeQueries({ queryKey: ["me"] });
    return;
  }

  if (data) {
    login(data);
    setLoading(false);
    return;
  }

  if (isFetched) {
    setLoading(false);
  }
}, [data, isFetched, isError, login, logout, setLoading]);
}