import { apiClient } from "./clientApi";
import type { CreateGym, UpdateGym } from "@/types";

export const gymApi = {

    createGym: (data: CreateGym) => apiClient.post("/gym", data),
    
    // get only OWNER OR ADMIN
    getMyGyms: () => apiClient.get("/gym/my-gyms"),

    switchGym: (gymId: string) => apiClient.post("/gym/switch", { gymId }),
    
    // update only OWNER OR ADMIN
    updateGym: (gymId: string, data: UpdateGym) => apiClient.patch(`/gym/${gymId}`, data),
    
    // delete only OWNER OR ADMIN
    deleteGym: (gymId: string) => apiClient.delete(`/gym/${gymId}`),
}
