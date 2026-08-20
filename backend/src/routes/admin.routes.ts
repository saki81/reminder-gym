import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { isPlatformAdmin } from "../middlewares/isPlatformAdmin.js";
import { gymSchema, updateUserSchema } from "../validators/schema.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    getDashboard,

    getUsers,
    getUserById,
    updateUser,
    activateUser,
    deactivateUser,
    deleteUser,

    getGyms,
    getGymById,
    createGym,
    updateGym,
    activateGym,
    deactivateGym,
    deleteGym

} from "../controllers/admin.controller.js";

const router = express.Router();

router.use(verifyToken);
router.use(isPlatformAdmin);

router.get("/dashboard", getDashboard);

// USERS

router.get("/users", getUsers);
router.get("/users/:id", getUserById);

router.patch("/users/:id", validate(updateUserSchema), updateUser);

router.patch("/users/:id/activate", activateUser);
router.patch("/users/:id/deactivate", deactivateUser);

router.delete("/users/:id", deleteUser);

// GYMS

router.get("/gyms", getGyms);
router.get("/gyms/:id", getGymById);

router.post("/gyms",validate(gymSchema), createGym);

router.patch("/gyms/:id",validate(gymSchema), updateGym);

router.patch("/gyms/:id/activate", activateGym);
router.patch("/gyms/:id/deactivate", deactivateGym);

router.delete("/gyms/:id", deleteGym);

export default router;