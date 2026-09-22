import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import type { AdminUser, GetUsersParams } from "@/types/index";
 
export const useAllUsers = (params: GetUsersParams) => {
  return useQuery({
    queryKey: ["admin-users", "list", params],
    queryFn: async () => {
      const res = await adminApi.getUsers(params);
      const raw = res.data; 

      const users : AdminUser[] = raw.users.map((u) => ({
         id: u.id,
         email: u.email,
         name: u.name,
         isActive: u.isActive,
         emailVerified: u.emailVerified,
         activeGymId: u.activeGymId,
         createdAt: u.createdAt,
         updatedAt: u.updatedAt,
         gyms: u.admins.map((a) => a.gym).filter((g): g is NonNullable<typeof g> => !!g)
      }))

      return { users, pagination: raw.pagination}
    },
    placeholderData: keepPreviousData,
  });
};
 
