import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { getGymAccess } from "../utils/gymAccess.js";

export const createCategory = async ( req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const gymAccess = await getGymAccess(userId, {
      minimumRole: "STAFF"
    });

    if (!gymAccess) {
      return res.status(403).json({ message: "Access denied" })
    };

    const { gymId } = gymAccess;

    const { name } = req.body;

    // Category name must be unique within the gym
    const existingCategory = await prisma.category.findUnique({
       where: {
        gymId_name: {
          gymId,
          name,
        },
      },
    });

    if (existingCategory) {
      return res.status(409).json({ message: "Category already exists"})
    }

    const category = await prisma.category.create({
        data: {
          name,
          gymId
        },
    });

    return res.status(201).json({ message: "Category created successfully", category })

  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};