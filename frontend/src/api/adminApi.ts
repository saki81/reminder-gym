import { apiClient } from "./clientApi";
import type { 
    AdminUser,
    GetUsersParams,
    GetUsersResponseRaw, 
    UpdateUserPayload 
 } from "../types/index";

export const adminApi = {
    getDashboard: () => apiClient.get("/admin/dashboard"),

    getUsers: (params: GetUsersParams) => 
        apiClient.get<GetUsersResponseRaw>("/admin/users", { params }),

    getUserById: (id: string) => 
        apiClient.get<{ user: AdminUser }>(`/admin/users/${id}`),

    updateUser: (id: string, data: UpdateUserPayload) => 
        apiClient.patch<{ user: AdminUser }>(`/admin/users/${id}`, data),

    activateUser: (id: string) => 
        apiClient.patch<{ user: AdminUser }>(`/admin/users/${id}/activate`),

    deactivateUser: (id: string) => 
        apiClient.patch<{ user: AdminUser }>(`/admin/users/${id}/deactivate`),

    deleteUser: (id: string) => apiClient.delete(`/admin/users/${id}`),
};