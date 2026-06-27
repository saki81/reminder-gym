import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { gymApi } from "@/api/gymApi";
import { useAuth } from "../shared/useAuth";
import { useGym } from "../shared/useGym";
import type { Gym } from "@/types";


export function useMyGyms() {
    const { isAuthenticated, user } = useAuth();
    const { currentGym, setCurrentGym } = useGym();

     const gymId = user?.gymId ?? null;

    const query = useQuery({
        queryKey: ["my-gyms"],
        queryFn: gymApi.getMyGyms,
        enabled: isAuthenticated,
        staleTime: 1000 * 60 * 5,
    });
    
    
    const gyms = query.data?.data?.gyms ?? [];

    // Set up current gym authomatic
    useEffect(() => {
        if (gyms.length === 0 || currentGym) return;

        // Put activeGym current gym or first an the list
        const active = gyms.find((g: Gym) => g.id === gymId) ?? gyms[0];
        if (active) setCurrentGym(active)
    }, [gyms, currentGym, gymId, setCurrentGym])

    return {
        gyms,
        isLoading: query.isLoading, 
        error: query.error,
        refetch: query.refetch
    }
}