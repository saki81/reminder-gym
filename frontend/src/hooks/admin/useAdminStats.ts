import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi";
import type { AdminDashboard } from "@/types";
 
export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async (): Promise<AdminDashboard> => {
      const res = await adminApi.getDashboard();
      return res.data.dashboard;
    },
  });
};
