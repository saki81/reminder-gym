import "dotenv/config";
import { PrismaClient, AdminRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);

   const gym = await prisma.gym.upsert({
    where: {
      id: "ygym"
    },
    update: {},
    create: {
      id: "ygym",
      gymName: "Maximus",
      city: "Teslic"
    }
  });


  const adminUser = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL! },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL!,
      password,
      name: "Platform Admin",
      emailVerified: true,
      gymId: null,
    },
  });

  await prisma.admin.upsert({
    where: {
      admin_user_gym_unique: {
        userId: adminUser.id,
        gymId: gym.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      role: AdminRole.ADMIN,
      gymId: gym.id,
    },
  });

  const defaultCategories = [
    "Cardio Machines",
    "Strength Machines",
    "Benches",
    "Free Weights",
    "Functional",
  ];

  for (const name of defaultCategories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, gymId: gym.id },
    });
  }

  console.log("📦 Categories seeded");

  console.log("✅ Seed completed");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });