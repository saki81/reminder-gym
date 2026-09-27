import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import { useToast } from "@/hooks/shared/useToast";
import { getErrorMessage } from "@/hooks/shared/useFieldErrors";


export const useDeactivateGym = () => {
  const queryClient = useQueryClient();
  const toast = useToast()

  return useMutation({
    mutationFn: (id: string) => adminApi.deactivateGym(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "gyms"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "gym", id] });
      toast.success("Gym deactivated");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to deactivate gym"));
    },
  });
};