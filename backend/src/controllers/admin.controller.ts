import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { buildAdminUserFilters } from "../utils/admin.user.filters.js";
import { buildAdminGymFilters } from "../utils/admin.gym.filters.js";
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

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({message: "User ID is requred"});
    }
    
    const { name, email, emailVerified } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },

      select: {
        id: true,
        email: true,
      },
    });

    if (!existingUser) {
      return res.status(404).json({message: "User not found"});
    }

    const data: {
      name?: string | null;
      email?: string;
      emailVerified?: boolean;
      emailVerifiedAt?: Date | null;
    } = {};

    if (name !== undefined) {
      data.name = name?.trim() || null;
    }

    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();

      if (!normalizedEmail) {
       return res.status(400).json({message: "Email cannot be empty"})
     }

      if (normalizedEmail !== existingUser.email) {
       const emailExists = await prisma.user.findUnique({
         where: {
           email: normalizedEmail,
         },
         
         select: {
           id: true,
         },
       });

       if (emailExists) {
         return res.status(409).json({ message: "Email is already is use"})
       }

       data.email = normalizedEmail;

       // New email must be verified
       data.emailVerified = false;
       data.emailVerifiedAt = null;
     }
   }
    
   if (emailVerified !== undefined) {
     if (typeof emailVerified !== "boolean") {
       return res.status(400).json({ message: "emailVerified must be boolean"});
     }

     data.emailVerified = emailVerified;

     data.emailVerifiedAt = emailVerified ? new Date() : null;
   }

     if (Object.keys(data).length === 0) {
      return res.status(400).json({
        message: "No data to update",
      });
    }

     const updatedUser = await prisma.user.update({
      where: {
        id,
      },

      data,

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
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });


    
  } catch (error) {
       console.error("updateUser error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const activateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({message: "User id is required"})
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        isActive: true,
      },
    });

    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    if (user.isActive) {
      return res.status(400).json({message: "User is already active"});
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        emailVerified: true,
      },
    });

    return res.status(200).json({
      message: "User activated successfully",
      user: updatedUser,
    });



  } catch (error) {
       console.error("activateUser error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deactivateUser = async (req: Request,res: Response) => {
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
        isActive: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found",});
    }

    if (!user.isActive) {
      return res.status(400).json({ message: "User is already inactive", });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        emailVerified: true,
      },
    });

    return res.status(200).json({
      message: "User deactivated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("deactivateUser error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({message: "User ID is required",})
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
      },
    });

    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

     await prisma.user.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      message: "User deleted successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
      console.error("deleteUser error:", error);

      return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getGyms = async (req: Request, res: Response) => {
  try {
       const page = Math.max(Number(req.query.page) || 1,1);

       const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 50);

       const skip = (page - 1) * limit;


       const search = req.query.search?.toString().trim();
       const city = req.query.city?.toString().trim();
       const status = req.query.status?.toString();

       const where = buildAdminGymFilters({
        search,
        city,
        status,
       });

       const [gyms, total] = await Promise.all([
      
      prisma.gym.findMany({
        where,

        skip,
        take: limit,

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          gymName: true,
          city: true,
          isActive: true,
          createdAt: true,

          _count: {
            select: {
              admins: true,
              equipments: true,
              categories: true,
              maintenances: true,
            },
          },
        },
      }),

       prisma.gym.count({
        where,
      }),
    ]);

     const totalPages = Math.ceil(total / limit);

      return res.status(200).json({
        gyms,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      });


  } catch (error) {
      console.error("getGyms error:", error);

      return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const getGymById = async (req: Request, res: Response) => {};

export const createGym = async (req: Request, res: Response) => {};

export const updateGym = async (req: Request, res: Response) => {};

export const activateGym = async (req: Request, res: Response) => {};

export const deactivateGym = async (req: Request, res:Response) => {};

export const deleteGym = async (req: Request, res: Response) => {};