import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";;


export const useGymById = (id?: string) => {
    return useQuery({
        queryKey: ["admin", "gym", id],
        queryFn: async () => {
           const res = await adminApi.getGymById(id as string);
           const raw = res.data.gym;
           const ownerEntry = raw.admins[0];
           
           return {
             id: raw.id,
             gymName: raw.gymName,
             city: raw.city,
             createdAt: raw.createdAt,
             updatedAt: raw.updatedAt,
             owner: ownerEntry ? { userId: ownerEntry.userId, ...ownerEntry.user } : null,
             counts: raw._count,
           };
        },
        enabled: !!id,
    })
}