import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { validate } from "../middlewares/validate.middleware.js";
import { categorySchema } from "../validators/schema.validator.js";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.post("/", verifyToken, validate(categorySchema), createCategory);
router.get("/", verifyToken, getCategories);
router.patch("/:categoryId", verifyToken, validate(categorySchema), updateCategory);
router.delete("/:categoryId", verifyToken, deleteCategory);

export default router;