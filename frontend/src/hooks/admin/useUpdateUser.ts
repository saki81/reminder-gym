import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import type { UpdateUserPayload } from "@/types/index";
 
interface UpdateUserVariables {
  id: string;
  payload: UpdateUserPayload;
}
 
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
 
  return useMutation({
    mutationFn: ({ id, payload }: UpdateUserVariables) =>
      adminApi.updateUser(id, payload),
 
    onSuccess: (res, variables) => {
      const user = res.data.user;
 
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-users", "detail", variables.id],
      });
 
      return user;
    },
  });
};
