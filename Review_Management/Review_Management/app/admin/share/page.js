import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SharePageClient from "./SharePageClient";
import BrandSelector from "../customers/BrandSelector";

export default async function AdminSharePage({ searchParams }) {
    const session = await auth();
    if (!session) redirect("/login");

    const bid = (await searchParams).bid;
    let targetBrandId = session.user.brandId;

    if (session.user.role === "super_admin" && bid) {
        targetBrandId = bid;
    }

    if (!targetBrandId && session.user.role !== "super_admin") {
        return (
            <div className="p-8 text-center bg-white rounded-3xl border border-zinc-200 shadow-sm max-w-lg mx-auto mt-12">
                <h3 className="text-xl font-bold text-zinc-900 mb-2">No Brand Assigned</h3>
                <p className="text-zinc-500 text-sm">Please contact an administrator to assign your account to a brand.</p>
            </div>
        );
    }

    // Fetch all brands if super admin (for the selector)
    let allBrands = [];
    if (session.user.role === "super_admin") {
        const rawBrands = await prisma.brand.findMany({
            select: { id: true, name: true, logoUrl: true, websiteType: true },
            orderBy: { name: "asc" }
        });
        allBrands = rawBrands.map(b => ({ ...b, _id: b.id }));
    }

    // Find brand to get slug and name
    const brand = targetBrandId ? await prisma.brand.findUnique({
        where: { id: targetBrandId },
        select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            reviewMessageTemplate: true,
            primaryColor: true,
            shareCategories: true,
            localizedWhatsappDrafts: true
        }
    }) : null;

    if (!brand && targetBrandId) {
        return (
            <div className="p-8 text-center bg-white rounded-3xl border border-zinc-200 shadow-sm max-w-lg mx-auto mt-12">
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Brand Not Found</h3>
                <p className="text-zinc-500 text-sm">We couldn't find the data for the requested brand.</p>
            </div>
        );
    }

    const serializedBrand = brand ? {
        id: brand.id,
        name: brand.name,
        slug: brand.slug,
        logoUrl: brand.logoUrl,
        primaryColor: brand.primaryColor || "#A22C29",
        reviewMessageTemplate: brand.reviewMessageTemplate,
        localizedWhatsappDrafts: brand.localizedWhatsappDrafts || { en: '', hi: '', gu: '' },
        shareCategories: brand.shareCategories || []
    } : null;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Public Share Page</h1>
                    <p className="text-sm text-zinc-500">Access and share your brand's public review link via WhatsApp.</p>
                </div>
                {session.user.role === "super_admin" && (
                    <BrandSelector brands={allBrands} currentBrandId={targetBrandId} />
                )}
            </div>

            <SharePageClient brand={serializedBrand} />
        </div>
    );
}
