import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gymApi } from "@/api/gymApi";
import { useAuth } from "../shared/useAuth";
import { useGym } from "../shared/useGym";
import { useToast } from "../shared/useToast";
import  type { Gym } from "@/types";


export function useSwitchGym() {
    const { user, login } = useAuth();
    const { setCurrentGym } = useGym();
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (gymId: string) => gymApi.switchGym(gymId),

        onSuccess: (_res, gymId, context) => {

            const gym = context as Gym;

            if (user) {
                login({ ...user, gymId });
            }

            setCurrentGym(gym);

            queryClient.invalidateQueries({ queryKey: ["equipment"] });
            queryClient.invalidateQueries({ queryKey: ["maintenance"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
 
            toast.success(`Switched to ${gym.gymName}`);

        },

          onError: () => toast.error("Failed to switch gym")
    })
}