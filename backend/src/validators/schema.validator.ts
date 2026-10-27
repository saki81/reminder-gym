import {  z } from "zod";
import { resetPassword } from "../controllers/auth.controller.js";

// AUTH 
export const registerSchema = z.object({
    email: z.string().trim().toLowerCase().email("Invalid email format"),

    password: z.string().min(4,"Password must be ast least 4 characters")
    .max(50, "Password to long"),

    name: z.string().trim().min(3,"Name must be ast least 3 characters" ).
    max(50, "Name to long"),

    city: z.string().trim().optional()

});

export const loginSchema = z.object({
     email: z.string().trim().toLowerCase().email("Invalid email format"),
     password: z.string().min(1, "Password is required"),
});

// UPDATE USER 
export const updateUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name is too long")
    .optional(),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email format")
    .optional(),

  emailVerified: z
    .boolean()
    .optional(),
});

// UPDATE USER PROFILE
export const updateOwnerProfileSchema = updateUserSchema.pick({
  name: true,
  email: true,
});

export const verifyOtpSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be contain only numbers")
})

export const forgotPasswordSchema = z.object({
    email: z.string().trim().toLowerCase().email("Invalid email format")
});

export  const resetPasswordSchema = z.object({
    token: z.string().min(10, "Invalid token"),

    password: z.string().min(4, "Password must be ast least 4 characters")
    .max(50, "Password too long")
})

// CATEGORY 
export const categorySchema = z.object({
    name: z.string().trim().min(2, "Category name must be least 2 characters")
    .max(50, "Category name too long"),
});

export const updateCategorySchema = categorySchema.partial();

// EQUIPMENT
export const equipmentSchema = z.object({
    name: z.string().trim().min(2, "Equipment name must be at least 2 characters")
    .max(100, "Equipment name too long"),

    brand: z.string().trim().max(100).optional(),

    model: z.string().trim().max(100).optional(),

    categoryId: z.string().uuid("Invalid category id"), 
    
    inventoryNumber: z.string().trim().max(50).optional().or(z.literal("")),

    serialNumber: z.string().trim().max(100).optional().or(z.literal("")),

    serviceIntervalDays: z.number().int().min(1).max(3650).optional(),
});


export const updateEquipmentSchema = equipmentSchema.partial()

// GYM
export const gymSchema = z.object({
  gymName: z.string()
    .trim()
    .min(2, "Gym name must be at least 2 characters")
    .max(50, "Gym name too long"),

  city: z.string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(50, "City name too long"),
});

// ADMIN GYM
export const adminCreateGymSchema = z.object({
  gymName: z.string()
    .trim()
    .min(2, "Gym name must be at least 2 characters")
    .max(50, "Gym name too long"),

  city: z.string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(50, "City name too long")
    .optional()
    .transform((v) => v || undefined),
    ownerId: z.string().min(1, "Owner is required")
})

export const updateGymSchema = gymSchema.partial();

// MAINTENANCE
export const maintenanceStatusEnum = z.enum([
    "COMPLETED",
    "SCHEDULED"
]);
export const maintenanceSchema = z.object({
     title: z.string().trim().min(2, "Title must be at least 2 characters")
        .max(120, "Title too long" ),
    
        description: z.string().trim().max(500).optional().or(z.literal("")),
    
        cost: z.number().positive("Cost must be positive").optional(),
    
        status: maintenanceStatusEnum.optional(),
    
        performedAt: z.coerce.date(),
    
        nextDueDate: z.coerce.date().optional().nullable(),
    
        equipmentId: z.string().uuid("Invalid equipmentId")
});

export const updateMaintenaceSchema = maintenanceSchema.partial();

// PROFILE
export const updateProfileSchema = z.object({
   name: z.string().trim().min(3, "Name must be at least 3 characters")
   .max(50, "Name too long"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(4, "Current password is required"),

  newPassword:  z.string().min(4, "Password must be at least 4 characters")
  .max(50, "Password too long"),
}).refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from the current one",
    path: ["newPassword"],
});

// GYM SWITCH
export const switchGymSchema = z.object({
   gymId: z.string().uuid("Invalid gym id")
});

// STAFF
const gymIdsSchema = z.array(z.string().uuid("Invalid gym id"))
    .min(1, "Select at least one gym")
    .max(20, "Too many gyms selected")
    .refine((ids) => new Set(ids).size === ids.length, {
        message: "Duplicate gyms are not allowed",
    });
 
export const inviteStaffSchema = z.object({
    email: z.string().trim().toLowerCase().email("Invalid email format"),
 
    gymIds: gymIdsSchema,
});
 
export const updateStaffGymsSchema = z.object({
    gymIds: gymIdsSchema,
});
 
// gymIds je opcionalan: bez njega se akcija odnosi na SVE owner-ove teretane
export const staffStatusSchema = z.object({
    gymIds: gymIdsSchema.optional(),
});
 
// Token pozivnice: 32 slučajna bajta u hex obliku (64 znaka)
export const invitationTokenSchema = z.object({
    token: z.string().regex(/^[a-f0-9]{64}$/, "Invalid invitation token"),
});
 
export const acceptInvitationSchema = invitationTokenSchema.extend({
    name: z.string().trim().min(3, "Name must be at least 3 characters")
    .max(50, "Name too long"),
 
    password: z.string().min(4, "Password must be at least 4 characters")
    .max(50, "Password too long"),
});
 

