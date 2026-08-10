import { Prisma, AdminRole } from "@prisma/client";

interface AdminUserFilterParams {
    search?: string;
    status?: string;
    role?: string;
    gymId?: string;
}

export const buildAdminUserFilters =({
    search,
    status,
    role,
    gymId,
}: AdminUserFilterParams): Prisma.UserWhereInput => {
    const where: Prisma.UserWhereInput = {};

    if (search) {
        where.OR = [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
        ];
    }

    if (status === "active") {
        where.isActive = true;
    }

    if (status === "inactive") {
        where.isActive = false;
    }

    if (role || gymId) {
      where.admins = {
        some: {
          ...(role && {
            role: role as AdminRole,
          }),
          ...(gymId && {
            gymId,
          }),
        },
      };
    }

    return where
}