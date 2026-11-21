import { useQuery } from "@tanstack/react-query";
import { staffApi } from "@/api/staffApi";


export const useStaff = () => {
    return useQuery({
        queryKey: ["staff", "members"],
        queryFn: async () => {
            const res = await staffApi.getStaff();
            return res.data.staff;
        }
    })
}