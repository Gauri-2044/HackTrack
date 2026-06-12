import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();

async function test() {
  const users = await Prisma.user.findMany();
  console.log(users);
}

test()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });