import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
        const { token, rating, feedback, isPublic } = await req.json();

        if (!token || !rating) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        let brandId = null;
        let customerId = null;
        let orderId = null;

        // 1. Try finding brand by ID or Slug (Public review link case)
        const brand = await prisma.brand.findFirst({
            where: {
                OR: [
                    { id: token },
                    { slug: token }
                ]
            }
        });

        if (brand) {
            brandId = brand.id;
        } else {
            // 2. Individual customer token case
            const reviewLink = await prisma.reviewLink.findUnique({
                where: { token }
            });

            if (!reviewLink || reviewLink.isUsed || new Date() > new Date(reviewLink.expiresAt)) {
                return NextResponse.json({ error: "Invalid or expired link" }, { status: 400 });
            }

            brandId = reviewLink.brandId;
            customerId = reviewLink.customerId;
            orderId = reviewLink.orderId;

            // Mark link as used
            await prisma.reviewLink.update({
                where: { id: reviewLink.id },
                data: { isUsed: true }
            });
        }

        // Create review
        const review = await prisma.review.create({
            data: {
                brandId,
                customerId,
                orderId,
                rating: Number(rating),
                feedback,
                isPublic: Boolean(isPublic),
            }
        });

        return NextResponse.json({ success: true, reviewId: review.id }, { status: 201 });
    } catch (error) {
        console.error("Review submission error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
