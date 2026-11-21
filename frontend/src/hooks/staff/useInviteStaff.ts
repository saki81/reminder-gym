import { useMutation, useQueryClient } from "@tanstack/react-query";
import { staffApi } from "@/api/staffApi";
import { useToast } from "@/hooks/shared/useToast";
import { getErrorMessage } from "../shared/useFieldErrors";
import type { InviteStaff } from "@/types";


export const useInviteStaff = () => {
    const queryClient = useQueryClient();
    const toast = useToast();

    return useMutation({
        mutationFn: (payload: InviteStaff) => staffApi.inviteStaff(payload),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["staff", "invitations"]});
            toast.success("Invitation sent successfully");
        },

        onError: (error) => {
            toast.error(getErrorMessage(error, "Failed to send invitation"));
        }
    })
}