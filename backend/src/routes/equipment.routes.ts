import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { validate } from "../middlewares/validate.middleware.js";
import { equipmentSchema } from "../validators/schema.validator.js";

import {
    createEquipment,
    getEquipments,
    getEquipmentById,
    updateEquipment,
    deleteEquipment,
} from "../controllers/equipment.controller.js";

const router = express.Router();

router.post("/", verifyToken, validate(equipmentSchema), createEquipment);
router.get("/", verifyToken, getEquipments);
router.get("/:equipmentId", verifyToken, getEquipmentById);
router.patch("/:equipmentId", verifyToken, validate(equipmentSchema), updateEquipment);
router.delete("/:equipmentId", verifyToken, deleteEquipment);


export default router