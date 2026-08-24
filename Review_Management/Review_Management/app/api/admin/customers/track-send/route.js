import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
        const { orderId, brandId, method, customerId } = await req.json();

        if (!brandId || !method || (!orderId && !customerId)) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const updateData = {};
        if (method === "whatsapp") updateData.whatsappSent = true;
        if (method === "email") updateData.emailSent = true;

        const whereCondition = { brandId };
        if (customerId) {
            whereCondition.customerId = customerId;
        } else if (orderId) {
            whereCondition.orderId = orderId;
        } else {
            return NextResponse.json({ error: "Invalid ID configuration" }, { status: 400 });
        }

        let doc = null;
        try {
            const existingLink = await prisma.reviewLink.findFirst({
                where: whereCondition
            });

            if (existingLink) {
                doc = await prisma.reviewLink.update({
                    where: { id: existingLink.id },
                    data: updateData
                });
            }
        } catch (dbErr) {
            console.warn("Notice: Could not update reviewLink in DB:", dbErr?.message);
        }

        return NextResponse.json({ success: true, doc: doc ? { ...doc, _id: doc.id } : { ...updateData, orderId } });
    } catch (error) {
        console.warn("Track Send Warning:", error?.message);
        return NextResponse.json({ success: true });
    }
}
