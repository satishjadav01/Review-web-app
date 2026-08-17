import { NextResponse } from "next/server";
import { processAndSendReviewLink } from "@/lib/sendReviewLink";

// ── Main POST Route Handler ─────────────────────────────────────────────────
export async function POST(req) {
    try {
        const body = await req.json();
        const { brandId, phone, email, orderId, name, preferredMethod } = body;

        if (!brandId || !orderId || (!phone && !email)) {
            return NextResponse.json(
                { error: "Missing required fields: brandId, orderId, and at least one contact (phone or email)" },
                { status: 400 }
            );
        }

        const result = await processAndSendReviewLink({
            brandId,
            orderId,
            phone,
            email,
            name,
            preferredMethod
        });

        return NextResponse.json(result, { status: result.sent ? 201 : 200 });

    } catch (error) {
        console.error("Send Review Link API Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
