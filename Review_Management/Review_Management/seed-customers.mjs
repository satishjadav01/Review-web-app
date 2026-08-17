import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { generateToken } from './lib/utils.js';

const prisma = new PrismaClient();

async function run() {
    console.log("Connecting to PostgreSQL...");

    const brand = await prisma.brand.findFirst({ where: { name: "Zinc Lifestyle" } });
    if (!brand) {
        console.error("Brand 'Zinc Lifestyle' not found! Please run seed.mjs first.");
        process.exit(1);
    }
    console.log("Found brand:", brand.name, brand.id);

    await prisma.reviewLink.deleteMany({ where: { brandId: brand.id } });
    await prisma.customer.deleteMany({ where: { brandId: brand.id } });
    console.log("Cleared existing test customers and links for this brand.");

    const testCustomers = [
        { name: "Alice Smith", email: "alice@example.com", phone: "919876543210", orderId: "ORD-1001" },
        { name: "Bob Johnson", email: "bob@example.com", phone: "919876543211", orderId: "ORD-1002" },
        { name: "Charlie Davis", email: "charlie@example.com", phone: "919876543212", orderId: "ORD-1003" },
        { name: "Diana Prince", email: "diana@example.com", phone: "919876543213", orderId: "ORD-1004" },
        { name: "Ethan Hunt", email: "ethan@example.com", phone: "919876543214", orderId: "ORD-1005" }
    ];

    for (const [index, c] of testCustomers.entries()) {
        const customer = await prisma.customer.create({
            data: {
                brandId: brand.id,
                name: c.name,
                email: c.email,
                phone: c.phone,
                orderId: c.orderId,
            }
        });
        console.log(`Created customer: ${customer.name}`);

        if (index < 3) {
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30);

            await prisma.reviewLink.create({
                data: {
                    brandId: brand.id,
                    customerId: customer.id,
                    orderId: c.orderId,
                    token: generateToken ? generateToken() : Math.random().toString(36).substring(2, 12),
                    expiresAt: expiresAt,
                    whatsappSent: index === 0,
                    emailSent: index === 1,
                    isUsed: false
                }
            });
            console.log(`Created ReviewLink for ${customer.name}`);
        }
    }

    console.log("Seeding customers complete!");
    await prisma.$disconnect();
    process.exit(0);
}

run();
