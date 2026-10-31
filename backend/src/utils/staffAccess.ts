import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";


// Teretane čiji je korisnik OWNER.
// onlyActive = true -> samo aktivne teretane (za pozivanje i izmjenu pristupa radnika)
export const getOwnedGyms = async (userId: string, onlyActive = false) => {
    const rows = await prisma.admin.findMany({
        where: {
            userId,
            role: "OWNER",
            isActive: true,
            gymId: { not: null },
            ...(onlyActive ? { gym: { isActive: true } } : {}),
        },
        select: {
            gym: {
                select: { id: true, gymName: true, city: true, isActive: true },
            },
        },
    });
 
    return rows.flatMap((row) => (row.gym ? [row.gym] : []));
};


export const syncActiveGym = async (db: Prisma.TransactionClient, userId: string) => {
    const user = await db.user.findUnique({
        where: { id: userId },
        select: { activeGymId: true },
    });
 
    if (!user) {
        return;
    }
 
    if (user.activeGymId) {
        const stillHasAccess = await db.admin.findFirst({
            where: { userId, gymId: user.activeGymId, isActive: true },
            select: { id: true },
        });
 
        if (stillHasAccess) {
            return;
        }
    }
 
    const nextAccess = await db.admin.findFirst({
        where: {
            userId,
            isActive: true,
            gymId: { not: null },
            gym: { isActive: true },
        },
        orderBy: { createdAt: "asc" },
        select: { gymId: true },
    });
 
    await db.user.update({
        where: { id: userId },
        data: { activeGymId: nextAccess?.gymId ?? null },
    });
};
