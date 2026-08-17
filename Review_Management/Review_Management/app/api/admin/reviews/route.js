import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(req) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const bid = searchParams.get("bid");
        const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
        const pageSize = Math.min(100, Math.max(1, Number.parseInt(searchParams.get("pageSize") || "50", 10) || 50));

        let whereClause = {};

        if (session.user.role === "super_admin") {
            if (bid) {
                whereClause.brandId = bid;
            }
        } else {
            if (!session.user.brandId) {
                return NextResponse.json({ error: "No brand associated" }, { status: 403 });
            }
            whereClause.brandId = session.user.brandId;
        }

        const [totalCount, reviews] = await Promise.all([
          prisma.review.count({ where: whereClause }),
          prisma.review.findMany({
            where: whereClause,
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        orderId: true
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
          }),
        ]);

        const serializedReviews = reviews.map(r => ({
            ...r,
            _id: r.id,
            customerId: r.customer ? { ...r.customer, _id: r.customer.id } : null,
            customerInfo: r.customer ? { ...r.customer, _id: r.customer.id } : { phone: "Private User", orderId: r.orderId || "N/A" }
        }));

        return NextResponse.json({
            reviews: serializedReviews,
            pagination: { page, pageSize, totalCount },
        });
    } catch (error) {
        console.error("GET Reviews API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
