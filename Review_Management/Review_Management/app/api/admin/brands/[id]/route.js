import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function DELETE(req, { params }) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "super_admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
        }

        const brand = await prisma.brand.findUnique({
            where: { id }
        });

        if (!brand) {
            return NextResponse.json({ error: "Brand not found" }, { status: 404 });
        }

        // Cascading delete using Prisma transaction
        await prisma.$transaction([
            prisma.user.deleteMany({ where: { brandId: id } }),
            prisma.reviewLink.deleteMany({ where: { brandId: id } }),
            prisma.review.deleteMany({ where: { brandId: id } }),
            prisma.customer.deleteMany({ where: { brandId: id } }),
            prisma.brand.delete({ where: { id } })
        ]);

        return NextResponse.json({ success: true, message: "Brand and all associated data deleted" });
    } catch (error) {
        console.error("DELETE Brand Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "super_admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { id } = await params;
        const data = await req.json();

        // 1. Update Brand
        const updateData = {
            name: data.brandName,
            googlePlaceId: data.googlePlaceId,
            logoUrl: data.logoUrl,
            websiteType: data.websiteType,
            shopifyStoreUrl: data.shopifyStoreUrl,
            shopifyAccessToken: data.shopifyAccessToken,
        };

        const updatedBrand = await prisma.brand.update({
            where: { id },
            data: updateData
        });

        if (!updatedBrand) {
            return NextResponse.json({ error: "Brand not found" }, { status: 404 });
        }

        // 2. Update Manager
        if (data.managerEmail) {
            const managerUpdate = {
                name: data.managerName,
                email: data.managerEmail,
            };

            if (data.managerPassword && data.managerPassword.trim() !== "") {
                managerUpdate.password = await bcrypt.hash(data.managerPassword, 10);
            }

            const existingManager = await prisma.user.findFirst({
                where: { brandId: id, role: "brand_admin" }
            });

            if (existingManager) {
                await prisma.user.update({
                    where: { id: existingManager.id },
                    data: managerUpdate
                });
            }
        }

        return NextResponse.json({ success: true, brand: updatedBrand });
    } catch (error) {
        console.error("PATCH Brand Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
