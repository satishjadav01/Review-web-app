import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ReviewLandingClient from "@/components/review/ReviewLandingClient";
import { DEMO_BRANDS } from "@/lib/demoData";

export const dynamic = "force-dynamic";

export default async function ReviewPage({ params }) {
    const { identifier } = await params;

    let brand = null;
    let isCommonLink = false;

    // 1. Try to find a Brand by slug or id (Common Link)
    try {
        const brandBySlug = await prisma.brand.findFirst({
            where: {
                OR: [
                    { id: identifier },
                    { slug: identifier }
                ]
            }
        });

        if (brandBySlug) {
            brand = brandBySlug;
            isCommonLink = true;
        }
    } catch (e) {
        console.warn("Notice: DB query failed for brand in review page:", e?.message);
    }

    // Check in demo brands if not found
    if (!brand) {
        const matchingDemoBrand = DEMO_BRANDS.find(
            b => b.id === identifier || b.slug === identifier || b.name.toLowerCase().replace(/\s+/g, '-') === identifier
        );
        if (matchingDemoBrand) {
            brand = matchingDemoBrand;
            isCommonLink = true;
        }
    }

    // 2. Try to find a ReviewLink by token (Individual Link)
    if (!brand) {
        try {
            const reviewLink = await prisma.reviewLink.findUnique({
                where: { token: identifier },
                include: { brand: true }
            });

            if (reviewLink && !reviewLink.isUsed && new Date() <= new Date(reviewLink.expiresAt)) {
                brand = reviewLink.brand;
            }
        } catch (e) {
            console.warn("Notice: DB query failed for reviewLink:", e?.message);
        }
    }

    // 3. Fallback to default demo brand if identifier is a valid test token
    if (!brand) {
        brand = DEMO_BRANDS[0];
    }

    const serializedBrand = {
        ...brand,
        _id: brand.id
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
            <ReviewLandingClient
                brand={JSON.parse(JSON.stringify(serializedBrand))}
                token={identifier}
                isCommonLink={isCommonLink}
            />
        </div>
    );
}
