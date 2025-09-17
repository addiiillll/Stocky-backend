const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe'
    }
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      name: 'Jane Smith'
    }
  });

  // Create sample stocks
  const stocks = [
    { symbol: 'RELIANCE', name: 'Reliance Industries Limited' },
    { symbol: 'TCS', name: 'Tata Consultancy Services' },
    { symbol: 'INFOSYS', name: 'Infosys Limited' },
    { symbol: 'HDFC', name: 'HDFC Bank Limited' },
    { symbol: 'ICICIBANK', name: 'ICICI Bank Limited' }
  ];

  for (const stock of stocks) {
    await prisma.stock.upsert({
      where: { symbol: stock.symbol },
      update: {},
      create: stock
    });
  }

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });