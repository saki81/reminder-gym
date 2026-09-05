import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
 
export const useActivateUser = () => {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: (id: string) => adminApi.activateUser(id),
 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
};
 
