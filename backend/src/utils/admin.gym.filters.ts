import { Prisma } from "@prisma/client";

interface AdminGymFilterParams {
    search?: string;
    city?: string;
    status?: string;
}

export const buildAdminGymFilters = ({
    search,
    city,
    status,
}: AdminGymFilterParams): Prisma.GymWhereInput => {
    const where: Prisma.GymWhereInput = {};

    if (search) {
      where.OR = [
        {
            gymName: {
             contains: search,
             mode: "insensitive", 
          },
        },
        {
            city: {
              contains: search,
              mode: "insensitive"
          },
        },
      ];
    }

    if (city) {
    where.city = {
      equals: city,
      mode: "insensitive",
    };
  }

    if (status === "active") {
    where.isActive = true;
  }

    if (status === "inactive") {
    where.isActive = false;
  }

  return where;
}