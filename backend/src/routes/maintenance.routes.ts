import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { validate } from "../middlewares/validate.middleware.js";
import { maintenanceSchema,updateMaintenaceSchema } from "../validators/schema.validator.js";

import {
  createMaintenance,
  getMaintenances,
  updateMaintenance,
  deleteMaintenance,
} from "../controllers/maintenance.controller.js";

const router = express.Router();


router.post("/", verifyToken, validate(maintenanceSchema),createMaintenance);
router.get("/", verifyToken, getMaintenances);
router.patch("/:maintenanceId", verifyToken, validate(updateMaintenaceSchema), updateMaintenance);
router.delete("/:maintenanceId",verifyToken, deleteMaintenance);

export default router;
