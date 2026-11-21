import { useQuery } from "@tanstack/react-query";
import { staffApi } from "@/api/staffApi";


export const useInvitations = () => {
    return useQuery({
        queryKey: ["staff", "invitations"],
        queryFn: async () => {
            const res = await staffApi.getInvitations();
            return res.data.invitations;
        },
    });
};