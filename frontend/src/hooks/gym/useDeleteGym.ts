import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { gymApi } from "@/api/gymApi";
import { useAuth } from "../shared/useAuth";
import { useGym } from "../shared/useGym";
import { useToast } from "../shared/useToast";


export function useDeleteGym() {
    const { user, login } = useAuth();
    const { currentGym, setCurrentGym, clearGym } = useGym();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const toast = useToast();

    return useMutation({
        mutationFn: (gymId: string) => gymApi.deleteGym(gymId),

        onSuccess: async (_res, deletedGymId) => {

            await queryClient.invalidateQueries({ queryKey: ["my-gyms"] });

            const isActivateDeletion = currentGym?.id === deletedGymId;

            if (isActivateDeletion) {
                // fetch refresh list gyms
                const result = await queryClient.fetchQuery({
                    queryKey: ["my-gyms"],
                    queryFn: gymApi.getMyGyms,
                });

                       const remainingGyms = result?.data?.gyms ?? [];
 
            if (remainingGyms.length > 0) {
              // Automatski switchamo na prvi preostali gym
              const nextGym = remainingGyms[0];
              setCurrentGym(nextGym);
            if (user) login({ ...user, gymId: nextGym.id });
              toast.success("Gym deleted. Switched to another gym.");
            } else {
              // Nema više gymova → šalji na kreiranje novog
              clearGym();
              if (user) login({ ...user, gymId: undefined });
              toast.info("Gym deleted. Please create a new gym.");
              navigate("/gym/create", { replace: true });
            }
            } else {
              toast.success("Gym deleted successfully.");
          }
        },
 
            onError: () => toast.error("Failed to delete gym."),
    
        })
       }