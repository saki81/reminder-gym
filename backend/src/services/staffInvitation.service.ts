import { prisma } from "../lib/prisma.js";
import { hashToken } from "../utils/hashToken.js";
import { generateOtp } from "../utils/crypto.js";
import transporter from "../config/nodemailer.js";

export const createAndSendVerificationOtp = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      email: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Delete previous OTP
  await prisma.emailVerificationToken.deleteMany({
    where: {
      userId: user.id,
    },
  });

  // Generate 6-digit OTP
  const otp = generateOtp();

  // Hash OTP
  const hashedOtp = hashToken(otp);

  // OTP expires in 10 minutes
  const expiresAt = new Date(
    Date.now() + 1000 * 60 * 10
  );

  // Save OTP
  await prisma.emailVerificationToken.create({
    data: {
      token: hashedOtp,
      userId: user.id,
      expiresAt,
    },
  });

  // Send email
  await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to: user.email,
    subject: "Verify your email",

    text: ` Your verification code is: ${otp}
            This code expires in 10 minutes.`,
  });
};