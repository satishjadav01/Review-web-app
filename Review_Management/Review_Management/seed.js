import bcrypt from "bcryptjs";
import prisma from "./lib/prisma.js";

async function seed() {
  console.log("Seeding PostgreSQL via Prisma...");

  // Clean existing data
  await prisma.reviewLink.deleteMany();
  await prisma.review.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();
  await prisma.brand.deleteMany();

  const brand = await prisma.brand.create({
    data: {
      name: "Zinc Lifestyle",
      logoUrl:
        "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200&h=200&fit=crop",
      googlePlaceId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
      websiteType: "shopify",
    },
  });

  const hashedSuperPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      name: "Super Admin",
      email: "super@admin.com",
      password: hashedSuperPassword,
      role: "super_admin",
    },
  });

  const hashedBrandPassword = await bcrypt.hash("brand123", 10);
  await prisma.user.create({
    data: {
      name: "Brand Manager",
      email: "manager@brand.com",
      password: hashedBrandPassword,
      role: "brand_admin",
      brandId: brand.id,
    },
  });

  console.log("Seeding complete!");
  console.log("Super Admin: super@admin.com / admin123");
  console.log("Brand Admin: manager@brand.com / brand123");

  await prisma.$disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
