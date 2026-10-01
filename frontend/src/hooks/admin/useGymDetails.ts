import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import type { AdminGymDetail } from "@/types";


export const useGymDetails = (id?: string | null) => {
    return useQuery({
        queryKey: ["admin", "gym", id],
        queryFn: async () => {
           const res = await adminApi.getGymById(id as string);
           const raw = res.data.gym;
           const ownerEntry = raw.admins[0];
           
          const gym: AdminGymDetail = {
             id: raw.id,
             gymName: raw.gymName,
             city: raw.city,
             isActive: raw.isActive,
             createdAt: raw.createdAt,
             updatedAt: raw.updatedAt,
             owner: ownerEntry ? { userId: ownerEntry.userId, ...ownerEntry.user } : null,
             counts: raw._count,
           };
           return gym
        },
        enabled: !!id,
    })
}