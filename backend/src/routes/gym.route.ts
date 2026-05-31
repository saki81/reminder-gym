import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { gymSchema } from "../validators/schema.validator.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createGym,getMyGyms,switchGym,updateGym,deleteGym} from "../controllers/gym.controller.js";

const router = express.Router();

router.post("/", verifyToken, validate(gymSchema), createGym);
router.get("/my-gyms", verifyToken, getMyGyms);
router.patch("/switch", verifyToken,switchGym);
router.patch("/:gymId",verifyToken,validate(gymSchema), updateGym);
router.delete("/:gymId",verifyToken, deleteGym)


export default router
