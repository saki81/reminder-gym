import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import type { AdminUserDetail } from "@/types/index";

export const useUserDetails = (id: string | null) => {
    return useQuery({
        queryKey: ["admin-users", "detail", id],
        queryFn: async () => {
            const res = await adminApi.getUserById(id as string);
            const raw = res.data.user;
             
            const user: AdminUserDetail = {
                id: raw.id,
                email: raw.email,
                name: raw.name,
                isActive: raw.isActive,
                emailVerified: raw.emailVerified,
                emailVerifiedAt: raw.emailVerifiedAt,
                activeGymId: raw.activeGymId,
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
                gyms: raw.admins.map((a) => a.gym).filter((g): g is NonNullable<typeof g> => !!g),

            };

            return user
        },
        enabled: !!id,
    });
};