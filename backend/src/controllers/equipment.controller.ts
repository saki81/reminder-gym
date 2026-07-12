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
       try {

           const userId = req.user?.userId;

           if (!userId) {
               return res.status(401).json({ message: "Unauthorized" });
           }

           const gymAccess = await getGymAccess(userId, {
               minimumRole: "STAFF"
           });

           if (!gymAccess) {
               return res.status(403).json({ message: "Access denied" });
           }

           const { gymId } = gymAccess;
           const { equipmentId } = req.params;

           const equipment = await prisma.equipment.findFirst({
               where: {
                   id: equipmentId,
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
               }
           });

           if (!equipment) {
            return res.status(404).json({ message: "Equipment not found" });
           }

           return res.status(200).json({ equipment });
        
       } catch (error: any) {
           return res.status(500).json({ message: error.message})
       }
};

export const updateEquipment = async (req:Request, res:Response) => {
      try {
          
         const userId = req.user?.userId;

         if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
         }

         const gymAccess = await getGymAccess(userId, {
            minimumRole: "STAFF"
         });

         if (!gymAccess) {
            return res.status(403).json({ message: "Access denied" });
         };

         const { gymId } = gymAccess;
         const { equipmentId } = req.params;

         const existingEquipment = await prisma.equipment.findFirst({
            where: {
                id: equipmentId,
                gymId
            }
         });
         
          if (!existingEquipment) {
            return res.status(404).json({
                message: "Equipment not found"
            });
        }

        const {
           name,
           brand,
           model,
           inventoryNumber,
           serialNumber,
           serviceIntervalDays,
           categoryId
        } = req.body;

        if (categoryId) {
          
             const category = await prisma.category.findFirst({
                where: {
                    id: categoryId,
                    gymId
                }
            });

            if (!category) {
                return res.status(404).json({
                    message: "Category not found"
                });
            }
        }

        if (inventoryNumber) {

            const equipmentWithInventory = await prisma.equipment.findFirst({
                where: {
                    gymId,
                    inventoryNumber,
                    NOT: {
                        id: equipmentId
                    }
                }
            });

            if (equipmentWithInventory) {
                return res.status(409).json({ message: "inventory number already exists"})
            }
        }

        const equipment = await prisma.equipment.update({

            where: {
               id: equipmentId
            },

            data: {
               name,
               brand,
               model,
               inventoryNumber,
               serialNumber,
               serviceIntervalDays,
               categoryId
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
            }
        });

        return res.status(200).json({ message: "Equipment updated successfully"})

      } catch (error: any) {
        
           return res.status(500).json({ message: error.message });
      }
};

export const deleteEquipment = async (req: Request, res: Response) => {
    try {

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const gymAccess = await getGymAccess(userId, {
            minimumRole: "OWNER"
        });

        if (!gymAccess) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        const { gymId } = gymAccess;
        const { equipmentId } = req.params;

        const equipment = await prisma.equipment.findFirst({
            where: {
                id: equipmentId,
                gymId
            }
        });

        if (!equipment) {
            return res.status(404).json({
                message: "Equipment not found"
            });
        }

        await prisma.equipment.delete({
            where: {
                id: equipmentId
            }
        });

        return res.status(200).json({
            message: "Equipment deleted successfully"
        });

    } catch (error: any) {

        return res.status(500).json({
            message: error.message
        });

    }
};
