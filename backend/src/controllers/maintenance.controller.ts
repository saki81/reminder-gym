import { Request, Response } from "express";
import { buildMaintenanceFilters } from "../utils/maintenanceFilters.js";
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

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 50);

    const skip = (page - 1) * limit;

    const search = req.query.search?.toString().trim();
    const status = req.query.status?.toString();
    const equipmentId = req.query.equipmentId?.toString();
    const categoryId = req.query.categoryId?.toString();

  
    const where = buildMaintenanceFilters({
       gymId,
       search,
       status,
       equipmentId,
       categoryId,
     });

    const [maintenances, total] = await Promise.all([
      prisma.maintenance.findMany({

        where,

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
        where,     
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

    const { maintenanceId } = req.params;

    const maintenance = await prisma.maintenance.findFirst({
      where: {
        id: maintenanceId,
        gymId,
      },
    });

    if (!maintenance) {
      return res.status(404).json({
        message: "Maintenance not found",
      });
    }

    const {
      title,
      description,
      cost,
      status,
      performedAt,
      nextDueDate,
      equipmentId,
    } = req.body;

    if (equipmentId) {
      const equipment = await prisma.equipment.findFirst({
        where: {
          id: equipmentId,
          gymId,
        },
      });

      if (!equipment) {
        return res.status(404).json({
          message: "Equipment not found",
        });
      }
    }

    const updatedMaintenance = await prisma.maintenance.update({
      where: {
        id: maintenanceId,
      },
      data: {
        title,
        description,
        cost,
        status,
        performedAt,
        nextDueDate,
        equipmentId,
      },
      include: {
        equipment: {
          select: {
            id: true,
            name: true,
            inventoryNumber: true,
          },
        },
      },
    });

    return res.status(200).json({
      message: "Maintenance updated successfully",
      maintenance: updatedMaintenance,
    });
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