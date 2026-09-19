const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ select: { username: true } });
  console.log('Users in DB:', users.map(u => u.username));
}

main().finally(() => prisma.$disconnect());
