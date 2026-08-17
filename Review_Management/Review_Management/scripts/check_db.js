const { PrismaClient } = require('@prisma/client');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function checkBrands() {
    try {
        if (!process.env.DATABASE_URL) {
            console.error("DATABASE_URL is missing in .env");
            process.exit(1);
        }

        console.log("Connected to PostgreSQL via Prisma.");

        const brands = await prisma.brand.findMany();
        console.log(`Found ${brands.length} brands.`);

        brands.forEach(brand => {
            console.log("---------------------------------------------------");
            console.log(`Brand: ${brand.name} (ID: ${brand.id})`);
            console.log(`Type: ${brand.websiteType}`);
            console.log(`Store URL: '${brand.shopifyStoreUrl}'`);
            console.log(`Access Token: '${brand.shopifyAccessToken ? brand.shopifyAccessToken.substring(0, 10) + '...' : 'MISSING'}'`);
            console.log("---------------------------------------------------");
        });

        await prisma.$disconnect();
    } catch (error) {
        console.error("Error:", error);
        await prisma.$disconnect();
    }
}

checkBrands();
