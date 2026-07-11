import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { getGymAccess } from "../utils/gymAccess.js";


export const createEquipment = async (req:Request, res: Response) => {
    try {

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
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

        const {
            name,
            brand,
            model,
            inventoryNumber,
            serialNumber,
            serviceIntervalDays,
            categoryId
        } = req.body;

        // Category must belong to the same gym
        const category = await prisma.category.findFirst({
            where: {
                id: categoryId,
                gymId
            }
        });

        if (!category) {
            return res.status(404).json({ message: "Category not found "});
        }

        // Inventory number unique to gym
        if (inventoryNumber) {

            const existingEquipment  = await prisma.equipment.findFirst({
                where: {
                    gymId,
                    inventoryNumber
                }
            });

            if (existingEquipment) {
                return res.status(409).json({ message: "Inventory number already exists"});
            }
        }

        const equipment = await prisma.equipment.create({
             
            data: {
                name,
                brand,
                model,
                inventoryNumber,
                serialNumber,
                serviceIntervalDays,
                categoryId,

                gymId,
                userId
            },
            
            include: {
                category: true
            }
        });

        return res.status(201).json({ message: "Equipment created successfully", equipment})
        
    } catch (error: any) {
        return res.status(500).json({ message: error.message})
    }
};

export const getEquipments = async (req:Request, res:Response) => {
    try {

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized"})
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

        const equipments = await prisma.equipment.findMany({

            where: {
                gymId
            },

            include: {

                category: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
            _count: {
                    select: {
                        maintenances: true
                    }
                }

            },

            orderBy: {
                createdAt: "desc"
            }

        });

        return res.status(200).json({ equipments });

       
    } catch (error: any) {
        return res.status(500).json({ message: error.message})
    }
};

export const getEquipmentById = async (req:Request, res:Response) => {

};

export const updateEquipment = async (req:Request, res:Response) => {

};

export const deleteEquipment = async (req:Request, res:Response) => {

};