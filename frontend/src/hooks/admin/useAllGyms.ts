import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import type { GetGymsParams, AdminGym } from "@/types";


export const useAllGyms = (params: GetGymsParams) => {
    return useQuery({
        queryKey: ["admin", "gyms", params],
        queryFn: async () => {
            const res = await adminApi.getGyms(params);
            const raw = res.data;

            const gyms: AdminGym[] = raw.gyms.map((gym) => ({
                id: gym.id,
                gymName: gym.gymName,
                city: gym.city,
                isActive: gym.isActive,
                createdAt: gym.createdAt,
                owner: gym.admins[0]?.user ?? null,
                counts: gym._count,
            }));

            return { gyms, pagination: raw.pagination }
        },

        placeholderData: keepPreviousData
    })
}