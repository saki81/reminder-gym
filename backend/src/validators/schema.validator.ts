import { email, z } from "zod";
import { resetPassword } from "../controllers/auth.controller.js";

// AUTH 
export const registerSchema = z.object({
    email: z.string().trim().toLowerCase().email("Invalid email format"),

    password: z.string().min(4,"Password must be ast least 4 characters")
    .max(50, "Password to long"),

    name: z.string().trim().min(3,"Name must be ast least 3 characters" ).
    max(50, "Name to long"),

   // gymName: z.string().trim().min(2, "Gym name must be at least 2 characters").
   // max(50, "Gym name to long"),

    city: z.string().trim().optional()

});

export const loginSchema = z.object({
     email: z.string().trim().toLowerCase().email("Invalid email format"),
     password: z.string().min(1, "Password is required"),
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

    gymId: z.string().uuid("Invalid gym id")
});

export const updateCategorySchema = categorySchema.partial();

// EQUIPMENT
export const equipmentSchema = z.object({
    name: z.string().trim().min(2, "Equipment name must be at least 2 characters")
    .max(100, "Equipment name too long"),

    brand: z.string().trim().max(100).optional(),

    model: z.string().trim().max(100).optional(),

    categoryId: z.string().uuid("Invalid category id"),    
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

export const updateGymSchema = gymSchema.partial();

// MAINTENANCE
export const maintenanceStatusEnum = z.enum([
    "COMPLETED",
    "SCHEDULED"
]);

export const maintenanceSchema = z.object({
     title: z.string().trim().min(2, "Title must be at least 2 characters")
        .max(120, "Title too long" ),
    
        description: z.string().trim().max(500).optional(),
    
        cost: z.number().positive("Cost must be positive").optional(),
    
        status: maintenanceStatusEnum.optional(),
    
        performedAt: z.coerce.date(),
    
        nextDueDate: z.coerce.date().optional(),
    
        equipmentId: z.string().uuid("Invalid equipmentId")
});

export const updateMaintenaceSchema = maintenanceSchema.partial();


