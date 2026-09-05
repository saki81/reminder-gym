import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
 
export const useDeactivateUser = () => {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: (id: string) => adminApi.deactivateUser(id),
 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
};
 
