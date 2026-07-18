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
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const gymAccess = await getGymAccess(userId, {
      minimumRole: "STAFF",
    });

    if (!gymAccess) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const { gymId } = gymAccess;

    const categories = await prisma.category.findMany({
      where: {
        gymId,
      },
      orderBy: [
        {
          isDefault: "desc",
        },
        {
          name: "asc",
        },
      ],
    });

    return res.status(200).json({
      categories,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized"})
    }
    
    const gymAccess = await getGymAccess(userId, {
      minimumRole: "STAFF",
    });

    if (!gymAccess) {
      return res.status(403).json({ message: "Access denied"})
    }

    const { gymId } = gymAccess;

    const { categoryId } = req.params;
    const { name } = req.body;

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        gymId,
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: {
         gymId_name: {
           gymId,
           name
         },
      }, 
    });

    if (existingCategory && existingCategory.id !== category.id) {
      return res.status(409).json({ messsage: "Category already exists"});
    }

    const updateCategory = await prisma.category.update({
      where: {
         id: category.id,
      }, 
      data: {
         name,
      },
    });

    return res.status(200).json({ 
      message: "Category updated successfully",
      category: updateCategory,
    })
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
     const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const gymAccess = await getGymAccess(userId, {
      minimumRole: "STAFF",
    });

    if (!gymAccess) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const { gymId } = gymAccess;

    const { categoryId } = req.params;

    const category = await prisma.category.findFirst({
      where: {
        id: categoryId,
        gymId,
      },
      include: {
        equipments: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    
    if (category.isDefault) {
      return res.status(400).json({
        message: "Default categories cannot be deleted",
      });
    }

   
    if (category.equipments.length > 0) {
      return res.status(400).json({
        message: "Cannot delete category because it contains equipment",
      });
    }

    await prisma.category.delete({
      where: {
        id: category.id,
      },
    });

    return res.status(200).json({
      message: "Category deleted successfully",
    });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};