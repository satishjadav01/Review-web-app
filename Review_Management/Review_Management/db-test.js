import prisma from "./lib/prisma.js";

(async () => {
  const idToCheck = "699932a39a0cec4f1fcfc9cf"; // legacy Mongo ID — may not exist in Postgres
  const cust = await prisma.customer.findUnique({ where: { id: idToCheck } });
  console.log("Found customer phone:", cust ? cust.phone : "Not found");
  await prisma.$disconnect();
  process.exit(0);
})();
