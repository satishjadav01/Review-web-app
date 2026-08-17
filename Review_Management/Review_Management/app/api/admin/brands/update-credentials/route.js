import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        console.log("----------------------------------------------------------------");
        console.log("[CREDENTIAL UPDATE DEBUG]");
        console.log("User:", session.user.email, "| Role:", session.user.role, "| BrandID:", session.user.brandId);
        console.log("Request Body:", JSON.stringify(body, null, 2));

        const { shopifyStoreUrl, shopifyAccessToken, brandId } = body;

        if (!shopifyStoreUrl || !shopifyAccessToken || !brandId) {
            console.log("[ERROR] Missing required fields in request.");
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        // Verify ownership
        if (session.user.role !== "super_admin" && session.user.brandId !== brandId) {
            console.log("[ERROR] Unauthorized access. Session BrandID mismatch.");
            return NextResponse.json({ error: "Unauthorized access to this brand" }, { status: 403 });
        }

        console.log(`[ACTION] Updating Brand ${brandId}...`);

        const brandDoc = await prisma.brand.findUnique({
            where: { id: brandId }
        });
        if (!brandDoc) {
            console.log("[ERROR] Brand not found in DB.");
            return NextResponse.json({ error: "Brand not found" }, { status: 404 });
        }

        console.log(`[PRE-UPDATE] Current URL: ${brandDoc.shopifyStoreUrl}`);

        const updatedBrand = await prisma.brand.update({
            where: { id: brandId },
            data: {
                shopifyStoreUrl: shopifyStoreUrl,
                shopifyAccessToken: shopifyAccessToken,
                websiteType: 'shopify'
            }
        });

        console.log(`[POST-UPDATE] Updated Brand:`, {
            id: updatedBrand.id,
            url: updatedBrand.shopifyStoreUrl,
            hasToken: !!updatedBrand.shopifyAccessToken,
            tokenLength: updatedBrand.shopifyAccessToken?.length
        });

        return NextResponse.json({ success: true, brand: { ...updatedBrand, _id: updatedBrand.id } });

    } catch (error) {
        console.error("Update Credentials Error:", error);
        return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 });
    }
}
