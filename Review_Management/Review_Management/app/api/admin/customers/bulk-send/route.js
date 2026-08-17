import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { processAndSendReviewLink } from "@/lib/sendReviewLink";

export async function POST(req) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { customers } = await req.json();

        if (!Array.isArray(customers) || customers.length === 0) {
            return NextResponse.json({ error: "No customers selected" }, { status: 400 });
        }

        const results = {
            success: 0,
            failed: 0,
            details: []
        };

        for (const c of customers) {
            try {
                // Determine target brand ID
                const targetBrandId = c.brandId?.toString() || session.user.brandId;
                if (!targetBrandId) {
                    throw new Error("Brand ID is missing for this customer");
                }

                // Privacy/Security check
                if (session.user.role !== "super_admin" && targetBrandId !== session.user.brandId) {
                    throw new Error("Unauthorized: Access denied for this brand");
                }

                // Use the shared utility to process and SEND
                const sendResult = await processAndSendReviewLink({
                    brandId: targetBrandId,
                    orderId: c.orderId || "MANUAL",
                    phone: c.phone,
                    email: c.email,
                    name: c.name
                });

                if (sendResult.sent) {
                    results.success++;
                } else {
                    throw new Error(sendResult.waError || sendResult.emailError || "Failed to send");
                }
            } catch (err) {
                console.error(`Bulk task failed for ${c.phone || c.email}:`, err.message);
                results.failed++;
                results.details.push({
                    identifier: c.phone || c.email || "Unknown",
                    error: err.message
                });
            }
        }

        return NextResponse.json({
            success: true,
            summary: results
        });

    } catch (error) {
        console.error("Critical Bulk API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
