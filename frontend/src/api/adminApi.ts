import { apiClient } from "./clientApi";
import type { 
    AdminUser,
    GetUsersParams,
    GetUsersResponseRaw, 
    GetGymsParams,
    GetGymsResponseRaw,
    AdminGymDetailRaw,
    CreateGymPayload,
    CreateGymResponse,
    UpdateGymPayload,
    UpdateGymResponseRaw,
    GymActionResponse,
    DeleteGymResponse,
    AdminUserDetailRaw,

 } from "../types/index";

export const adminApi = {
    getDashboard: () => apiClient.get("/admin/dashboard"),

    getUsers: (params: GetUsersParams) => 
        apiClient.get<GetUsersResponseRaw>("/admin/users", { params }),

    getUserById: (id: string) => 
        apiClient.get<{ user: AdminUserDetailRaw }>(`/admin/users/${id}`),


    activateUser: (id: string) => 
        apiClient.patch<{ user: AdminUser }>(`/admin/users/${id}/activate`),

    deactivateUser: (id: string) => 
        apiClient.patch<{ user: AdminUser }>(`/admin/users/${id}/deactivate`),

    deleteUser: (id: string) => apiClient.delete(`/admin/users/${id}`),

    getGyms: (params: GetGymsParams) =>
        apiClient.get<GetGymsResponseRaw>("/admin/gyms", { params }),

    getGymById: (id: string) =>
        apiClient.get<{ gym: AdminGymDetailRaw }>(`/admin/gyms/${id}`),

    createGym: (data: CreateGymPayload) =>
        apiClient.post<CreateGymResponse>("/admin/gyms", data),

    updateGym: (id: string, data: UpdateGymPayload) =>
        apiClient.patch<UpdateGymResponseRaw>(`/admin/gyms/${id}`, data),

    activateGym: (id: string) =>
        apiClient.patch<GymActionResponse>(`/admin/gyms/${id}/activate`),

    deactivateGym: (id: string) =>
        apiClient.patch<GymActionResponse>(`/admin/gyms/${id}/deactivate`),

    deleteGym: (id: string) =>
        apiClient.delete<DeleteGymResponse>(`/admin/gyms/${id}`),
};