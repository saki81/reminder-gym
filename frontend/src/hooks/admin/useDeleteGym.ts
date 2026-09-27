import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import { useToast } from "../shared/useToast";
import { getErrorMessage } from "../shared/useFieldErrors";

export const useDeleteGym = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (id: string) => adminApi.deleteGym(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "gyms"] });
      toast.success("Gym deleted successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete gym"));
    },
  });
};