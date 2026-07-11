import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

interface GymAccessOptions {
    minimumRole?: "STAFF" | "OWNER";
}


export const getGymAccess = async ( userId: string, options: GymAccessOptions = {}) => {
   
    const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      activeGymId: true,
    },
  });

  if (!user?.activeGymId) {
    return null;
  }

  const gymId = user.activeGymId;

  const gymCondition: Prisma.AdminWhereInput = options.minimumRole === "OWNER"
          ? {
              gymId,
              role: "OWNER",
            }
          : {
              gymId,
            };

  const admin = await prisma.admin.findFirst({
    where: {
      userId,
      OR: [
        {
          role: "ADMIN",
          gymId: null,
        },
         gymCondition,
      ],
    },
  });

  if (!admin) {
    return null;
  }

  return {
    gymId,
    admin,
  };
}