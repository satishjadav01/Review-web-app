import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import SharePageClient from "@/components/share/SharePageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
    const { slug } = await params;

    const brand = await prisma.brand.findFirst({
        where: {
            OR: [
                { id: slug },
                { slug }
            ]
        },
        select: { name: true }
    });

    if (!brand) return { title: "Brand Not Found" };

    return {
        title: `Share Review Link - ${brand.name}`,
        description: `Help others by sharing the review link for ${brand.name}`,
    };
}

export default async function SharePage({ params }) {
    const { slug } = await params;

    const brand = await prisma.brand.findFirst({
        where: {
            OR: [
                { id: slug },
                { slug }
            ]
        },
        select: {
            id: true,
            name: true,
            logoUrl: true,
            primaryColor: true,
            shareCategories: true,
            reviewMessageTemplate: true,
            localizedWhatsappDrafts: true
        }
    });

    if (!brand) {
        notFound();
    }

    // Prepare the brand data for the client component
    const serializedBrand = {
        id: brand.id,
        name: brand.name,
        logoUrl: brand.logoUrl,
        primaryColor: brand.primaryColor || "#A22C29",
        slug: slug,
        reviewMessageTemplate: brand.reviewMessageTemplate,
        localizedWhatsappDrafts: brand.localizedWhatsappDrafts || { en: '', hi: '', gu: '' },
        shareCategories: brand.shareCategories || []
    };

    return (
        <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-0 md:p-6">
            <SharePageClient brand={serializedBrand} />

            {/* SEO & Footer */}
            <div className="mt-12 text-center">
                <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Powered by Review</p>
                <div className="flex items-center gap-4 text-zinc-300">
                    <div className="h-[1px] w-8 bg-zinc-200" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Secure Sharing</span>
                    <div className="h-[1px] w-8 bg-zinc-200" />
                </div>
            </div>
        </div>
    );
}
