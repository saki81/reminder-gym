import { useMutation, useQueryClient } from "@tanstack/react-query";
import { gymApi } from "@/api/gymApi";
import { useGym } from "../shared/useGym";
import { useToast } from "../shared/useToast";
import type { UpdateGym } from "@/types";


export function useUpdateGym() {
    const { currentGym, setCurrentGym } = useGym();
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({

        mutationFn: (data:UpdateGym) => gymApi.updateGym(currentGym!.id, data),

        onSuccess: (res) => {
            const updatedGym = res.data.gym;

            // Update gym context to new data 
            setCurrentGym(updatedGym);

            queryClient.invalidateQueries({ queryKey: ["my-gyms"] });

            toast.success("Gym updated successfully")
        } 
    });
}