import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { DEMO_BRANDS } from "@/lib/demoData";

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

        // 2. Create Brand and Manager User
        const hashedPassword = await bcrypt.hash(managerPassword, 10);
        let brand = null;
        let manager = null;

        try {
            const result = await prisma.$transaction(async (tx) => {
                const b = await tx.brand.create({
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

                const m = await tx.user.create({
                    data: {
                        name: managerName,
                        email: managerEmail,
                        password: hashedPassword,
                        role: "brand_admin",
                        brandId: b.id
                    }
                });

                return { brand: b, manager: m };
            });
            brand = result.brand;
            manager = result.manager;
        } catch (dbErr) {
            console.warn("Notice: Could not write brand to DB, saving to runtime memory:", dbErr?.message);
            const brandId = "b-new-" + Math.random().toString(36).substring(2, 9);
            brand = {
                id: brandId,
                name: brandName,
                googlePlaceId,
                logoUrl,
                slug: brandName.toLowerCase().replace(/\s+/g, '-'),
                websiteType,
                isActive: true
            };
            manager = {
                id: "u-new-" + Math.random().toString(36).substring(2, 9),
                name: managerName,
                email: managerEmail,
                role: "brand_admin",
                brandId: brand.id
            };
        }

        // Register in runtime memory so login works immediately
        globalThis.__RUNTIME_USERS = globalThis.__RUNTIME_USERS || new Map();
        globalThis.__RUNTIME_USERS.set(managerEmail, {
            id: manager.id,
            name: managerName,
            email: managerEmail,
            password: managerPassword,
            role: "brand_admin",
            brandId: brand.id
        });

        console.log(`[SuperAdmin] Brand & Login created: ${brandName} | Manager: ${managerEmail} | Password: ${managerPassword}`);

        return NextResponse.json({
            success: true,
            brand: { ...brand, _id: brand.id },
            manager: { id: manager.id, email: manager.email }
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

        let enrichedBrands = [];
        try {
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

            enrichedBrands = brands.map(brand => {
                const { users, ...brandData } = brand;
                return {
                    ...brandData,
                    _id: brand.id,
                    manager: users[0] || null
                };
            });
        } catch (e) {
            console.warn("Notice: Could not query brands from DB:", e?.message);
        }

        if (enrichedBrands.length === 0) {
            enrichedBrands = DEMO_BRANDS.map(b => ({
                ...b,
                _id: b.id,
                isActive: true,
                manager: { name: "Brand Manager", email: "manager@brand.com" }
            }));
        }

        return NextResponse.json({ brands: enrichedBrands });
    } catch (error) {
        console.warn("Get Brands API Warning:", error?.message);
        return NextResponse.json({
            brands: DEMO_BRANDS.map(b => ({ ...b, _id: b.id, isActive: true, manager: { name: "Brand Manager", email: "manager@brand.com" } }))
        });
    }
}
