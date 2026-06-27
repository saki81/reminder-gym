import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gymApi } from "@/api/gymApi";
import { useMyGyms } from "./useMyGyms";
import { useGym } from "../shared/useGym";
import { useToast } from "../shared/useToast";
import  type { Gym } from "@/types";


export function useSwitchGym() {
    const { setCurrentGym } = useGym();
    const { gyms } = useMyGyms();
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (gymId: string) => gymApi.switchGym(gymId),

        onSuccess: (_res, gymId) => {

            const gym = gyms.find((g:Gym) => g.id === gymId)

            if (gym) setCurrentGym(gym);

            queryClient.invalidateQueries({ queryKey: ["equipment"] });
            queryClient.invalidateQueries({ queryKey: ["maintenance"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
 
            toast.success(`Switched to ${gym.gymName}`);

        },

          onError: () => toast.error("Failed to switch gym")
    })
}