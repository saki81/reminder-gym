import { useQuery } from "@tanstack/react-query";
import { gymApi } from "@/api/gymApi";
import { useAuth } from "../shared/useAuth";


export function useMyGyms() {
    const { isAuthenticated } = useAuth();

    const query = useQuery({
        queryKey: ["my-gyms"],
        queryFn: gymApi.getMyGyms,
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 5,
    });


    return {
        gyms: query.data?.data?.gyms ?? [],
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch
    }
}