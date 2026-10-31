import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";


export const isOwner = async (req: Request, res: Response, next: NextFunction) => {
        
      try {
         const userId = req.user?.userId;

         if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
         }

         const ownerAccess = await prisma.admin.findFirst({
             where: {
                userId,
                role: "OWNER",
                isActive: true,
                gymId: { not: null },
             },
             select: { id: true },
         });

         if (!ownerAccess) {
            return res.status(403).json({ message: "Forbiden. Owner access required"});
         }

         next();
      } catch (error) {
        console.error("isOwner error:", error);
 
        return res.status(500).json({ message: "Server error" });

      }
}