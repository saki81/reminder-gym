export type Role = "ADMIN" | "OWNER" | "STAFF";
 
export type User = {
  id: string;
  email: string;
  name?: string;
  role: Role;
  gymId?: string;
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
 
export type VerifyOtp = {
  email: string;
  otp: string;
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
  name: string; 
  city?: string;
  craetedAt: string;
}

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
 
export type AdminStats = {
  totalGyms: number;
  totalUsers: number;
  totalEquipments: number;
  totalMaintenances: number;
};
 
export type AdminUser = User & {
  gym?: Gym;
  createdAt: string;
};
 