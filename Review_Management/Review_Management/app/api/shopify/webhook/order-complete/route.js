import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateToken } from "@/lib/utils";

export async function POST(req) {
    try {
        const payload = await req.json();

        // Shopify order payloads vary, but usually contain customer and billing/shipping info
        const phone = payload.customer?.phone || payload.shipping_address?.phone || payload.billing_address?.phone;
        const orderId = payload.id?.toString() || payload.order_number?.toString();

        // We need a way to identify which brand this webhook belongs to
        // Typically verified by a header or an API key in the URL
        const shopDomain = req.headers.get('x-shopify-shop-domain');

        if (!phone) {
            return NextResponse.json({ message: "No phone number found in order" }, { status: 200 });
        }

        const shopName = shopDomain?.split('.')[0] || '';
        const brand = await prisma.brand.findFirst({
            where: {
                name: {
                    contains: shopName,
                    mode: 'insensitive'
                }
            }
        });

        if (!brand) {
            return NextResponse.json({ error: "Brand not found" }, { status: 404 });
        }

        // Create or update customer
        let customer = await prisma.customer.findFirst({
            where: { phone, brandId: brand.id }
        });

        if (!customer) {
            customer = await prisma.customer.create({
                data: {
                    brandId: brand.id,
                    phone,
                    orderId,
                }
            });
        }

        // Generate Review Link
        const token = generateToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

        const reviewLink = await prisma.reviewLink.create({
            data: {
                brandId: brand.id,
                customerId: customer.id,
                orderId,
                token,
                expiresAt,
            }
        });

        const linkUrl = `${process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL}/r/${token}`;

        // Mock WhatsApp Send
        console.log(`[WhatsApp Mock] Sending to ${phone}: Hi! How was your order #${orderId}? Rate us here: ${linkUrl}`);

        return NextResponse.json({ success: true, link: linkUrl }, { status: 201 });
    } catch (error) {
        console.error("Shopify Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
