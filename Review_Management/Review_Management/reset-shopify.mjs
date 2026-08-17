import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
    console.log("Connecting to PostgreSQL...");
    console.log("Fixing bad Shopify configurations...");

    const result = await prisma.brand.updateMany({
        where: {
            shopifyStoreUrl: { contains: '@' }
        },
        data: {
            shopifyStoreUrl: "",
            shopifyAccessToken: "",
            websiteType: "other"
        }
    });

    console.log(`Updated ${result.count} brands.`);
    await prisma.$disconnect();
    process.exit(0);
}

run();
