import { apiClient } from "./clientApi";
import type { GetUsersParams, UpdateUserPayload } from "../types/index";

export const adminApi = {
    getDashboard: () => apiClient.get("/admin/dashboard"),

    getUsers: (params: GetUsersParams) => apiClient.get("/admin/users", { params }),

    getUserById: (id: string) => apiClient.get(`/admin/users/${id}`),

    updateUser: (id: string, data: UpdateUserPayload) => apiClient.patch(`/admin/users/${id}`, data),

    activateUser: (id: string) => apiClient.patch(`/admin/users/${id}/activate`),

    deactivateUser: (id: string) => apiClient.patch(`/admin/users/${id}/deactivate`),

    deleteUser: (id: string) => apiClient.delete(`/admin/users/${id}`),
};