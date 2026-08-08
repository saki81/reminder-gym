import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const isPlatformAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
   try {
     const userId = req.user?.userId;

     if (!userId) {
        return res.status(401).json({ message: "Unauthorized"});
     }

     const user = await prisma.user.findUnique({
        where: {
            id: userId,
        }, 
        select: {
            id: true,
            isActive: true,
            admins: {
                where: {
                    role: "ADMIN",
                    gymId: null,
                },
                select: {
                    id: true,
                    role: true,
                    gymId: true,
                },
            },
        },
     });
    
      if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "User account is inactive",
      });
    }

    if (user.admins.length === 0) {
      return res.status(403).json({
        message: "Forbidden. Platform admin access required.",
      });
    }

    next();
   } catch (error) {
       console.error("isPlatformAdmin error:", error);

    return res.status(500).json({
       message: "Internal server error",
   });
  }
}