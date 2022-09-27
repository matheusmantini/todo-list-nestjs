// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create two Tasks
  const task1 = await prisma.task.upsert({
    where: { title: "Criar novos endpoins para a API" },
    update: {},
    create: {
      title: "Criar novos endpoins para a API",
      description: "Deserunt aute elit cupidatat aliqua commodo amet quis sint anim consectetur ex et.",
      limit_date: "2022-09-30T00:00:00.000Z",
      creator_user_id: "1ed073fe-280d-4b8d-b9d8-ea95038e0ef7",
    },
  });

  const task2 = await prisma.task.upsert({
    where: { title: "Aprimorar o tempo de resposta da API" },
    update: {},
    create: {
      title: "Aprimorar o tempo de resposta da API",
      description: "Veniam ipsum consequat ipsum proident dolore Lorem qui.",
      limit_date: "2022-09-30T00:00:00.000Z",
      creator_user_id: "1ed073fe-280d-4b8d-b9d8-ea95038e0ef7",
    },
  });

  console.log({ task1, task2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
