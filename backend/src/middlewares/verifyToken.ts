import { Request, Response, NextFunction} from "express";
import { verifyJwt } from "../utils/jwtToken.js";
import { prisma } from "../lib/prisma.js";

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
     
    const token = req.cookies?.accessToken;

    console.log("COOKIES:", req.cookies);

    if (!token) {
        return res.status(401).json({ message: "Unautorized" })
    }


try {

    const decoded = verifyJwt(token) as { userId: string };
    console.log("DECODED JWT:", decoded);


    const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, isActive: true},
    });

    if (!user) {
        return res.status(401).json({ message: "Invalid or expired token" })
    }

    if (!user.isActive) {
        res.clearCookie("accessToken", { path: "/" });
        return res.status(403).json({ message: "Account is deactivated" });
    }
 
    req.user =  { userId: decoded.userId };
    next()
   } catch (error) {

    return res.status(401).json({ message: "Invalid or expired token" })
    
  }

}