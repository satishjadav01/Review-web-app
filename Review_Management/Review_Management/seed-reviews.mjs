import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
    console.log("Connecting to PostgreSQL...");

    const brand = await prisma.brand.findFirst({ where: { name: "Zinc Lifestyle" } });
    if (!brand) {
        console.error("Brand 'Zinc Lifestyle' not found!");
        process.exit(1);
    }
    console.log("Found brand:", brand.name, brand.id);

    await prisma.review.deleteMany({ where: { brandId: brand.id } });
    console.log("Cleared existing reviews for this brand.");

    const customers = await prisma.customer.findMany({ where: { brandId: brand.id } });
    if (customers.length === 0) {
        console.error("No dummy customers found. Did you run the customer seeder?");
        process.exit(1);
    }

    const reviewData = [
        { rating: 5, feedback: "Absolutely love the products! Will buy again.", isPublic: true },
        { rating: 4, feedback: "Great quality, but shipping took a little longer than expected.", isPublic: true },
        { rating: 5, feedback: "Excellent customer service and fantastic items.", isPublic: true },
        { rating: 2, feedback: "Not what I expected. The color was different from the photos.", isPublic: false },
        { rating: 5, feedback: "Perfect! Exceeded all expectations.", isPublic: true },
    ];

    let count = 0;
    for (let i = 0; i < Math.min(customers.length, reviewData.length); i++) {
        const customer = customers[i];
        const rData = reviewData[i];

        await prisma.review.create({
            data: {
                brandId: brand.id,
                customerId: customer.id,
                orderId: customer.orderId,
                rating: rData.rating,
                feedback: rData.feedback,
                isPublic: rData.isPublic
            }
        });
        console.log(`Created ${rData.rating}-star review for ${customer.name}`);
        count++;
    }

    const anonymousReviews = [
        { rating: 5, feedback: "So happy with my purchase!", orderId: "ORD-9999" },
        { rating: 5, feedback: "Highly recommended brand.", orderId: "ORD-8888" },
        { rating: 1, feedback: "Never received my item.", orderId: "ORD-7777" }
    ];

    for (const rData of anonymousReviews) {
        await prisma.review.create({
            data: {
                brandId: brand.id,
                rating: rData.rating,
                feedback: rData.feedback,
                orderId: rData.orderId,
                isPublic: false
            }
        });
        console.log(`Created anonymous ${rData.rating}-star review`);
        count++;
    }

    console.log(`Successfully seeded ${count} reviews!`);
    await prisma.$disconnect();
    process.exit(0);
}

run();
