import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { buildAdminUserFilters } from "../utils/admin.user.filters.js";
import { prisma } from "../lib/prisma.js";


export const getDashboard = async (req: Request, res: Response) => {};

export const getUsers = async (req: Request, res: Response) => {
    try {
       const page = Math.max(Number(req.query.page) || 1, 1);
       const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 50);

       const skip = (page - 1) * limit;

       // filters
       const search = req.query.search?.toString().trim();
       const status = req.query.status?.toString().trim();
       const role = req.query.role?.toString().trim(); 
       const gymId = req.query.gymId?.toString().trim();

       const where = buildAdminUserFilters({
          search,
          status,
          role,
          gymId,
       });

       const [users, total] = await Promise.all([
          prisma.user.findMany({
             where,

             skip,
             take: limit,

             orderBy: {
                createdAt: "desc",
             },

             select: {
               id: true,
               email: true,
               name: true,
               isActive: true,
               emailVerified: true,
               activeGymId: true,
               createdAt: true,
               updatedAt: true,

               admins: {
                select: {
                id: true,
                role: true,
                gymId: true,

                gym: {
                 select: {
                 id: true,
                 gymName: true,
                 city: true,
                },
              },
            },
          },
        },
      }),

      prisma.user.count({
         where,
      }),
     ]);

     const  totalPages = Math.ceil(total / limit);

     return res.status(200).json({
        users,

        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1,
        }
     })
    } catch (error) {
       console.error("getUsers error:", error);
       
       return res.status(500).json({ message: "Internal server error" });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
 
       const { id } = req.params;

       if (!id) {
         return res.status(400).json({
         message: "User ID is required",
      });
    }

        const user = await prisma.user.findUnique({
          where: {
          id,
         },

          select: {
           id: true,
           email: true,
           name: true,
           isActive: true,
           emailVerified: true,
           emailVerifiedAt: true,
           activeGymId: true,
           createdAt: true,
           updatedAt: true,

             admins: {
              select: {
              id: true,
              role: true,
              gymId: true,

              gym: {
               select: {
                id: true,
                gymName: true,
                city: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });

        
    } catch (error) {
       console.error("getUserById error:", error);

       return res.status(500).json({
         message: "Internal server error",
      });  
    }
};

export const updateUser = async (req: Request, res: Response) => {};

export const activateUser = async (req: Request, res: Response) => {};

export const deactivateUser = async (req: Request, res: Response) => {};

export const deleteUser = async (req: Request, res: Response) => {};

export const getGyms = async (req: Request, res: Response) => {};

export const getGymById = async (req: Request, res: Response) => {};

export const createGym = async (req: Request, res: Response) => {};

export const updateGym = async (req: Request, res: Response) => {};

export const activateGym = async (req: Request, res: Response) => {};

export const deactivateGym = async (req: Request, res:Response) => {};

export const deleteGym = async (req: Request, res: Response) => {};