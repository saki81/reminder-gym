import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";


export const createGym = async (req:Request, res:Response) => {
    try {
       
       const userId = req.user?.userId;
       
       if (!userId) {
        return res.status(401).json({message: "Unauthorized"});
       }

       const gym = await prisma.gym.create({
         data: {
            gymName: req.body.gymName,
            city: req.body.city,

            admins: {
                create: {
                    userId,
                    role: "OWNER",
                    isOwner: true
              }
            }
         }
       });

       // set active gym
       await prisma.user.update({
          where: { id: userId },
          data: { activeGymId: gym.id }
       });

       return res.status(201).json({
        message: "Gym created successfully", gym
       })

    } catch (error) {
         return res.status(500).json({
           message: "Server error"
    });
    }
};



export const getMyGyms = async (req:Request, res:Response) => {
    try {
       const userId = req.user?.userId;

       if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
       }

       const gyms = await prisma.admin.findMany({
          where: {
            userId,
            gymId: { not: null }
          },
          include: {
            gym: true
          }
       });

       return res.status(200).json({
          gyms: gyms.map((g) => g.gym)
       })
        
    } catch (error) {
        return res.status(500).json({
           message: "Server error"
        })
    }
};


export const switchGym = async (req:Request, res:Response) => {
    try {
       const userId = req.user?.userId;
       const { gymId } = req.body;


       if (!userId) {
        return res.status(401).json({  message: "Unauthorized" })
       };

       const access = await prisma.admin.findFirst({
          where: {
            userId,
            gymId
          }
       });

       if (!access) {
         return res.status(403).json({ message: "No access to this gym"})
       }

       await prisma.user.update({
           where: { id: userId },
           data: { activeGymId: gymId }
       });

       return res.status(200).json({
          message: "Gym switched successfully"
       })
    } catch (error: any) {
        return res.status(500).json({
          message: error.message
     });
    }
};


export const  updateGym = async(req:Request, res:Response) => {
    try {
        const userId = req.user?.userId;
        const gymId = req.params.gymId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Owner or Global Admin
        const access = await prisma.admin.findFirst({
            where: {
              userId,
              OR: [
                {
                  gymId,
                  role: "OWNER"
                },
                {
                  role: "ADMIN",
                  gymId: null
                }
              ]
            },
        })

        if (!access) {
            return res.status(403).json({ message: "Not allowed "});
        };

        const gym = await prisma.gym.update({
            where: { id: gymId },
            data: req.body
        });

        return res.status(200).json({
            message: "Gym updated successfully", gym
        })
    } catch (error: any) {
        return res.status(500).json({
           message: error.message
    });
    }
}


export const deleteGym = async (req:Request, res:Response) => {
    try {
    const userId = req.user?.userId;
    const gymId = req.params.gymId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    // OWNER ili GLOBAL ADMIN
    const access = await prisma.admin.findFirst({
      where: {
        userId,
        OR: [
          {
            gymId,
            role: "OWNER"
          },
          {
            role: "ADMIN",
            gymId: null
          }
        ]
      }
    });

    if (!access) {
      return res.status(403).json({
        message: "You cannot delete this gym"
      });
    }

    await prisma.gym.delete({
      where: { id: gymId }
    });

    // fix active gym ako je obrisan
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (user?.activeGymId === gymId) {
      const anotherGym = await prisma.admin.findFirst({
        where: {
          userId,
          gymId: { not: gymId }
        }
      });

      await prisma.user.update({
        where: { id: userId },
        data: {
          activeGymId: anotherGym?.gymId || null
        }
      });
    }

    return res.status(200).json({
      message: "Gym deleted successfully"
    });

  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
}