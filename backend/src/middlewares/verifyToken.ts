import { Request, Response, NextFunction} from "express";
import { verifyJwt } from "../utils/jwtToken.js";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
     
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ message: "Unautorized" })
    }


try {

    const decoded = verifyJwt(token);

    req.user = decoded;

    next()
   } catch (error) {

    return res.status(401).json({ message: "Invalid or expired token" })
    
  }

}