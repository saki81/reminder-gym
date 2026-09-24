import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import type { UpdateGymPayload } from "@/types";


export const useUpdateGym = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateGymPayload}) =>
            adminApi.updateGym(id, payload),
        onSuccess: (_data, variables )  => {
            queryClient.invalidateQueries({ queryKey: ["admin", "gyms"]});
            queryClient.invalidateQueries({ queryKey: ["admin", "gym", variables.id]})
        }
    }) 
}