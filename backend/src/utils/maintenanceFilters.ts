import {
  MaintenanceStatus,
  Prisma,
} from "@prisma/client";

interface MaintenanceFilters {
  gymId: string;
  search?: string;
  status?: string;
  equipmentId?: string;
  categoryId?: string;
}

export const buildMaintenanceFilters = ({
  gymId,
  search,
  status,
  equipmentId,
  categoryId,
}: MaintenanceFilters): Prisma.MaintenanceWhereInput => {
  const where: Prisma.MaintenanceWhereInput = {
    gymId,
  };

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },

      {
        equipment: {
          is: {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },

      {
        equipment: {
          is: {
            inventoryNumber: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      },
    ];
  }

  if (status) {
    where.status = status as MaintenanceStatus;
  }

  if (equipmentId) {
    where.equipmentId = equipmentId;
  }

  if (categoryId) {
    where.equipment = {
      is: {
        categoryId,
      },
    };
  }

  return where;
};