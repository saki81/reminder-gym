import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import { useToast } from "@/hooks/shared/useToast"
import { getErrorMessage } from "../shared/useFieldErrors";
import type { UpdateGymPayload } from "@/types";


export const useUpdateGym = () => {
    const queryClient = useQueryClient();
    const toast = useToast()

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateGymPayload}) =>
            adminApi.updateGym(id, payload),
        onSuccess: (_data, variables )  => {
            queryClient.invalidateQueries({ queryKey: ["admin", "gyms"]});
            queryClient.invalidateQueries({ queryKey: ["admin", "gym", variables.id]});
            toast.success("Gym updated successfully")
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, "Failed to update gym"))
        }
    }) 
}