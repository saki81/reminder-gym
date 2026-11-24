import { useQuery } from "@tanstack/react-query";
import { staffApi } from "@/api/staffApi";
 
// Za stranicu /accept-invite: fetch data invite (email, gym, does the account exist)
export const usePreviewInvitation = (token: string | null) => {
  return useQuery({
    queryKey: ["invitation-preview", token],
    queryFn: async () => {
      const res = await staffApi.previewInvitation(token as string);
      return res.data.invitation;
    },
    enabled: !!token,
    retry: false,          // invalid or expired invitations are not repeated
    staleTime: Infinity,   // the token is one-time, no need to reload
  });
};