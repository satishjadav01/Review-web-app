import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const session = await auth();

        // Only super_admin can create brands
        if (!session || session.user.role !== "super_admin") {
            console.log(`[SuperAdmin] Unauthorized brand creation attempt by: ${session?.user?.email || "Guest"}`);
            return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
        }

        const {
            brandName,
            googlePlaceId,
            logoUrl,
            managerName,
            managerEmail,
            managerPassword,
            websiteType,
            shopifyStoreUrl,
            shopifyAccessToken
        } = await req.json();

        if (!brandName || !googlePlaceId || !managerName || !managerEmail || !managerPassword || !websiteType) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (websiteType === "shopify" && (!shopifyStoreUrl || !shopifyAccessToken)) {
            return NextResponse.json({ error: "Shopify credentials required" }, { status: 400 });
        }

        // 1. Check if manager email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: managerEmail }
        });
        if (existingUser) {
            return NextResponse.json({ error: "Manager email already in use" }, { status: 400 });
        }

        // 2. Create Brand and Manager User in transaction
        const hashedPassword = await bcrypt.hash(managerPassword, 10);
        const result = await prisma.$transaction(async (tx) => {
            const brand = await tx.brand.create({
                data: {
                    name: brandName,
                    googlePlaceId,
                    logoUrl,
                    slug: brandName.toLowerCase().replace(/\s+/g, '-'),
                    websiteType,
                    shopifyStoreUrl: websiteType === 'shopify' ? shopifyStoreUrl : null,
                    shopifyAccessToken: websiteType === 'shopify' ? shopifyAccessToken : null,
                    isActive: true
                }
            });

            const manager = await tx.user.create({
                data: {
                    name: managerName,
                    email: managerEmail,
                    password: hashedPassword,
                    role: "brand_admin",
                    brandId: brand.id
                }
            });

            return { brand, manager };
        });

        console.log(`[SuperAdmin] New brand created: ${brandName} | Manager: ${managerEmail}`);

        return NextResponse.json({
            success: true,
            brand: result.brand,
            manager: { id: result.manager.id, email: result.manager.email }
        }, { status: 201 });

    } catch (error) {
        console.error("Create Brand API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "super_admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const brands = await prisma.brand.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
                websiteType: true,
                isActive: true,
                createdAt: true,
                users: {
                    where: { role: "brand_admin" },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        brandId: true
                    },
                    take: 1
                }
            },
            orderBy: { createdAt: "desc" }
        });

        const enrichedBrands = brands.map(brand => {
            const { users, ...brandData } = brand;
            return {
                ...brandData,
                _id: brand.id,
                manager: users[0] || null
            };
        });

        return NextResponse.json({ brands: enrichedBrands });
    } catch (error) {
        console.error("Get Brands API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
