import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

interface GymAccessOptions {
    minimumRole?: "STAFF" | "OWNER";

    requestedGymId?: string
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getGymAccess = async ( userId: string, options: GymAccessOptions = {}) => {
   
    const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      activeGymId: true,
      isActive: true,
    },
  });

  if (!user?.isActive ) {
    return null;
  }

  const gymId = options.requestedGymId || user.activeGymId;

  if (!gymId || !UUID_REGEX.test(gymId)) {
        return null;
    }


  const gym = await prisma.gym.findUnique({
      where: {
       id: gymId,
      },
      select: {
     //  id: true,
       isActive: true,
    },
  });

    if (!gym?.isActive) {
     return null;
   }

   // Deaktivirani radnik (Admin.isActive = false) nema pristup
  const membershipCondition: Prisma.AdminWhereInput = options.minimumRole === "OWNER"
          ? {
              gymId,
              role: "OWNER",
              isActive: true,
            }
          : {
              gymId,
              isActive: true,
            };

  const accessCondition: Prisma.AdminWhereInput[] = [membershipCondition];

      if (gymId === user.activeGymId) {
        accessCondition.push({
            role: "ADMIN",
            gymId: null,
        });
    }


  const admin = await prisma.admin.findFirst({
        where: {
            userId,
            OR: accessCondition,
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