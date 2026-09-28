import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import { useToast } from "@/hooks/shared/useToast";
import { getErrorMessage } from "../shared/useFieldErrors";
import type { CreateGymPayload } from "@/types";

export const useCreateGym = () => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: ( payload: CreateGymPayload) => adminApi.createGym(payload),
        onSuccess: () => {
            queryClient.invalidateQueries;({ queryKey: ["admin", "gyms"] });
            toast.success("Gym craeted successfully")
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, "Failed to create gym"))
        }
    });
};