import prisma from "./lib/prisma.js";

async function testUpdate() {
  try {
    console.log("Using Prisma client");

    const brandId = "6997e9020e0c6e271be20fea"; // legacy ID — may not exist in Postgres
    const updateData = {
      smtpHost: "smtp.test.com",
      smtpPort: "587",
      smtpUser: "user@test.com",
      smtpPass: "pass123",
      useSMTP: true,
    };

    const updated = await prisma.brand.update({
      where: { id: brandId },
      data: updateData,
    });

    console.log("Updated Brand:", {
      name: updated.name,
      smtpHost: updated.smtpHost,
      smtpUser: updated.smtpUser,
      useSMTP: updated.useSMTP,
    });
  } catch (err) {
    console.error("Update failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

testUpdate();
