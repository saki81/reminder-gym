export type Role = "ADMIN" | "OWNER" | "STAFF";
 
export type User = {
  id: string;
  email: string;
  name?: string;
  role: Role;
  activeGymId?: string | null;
  emailVerified: boolean;
};
 
// ── API input 
 
export type Login = {
  email: string;
  password: string;
};
 
export type Register = {
  name: string;
  email: string;
  password: string;
};
 
export type ForgotPassword = {
  email: string;
};

 
export type ResetPassword = {
  token: string;
  password: string;
};
 
// API response error shape from backend Zod validation 
 
export type ApiError = {
  message: string;
  errors?: Record<string, string[]>; // field-level errors from Zod
};

// Gym
export type Gym = {
  id: string;
  gymName: string; 
  city?: string;
  craetedAt: string;
};

export type CreateGym = {
  gymName: string;
  city?:   string;
};
 
export type UpdateGym = Partial<CreateGym>;


// Equipment

export type Equipment = {
  id: string;
  name: string;
  brand?: string;
  model?: string;
  categoryId: string;
  category?: Category;
  gymId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateEquipment = {
   name: string;
   brand?: string;
   model?: string;
   categoryId: string;
   gymId: string;
}

export type UpdateEquipment = Partial<CreateEquipment>;
 

// Category

export type Category = {
  id: string;
  name: string;
  gymId?: string;
  createdAt: string;
};
 
export type CreateCategory = {
  name: string;
  gymId?: string;
};

//  Maintenance 
 
export type MaintenanceStatus = "COMPLETED" | "SCHEDULED";
 
export type Maintenance = {
  id: string;
  title: string;
  description?: string;
  cost?: number;
  status: MaintenanceStatus;
  performedAt: string;
  nextDueDate?: string;
  equipmentId: string;
  equipment?: Equipment;
  gymId: string;
  userId: string;
  createdAt: string;
};
 
export type CreateMaintenance = {
  title: string;
  description?: string;
  cost?: number;
  status: MaintenanceStatus;
  performedAt: string;
  nextDueDate?: string;
  equipmentId: string;
  gymId: string;
};
 
export type UpdateMaintenance = Partial<CreateMaintenance>;

 
// Admin users
export interface AdminUserGymInfo {
  id: string;
  gymName: string;
  city: string;
}

export type AdminUser = {
  id: string;
  email: string;
  name: string | null;
  isActive: boolean;
  emailVerified: boolean;
  activeGymId: string | null;
  createdAt: string;
  updatedAt: string;
  gyms: AdminUserGymInfo[];
  
}

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type GetUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | string;
  gymId?: string;
}

export type GetUsersResponse = {
  users: AdminUser[];
  pagination: PaginationMeta;
}

export type AdminUserAdminEntryRaw = {
  id: string;
  gymId: string;
  gym?: AdminUserGymInfo;
}
 
export type AdminUserRaw = {
  id: string;
  email: string;
  name: string | null;
  isActive: boolean;
  emailVerified: boolean;
  activeGymId: string | null;
  createdAt: string;
  updatedAt: string;
  admins: AdminUserAdminEntryRaw[];
}
 
export type GetUsersResponseRaw = {
  users: AdminUserRaw[];
  pagination: PaginationMeta;
}

export type AdminUserDetail = AdminUser & {
  emailVerifiedAt: string | null;
}

export type AdminUserGymInfoDetail = AdminUserGymInfo & {
  createdAt: string;
}

export type AdminUserAdminEntryDetailRaw = {
  id: string;
  gymId: string;
  gym?: AdminUserGymInfoDetail;
}

export type AdminUserDetailRaw = {
  id: string;
  email: string;
  name: string | null;
  isActive: boolean;
  emailVerified: boolean;
  emailVerifiedAt: string | null;
  activeGymId: string | null;
  createdAt: string;
  updatedAt: string;
  admins: AdminUserAdminEntryDetailRaw[];
}

// ADMIN gyms
export type AdminGymOwnerInfo = {
  id: string;
  name: string;
  email: string;
}

export type AdminGymCounts = {
  admins: number;
  equipments: number;
  categories: number;
  maintenances: number;
}

export type AdminGym = {
  id: string;
  gymName: string;
  city: string;
  isActive: boolean;
  createdAt: string;
  owner: AdminGymOwnerInfo | null;
  counts: AdminGymCounts;
}

export type AdminGymDetail = {
  id: string;
  gymName: string;
  city: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  owner: (AdminGymOwnerInfo & { userId: string }) | null;
  counts: AdminGymCounts;
}

export type AdminGymBasic = {
  id: string;
  gymName: string;
  city: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GetGymsParams = {
  page?: number;
  limit?: number;
  search?: string;
  city?: string;
  status?: "active" | "inactive" | string;
}

export type GetGymsResponse = {
  gyms: AdminGym[];
  pagination: PaginationMeta;
}

export type CreateGymPayload = {
  gymName: string;
  city: string;
  ownerId: string;
}

export type UpdateGymPayload = {
  gymName: string;
  city: string;
}

export type AdminGymAdminEntryRaw = {
  user: AdminGymOwnerInfo;
}

export type AdminGymRaw = {
  id: string;
  gymName: string;
  city: string;
  isActive: boolean;
  createdAt: string;
  admins: AdminGymAdminEntryRaw[];
  _count: AdminGymCounts;
}

export type GetGymsResponseRaw = {
  gyms: AdminGymRaw[];
  pagination: Omit<PaginationMeta, "hasNextPage" | "hasPreviousPage">;
}

export type AdminGymDetailAdminEntryRaw = {
  userId: string;
  user: AdminGymOwnerInfo;
}

export type AdminGymDetailRaw = {
  id: string;
  gymName: string;
  city: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  admins: AdminGymDetailAdminEntryRaw[];
  _count: AdminGymCounts;
}

export type GetGymByIdResponseRaw = {
  gym: AdminGymDetailRaw;
}

export type CreateGymResponse = {
  message: string;
  gym: AdminGymBasic;
}

export type UpdateGymResponseRaw = {
  message: string;
  gym: {
    id: string;
    gymName: string;
    city: string;
    isActive: boolean;
    createdAt: string;
    _count: {
      admins: number;
      equipments: number;
      categories: number;
      maintenance: number;
    };
  };
}

export type GymActionResponse = {
  message: string;
  gym: AdminGymBasic;
}

export type DeleteGymResponse = {
  message: string;
  gymId: string;
}

// ADMIN dashboard
export type AdminDashboard = {
  users: {
    total: number;
    active: number;
    inactive: number;
  };
  gyms: {
    total: number;
    active: number;
    inactive: number;
  };
}

  