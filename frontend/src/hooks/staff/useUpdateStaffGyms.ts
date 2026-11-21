import { useMutation, useQueryClient } from "@tanstack/react-query";
import { staffApi } from "@/api/staffApi";
import { useToast } from "@/hooks/shared/useToast";
import { getErrorMessage } from "@/hooks/shared/useFieldErrors";
import type { UpdateStaffGyms } from "@/types";


type Variables = {
    userId: string;
    payload: UpdateStaffGyms;
};

export const useUpdateStaffGyms = () => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: ({ userId, payload }: Variables) => 
            staffApi.updateStaffGyms(userId, payload),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff", "members"] });
            toast.success("Staff access updated successfully");
        },

        onError: (error) => {
            toast.error(getErrorMessage(error, "Failed to update staff access"));
        }
    })
}
