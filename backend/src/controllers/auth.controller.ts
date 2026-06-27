import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { prisma } from "../lib/prisma.js";
import { signToken } from "../utils/jwtToken.js";
import { hashToken } from "../utils/hashToken.js";
import  transporter  from "../config/nodemailer.js"



export const register = async (req:Request, res:Response) => {

         const { email, password, name } = req.body;

  try {

         const existingUser = await prisma.user.findUnique ({
          where: { email }
         })

         if (existingUser) {
          return res.status(400).json({ message: "User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
          data: {
            email,
            password: hashedPassword,
            name,
         }
      })
        // generate jwt
        const token = signToken({
        userId: user.id
      })

    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // delete old otp tokens
    await prisma.emailVerificationToken.deleteMany({
        where: { userId: user.id }
    });
    
    // generate 6-digit number
    const otp = Math.floor( 100000 + Math.random() * 900000).toString();

    // hash otp
    const hashedOtp = hashToken(otp);

    // expires in 10 minutes
    const expiresAt = new Date(Date.now() + 1000 * 60 * 10);
    
    // save OTP
    await prisma.emailVerificationToken.create({
        data: {
            token: hashedOtp,
            userId: user.id,
            expiresAt
        }
    });

     // send verification email
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Verify your email",
      text: `Your verification code is: ${otp}`
    });

   return  res.json({ message: "User created" });
   
 } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error"})
 }
}

export const login = async (req:Request, res:Response) => {

       const { email, password } = req.body;

  try {

       const user = await prisma.user.findUnique({
        where: { email }
     });

    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" })
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = signToken({
        userId: user.id
    })

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false,/*process.env.NODE_ENV === "production",*/
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
   
      res.json({ message: "Login successful"})

    } catch (error) {
      return res.status(500).json({message: "Server error"})   
  }
     
}

export const logout = async (req:Request, res:Response) => {
     
    res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === "production"
    })

   return res.json({ message: "Logged out" })
}

// send OTP
export const sendVerifyOtp = async (req:Request, res:Response) => {

        const userId = req.user?.userId;

    try {
        if (!req.user?.userId) {
            return res.status(401).json({ message: "Unauthorized" });
}

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.emailVerified) {
            return res.status(400).json({ message: "Email alraedy verified" })
        }

        // delete old tokens
        await prisma.emailVerificationToken.deleteMany({
            where: { userId: user.id }
        });

        // generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const hashedToken = hashToken(otp);

        const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

        await prisma.emailVerificationToken.create({
            data: {
                token: hashedToken,
                userId: user.id,
                expiresAt
            }
        });

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Email verification",
            text: `Your verification code is: ${otp}`
        });

        return res.json({ message: "Verification OTP sent"})
        
    } catch (error) {
       return res.status(500).json(error)
    }  
}

// user enters OTP
export const verifyEmail = async (req:Request, res:Response) => {

      const { otp } = req.body;

      const userId = req.user?.userId;

      const hashedToken = hashToken(otp);

   try {
     
      const token = await prisma.emailVerificationToken.findUnique({
        where: { token: hashedToken }
      });

      if (!token) {
        return res.status(400).json({ message: "Invalid verification code" });
      }

      if (token.expiresAt < new Date()) {
        return res.status(400).json({ message: "Verification code expired" });
      }

      if (token.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized verification"});
      }

      await prisma.user.update({
        where: { id: userId },
        data: {
            emailVerified: true,
            emailVerifiedAt: new Date()
        }
      });

      await prisma.emailVerificationToken.delete({
        where: { token: hashedToken }
      });

      return res.json({ message: "Email successfully verified"})

   } catch (error) {
       return res.status(500).json({ message: "Server error" });
   }
};

export const verifyResetOtp = async (req: Request, res: Response) => {
  const { otp } = req.body;

  try {
    const hashedOtp = hashToken(otp);

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: hashedOtp }
    });

    if (!resetToken) {
      return res.status(400).json({ message: "Invalid code" });
    }

    if (resetToken.expiresAt < new Date()) {
      return res.status(400).json({ message: "Code expired" });
    }

    
    await prisma.passwordResetToken.delete({
      where: { token: hashedOtp }
    });

    
    const resetSessionToken = crypto.randomUUID();

    const hashedSessionToken = hashToken(resetSessionToken)

    await prisma.passwordResetSession.create({
      data: {
        token: hashedSessionToken,
        userId: resetToken.userId,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
      }
    });

    return res.json({
      success: true,
      resetToken: resetSessionToken
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req:Request, res:Response) => {
    
    const { token, password } = req.body;

    try {
        
        const hashedToken = hashToken(token);

        console.log("INPUT TOKEN:", token);
        console.log("HASHED TOKEN:", hashToken(token));

        const resetToken = await prisma.passwordResetSession.findUnique({
            where: { token: hashedToken }
        });

        console.log("FOUND SESSION:", resetToken);

        if (!resetToken) {
            return res.status(400).json({ message: "Invalid or expired token" })
        }

        if (resetToken.expiresAt < new Date()) {
            return res.status(400).json({ message:"Token expired" })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: resetToken.userId},
            data: {
                password: hashedPassword
            }
        });

        await prisma.passwordResetSession.delete({
            where: { token: hashedToken }
        });

        return res.json({ message: "Password successfully reset" })

    } catch (error) {
              
        return res.status(500).json({
          message: "Server error"
       });
    }
}

export const forgotPassword = async (req:Request, res:Response) => {
    
    const { email } = req.body;

    try {

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.json({message: "If the email exists a reset code has been sent" });
        }

        // delete old tokens
        await prisma.passwordResetToken.deleteMany({
            where: { userId: user.id }
        });

         // generate 6-digit otp
         const otp = Math.floor(
            100000 + Math.random() * 900000
         ).toString();

        //hash token
        
        const hashedToken = hashToken(otp);

        // expiration 10 min
        const expiresAt = new Date( Date.now() + 1000 * 60 * 10 );
        
        // save token
        await prisma.passwordResetToken.create({
            data: {
                token: hashedToken,
                userId: user.id,
                expiresAt
            }
        });
        
         // send email
         await transporter.sendMail({
           from: process.env.SENDER_EMAIL,
           to: user.email,
           subject: "Password Reset Code",
           text: `Your password reset code is: ${otp}`
        });
        

        return res.json({ message: "If the email exists, a reset code has been sent"});
        
    } catch (error) {

        return res.json({ message: "Server error"})
    }
}

export const getMe = async (req: Request, res: Response) => {
      
    const userId = req.user?.userId;

    if (!userId) {
          return res.status(401).json({ message: "Unauthorized - no userId" });
}

    try {
        
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                activeGym: true,
                admins: true
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found"})
        }

        const { password, ...safeUser } = user;

         const activeAdmin = user.admins.find(
          (a) => a.gymId === user.activeGymId
           ) ?? user.admins[0];

    return res.json({
      user: {
        ...safeUser,
        role: activeAdmin?.role ?? "STAFF", // ← ovo fali
      },
    });

       
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}