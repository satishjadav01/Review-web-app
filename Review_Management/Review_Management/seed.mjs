import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const prisma = new PrismaClient();

async function seed() {
    try {
        console.log("Seeding PostgreSQL database via Prisma...");

        await prisma.user.deleteMany({});
        await prisma.brand.deleteMany({});

        const brand = await prisma.brand.create({
            data: {
                name: "Zinc Lifestyle",
                slug: "zinc-lifestyle",
                logoUrl: "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200&h=200&fit=crop",
                googlePlaceId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
                websiteType: "shopify",
            }
        });

        const hashedSuperPassword = await bcrypt.hash("admin123", 10);
        await prisma.user.create({
            data: {
                name: "Super Admin",
                email: "super@admin.com",
                password: hashedSuperPassword,
                role: "super_admin",
            }
        });

        const hashedBrandPassword = await bcrypt.hash("brand123", 10);
        await prisma.user.create({
            data: {
                name: "Brand Manager",
                email: "manager@brand.com",
                password: hashedBrandPassword,
                role: "brand_admin",
                brandId: brand.id,
            }
        });

        console.log("Seeding complete!");
        console.log("Super Admin: super@admin.com / admin123");
        console.log("Brand Admin: manager@brand.com / brand123");

        await prisma.$disconnect();
        process.exit(0);
    } catch (err) {
        console.error("Seeding error:", err.message);
        await prisma.$disconnect();
        process.exit(1);
    }
}

seed();
