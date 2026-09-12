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

 
// Admin 

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


export type UpdateUserPayload = {
  name?: string;
  email?: string;
  emailVerified?: boolean;
}

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

