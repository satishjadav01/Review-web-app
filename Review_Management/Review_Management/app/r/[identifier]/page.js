import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ReviewLandingClient from "@/components/review/ReviewLandingClient";

export const dynamic = "force-dynamic";

export default async function ReviewPage({ params }) {
    const { identifier } = await params;

    // 1. Try to find a Brand by slug or id (Common Link)
    const brandBySlug = await prisma.brand.findFirst({
        where: {
            OR: [
                { id: identifier },
                { slug: identifier }
            ]
        }
    });

    if (brandBySlug) {
        const serializedBrand = {
            ...brandBySlug,
            _id: brandBySlug.id
        };
        return (
            <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
                <ReviewLandingClient
                    brand={JSON.parse(JSON.stringify(serializedBrand))}
                    token={brandBySlug.id}
                    isCommonLink={true}
                />
            </div>
        );
    }

    // 2. Try to find a ReviewLink by token (Individual Link)
    const reviewLink = await prisma.reviewLink.findUnique({
        where: { token: identifier },
        include: { brand: true }
    });

    if (!reviewLink || reviewLink.isUsed || new Date() > new Date(reviewLink.expiresAt)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-6 text-center">
                <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">
                    <h1 className="text-2xl font-bold text-zinc-900 mb-2">Link Expired or Invalid</h1>
                    <p className="text-zinc-600">This review link is no longer valid or has already been used. Thank you for your interest!</p>
                </div>
            </div>
        );
    }

    const brand = {
        ...reviewLink.brand,
        _id: reviewLink.brand.id
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
            <ReviewLandingClient
                brand={JSON.parse(JSON.stringify(brand))}
                token={identifier}
            />
        </div>
    );
}
