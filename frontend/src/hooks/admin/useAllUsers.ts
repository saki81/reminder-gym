import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import type { GetUsersParams } from "@/types/index";
 
export const useAllUsers = (params: GetUsersParams) => {
  return useQuery({
    queryKey: ["admin-users", "list", params],
    queryFn: async () => {
      const res = await adminApi.getUsers(params);
      return res.data; // { users, pagination }
    },
    placeholderData: keepPreviousData,
  });
};
 
