import { apiClient } from "./clientApi";
import type {
    GetStaffResponse,
    GetInvitationsResponse,
    InviteStaff,
    UpdateStaffGyms,
    StaffStatusPayload,
    InvitationPreviewResponse,
    AcceptInvitation
} from "../types/index";


export const staffApi = {
    // OWNER: staff
    getStaff: () => 
        apiClient.get<GetStaffResponse>("/staff"),

    updateStaffGyms: (userId: string, data: UpdateStaffGyms) =>
        apiClient.patch(`/staff/${userId}/gyms`, data),

    activateStaff: (userId: string, data: StaffStatusPayload = {} ) =>
        apiClient.patch(`/staff/${userId}/activate`, data),

    deactivateStaff: (userId: string, data: StaffStatusPayload = {} ) =>
        apiClient.patch(`/staff/${userId}/deactivate`, data),

    removeStaff: (userId: string) => 
        apiClient.delete(`/staff/${userId}`),

    // OWNER: invitations
    getInvitations: () => 
        apiClient.get<GetInvitationsResponse>("/staff/invitations"),

    inviteStaff: (data: InviteStaff) => 
        apiClient.post("/staff/invitations", data),

    resendInvitation: (invitationId: string) => 
        apiClient.post(`/staff/invitations/${invitationId}/resend`),

    revokeInvitation: (invitationId: string) =>
        apiClient.delete(`/staff/invitations/${invitationId}`),

    // PUBLIC / STAFF: review and acceptance of the invitation
    previewInvitation: (token: string) =>
        apiClient.post<InvitationPreviewResponse>("/staff/invitations/preview", { token }),

    acceptInvitation: (data: AcceptInvitation) =>
        apiClient.post("/staff/accept", data),

    acceptInvitationExisting: (token: string) =>
        apiClient.post("/staff/accept-existing", { token }),
} 