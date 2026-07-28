import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { getGymAccess } from "../utils/gymAccess.js";

export const createMaintenance = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const gymAccess = await getGymAccess(userId, {
      minimumRole: "STAFF"
    });

    if (!gymAccess) {
      return res.status(403).json({ message: "Access denied"})
    }

    const { gymId } = gymAccess;

    const {
      title,
      description,
      cost,
      status,
      performedAt,
      nextDueDate,
      equipmentId
    } = req.body;

    const equipment = await prisma.equipment.findFirst({
      where: {
         id: equipmentId,
         gymId
      },
    });

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" })
    }

    const maintenance = await prisma.maintenance.create({
      data: {
        title,
        description,
        cost,
        status,
        performedAt,
        nextDueDate,
        equipmentId,

        gymId,
        userId,
      },
      include: {
        equipment: {
          select: {
            id: true,
            name: true,
            inventoryNumber: true
          }
        }
      }
    });

    return res.status(201).json({ 
       message: "Maintenance created successfully",
       maintenance,
      });

  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getMaintenances = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized"});
    }

    const gymAccess = await getGymAccess(userId, {
      minimumRole: "STAFF",
    });

    if (!gymAccess) {
      return res.status(403).json({ message: "Access denied"});
    }

    const { gymId } = gymAccess;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;

    const skip = (page - 1) * limit;

    const [maintenances, total] = await Promise.all([
      prisma.maintenance.findMany({
        where: {
          gymId,
        },
        include: {
          equipment: {
            select: {
              id: true,
              name: true,
              inventoryNumber: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          performedAt: "desc"
        },
        skip,
        take: limit,
      }),

      prisma.maintenance.count({
        where: {
          gymId,
        },
      }),
    ]);

    return res.status(200).json({
       maintenances,
       pagination: {
         total,
         page,
         limit,
         totalPages: Math.ceil(total / limit)
       }
    })

  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const updateMaintenance = async (
  req: Request,
  res: Response
) => {
  try {

  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteMaintenance = async (
  req: Request,
  res: Response
) => {
  try {

  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};