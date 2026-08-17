import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import BrandSelector from "../customers/BrandSelector";
import ReviewsClient from "./ReviewsClient";
import { Download, MessageSquare } from "lucide-react";

async function getReviewsData(brandId, role, requestedBrandId, page = 1, pageSize = 50, search = "") {
    try {
        const activeBrandId = (role === "super_admin" && requestedBrandId)
            ? requestedBrandId
            : brandId;

        // Fetch all brands if super admin (for the selector)
        let allBrands = [];
        if (role === "super_admin") {
            const rawBrands = await prisma.brand.findMany({
                select: { id: true, name: true, logoUrl: true, websiteType: true },
                orderBy: { name: "asc" }
            });
            allBrands = rawBrands.map(b => ({ ...b, _id: b.id }));
        }

        let whereClause = {};
        if (role === "super_admin") {
            if (activeBrandId) whereClause.brandId = activeBrandId;
        } else {
            if (brandId) whereClause.brandId = brandId;
        }

        if (search.trim()) {
            const query = search.trim();
            whereClause = {
                AND: [whereClause],
                OR: [
                    { feedback: { contains: query, mode: "insensitive" } },
                    { orderId: { contains: query, mode: "insensitive" } },
                    { customer: { is: { name: { contains: query, mode: "insensitive" } } } },
                    { customer: { is: { phone: { contains: query, mode: "insensitive" } } } },
                    { customer: { is: { email: { contains: query, mode: "insensitive" } } } },
                ],
            };
        }

        const [totalCount, rawReviews] = await Promise.all([
          prisma.review.count({ where: whereClause }),
          prisma.review.findMany({
            where: whereClause,
            include: {
                customer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        orderId: true
                    }
                }
            },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
          }),
        ]);

        // Find active brand name
        let activeBrandName = "Global Feedback";
        if (activeBrandId) {
            const b = await prisma.brand.findUnique({
                where: { id: activeBrandId },
                select: { name: true }
            });
            activeBrandName = b?.name || "Global Feedback";
        } else if (role !== "super_admin" && brandId) {
            const b = await prisma.brand.findUnique({
                where: { id: brandId },
                select: { name: true }
            });
            activeBrandName = b?.name || "My Store";
        }

        const reviews = rawReviews.map(r => ({
            ...r,
            _id: r.id,
            customerId: r.customer ? { ...r.customer, _id: r.customer.id } : null,
            customerInfo: r.customer ? { ...r.customer, _id: r.customer.id } : { phone: "Private User", orderId: r.orderId || "N/A" }
        }));

        return {
            reviews: JSON.parse(JSON.stringify(reviews)),
            allBrands,
            activeBrandId,
            activeBrandName,
            pagination: { page, pageSize, totalCount },
        };
    } catch (err) {
        console.error("Error fetching reviews:", err);
        return { reviews: [], allBrands: [], activeBrandId: null, activeBrandName: "Error" };
    }
}

export default async function ReviewsPage({ searchParams }) {
    const session = await auth();
    const resolvedParams = await searchParams;

    if (!session) return null;

    const page = Math.max(1, Number.parseInt(resolvedParams.page || "1", 10) || 1);
    const search = resolvedParams.search || "";
    const { reviews, allBrands, activeBrandId, activeBrandName, pagination } = await getReviewsData(
        session.user.brandId,
        session.user.role,
        resolvedParams.bid,
        page,
        50,
        search,
    );

    return (
        <div className="space-y-8 max-w-[1600px] mx-auto">
            {/* Premium Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-2">
                        <MessageSquare size={14} className="text-zinc-900" />
                        Reputation Management
                    </div>
                    <h1 className="text-4xl font-black text-zinc-900 tracking-tight leading-none">
                        Customer <span className="text-zinc-400 font-light">Feedback</span>
                    </h1>
                    <div className="flex items-center gap-3 text-[11px] font-bold text-zinc-400 uppercase tracking-widest pt-2">
                        <span className="text-zinc-900">{activeBrandName}</span>
                        <span className="w-1 h-1 bg-zinc-200 rounded-full"></span>
                        <span>{pagination?.totalCount || 0} total submissions</span>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4">
                    {session.user.role === "super_admin" && (
                        <BrandSelector brands={allBrands} currentBrandId={activeBrandId} />
                    )}
                    <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-zinc-200 text-zinc-900 rounded-2xl text-sm font-black hover:bg-zinc-50 transition-all shadow-sm active:scale-95 group">
                        <Download size={18} className="text-zinc-400 group-hover:text-zinc-900" />
                        Export Data
                    </button>
                </div>
            </div>

            <ReviewsClient
                initialReviews={reviews}
                initialSearch={search}
                pagination={pagination}
                brandId={resolvedParams.bid || ""}
            />
        </div>
    );
}
