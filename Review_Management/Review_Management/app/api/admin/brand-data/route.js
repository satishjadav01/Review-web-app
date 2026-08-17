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

        let targetBrandId = session.user.brandId;

        // If super admin and a specific brand is requested, use it
        if (session.user.role === "super_admin" && bid) {
            targetBrandId = bid;
        }

        if (!targetBrandId) {
            return NextResponse.json({ error: "No brand ID provided" }, { status: 400 });
        }

        const brand = await prisma.brand.findUnique({
            where: { id: targetBrandId }
        });

        if (!brand) {
            return NextResponse.json({ error: "Brand not found" }, { status: 404 });
        }

        return NextResponse.json({ brand: { ...brand, _id: brand.id } });
    } catch (error) {
        console.error("GET Brand Data Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const { bid } = data;

        let targetBrandId = session.user.brandId;
        if (session.user.role === "super_admin" && bid) {
            targetBrandId = bid;
        }

        if (!targetBrandId) {
            return NextResponse.json({ error: "No brand ID provided" }, { status: 400 });
        }

        console.log("💾 [API] Saving brand data for:", data.name, "Target ID:", targetBrandId);

        const updateObject = {};
        const fieldsToUpdate = [
            'name', 'googlePlaceId', 'logoUrl', 'primaryColor', 'reviewMessageTemplate',
            'whatsappPhoneNumber', 'whatsappPhoneNumberId', 'whatsappSenderId', 'whatsappApiKey',
            'whatsappTemplateName', 'whatsappTemplateLanguage', 'shopifyStoreUrl', 'shopifyAccessToken',
            'resendApiKey', 'brandEmail', 'smtpHost', 'smtpPort', 'smtpUser', 'smtpPass', 'useSMTP',
            'isActive', 'shareCategories', 'localizedWhatsappDrafts'
        ];

        fieldsToUpdate.forEach(field => {
            if (data[field] !== undefined) {
                updateObject[field] = data[field];
            }
        });

        const brand = await prisma.brand.update({
            where: { id: targetBrandId },
            data: updateObject
        });

        return NextResponse.json({ success: true, brand: { ...brand, _id: brand.id } });
    } catch (error) {
        console.error("POST Brand Data Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
