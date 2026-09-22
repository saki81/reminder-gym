import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import type { CreateGymPayload } from "@/types";

export const useCreateGym = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateGymPayload) => adminApi.createGym(payload),
        onSuccess: () => {
            queryClient.invalidateQueries;({ queeryKey: ["admin", "gyms"] });
        },
    });
};