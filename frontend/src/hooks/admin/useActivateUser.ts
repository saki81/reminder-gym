import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import { useToast } from "../shared/useToast";
import { getErrorMessage } from "../shared/useFieldErrors";
 
export const useActivateUser = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
 
  return useMutation({
    mutationFn: (id: string) => adminApi.activateUser(id),
 
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user", id] });
      toast.success("User is activated")
    },
    onError: (error) => {
        toast.error(getErrorMessage(error, "Failed to activate user"))
    }
  });
};
 
