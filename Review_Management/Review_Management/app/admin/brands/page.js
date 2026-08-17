import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { Plus, ShoppingBag, Globe, MessageSquare } from "lucide-react";
import BrandActions from "./BrandActions";

async function getBrands() {
    return await prisma.brand.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            websiteType: true,
            createdAt: true
        },
        orderBy: { createdAt: "desc" }
    });
}

export default async function BrandsPage() {
    const session = await auth();

    if (session.user.role !== "super_admin") {
        redirect("/admin");
    }

    const brands = await getBrands();

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900">Brands</h1>
                    <p className="text-zinc-500">Manage all registered brands and their settings</p>
                </div>
                <Link
                    href="/admin/super"
                    className="px-6 py-3 bg-zinc-900 text-white font-bold rounded-xl hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg shadow-zinc-200"
                >
                    <Plus size={20} />
                    Add Brand
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brands.map((brand) => (
                    <div key={brand.id} className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                {brand.logoUrl ? (
                                    <img src={brand.logoUrl} alt={brand.name} className="h-12 w-auto" />
                                ) : (
                                    <div className="h-12 w-12 bg-zinc-100 rounded-2xl flex items-center justify-center text-zinc-900 font-bold text-xl">
                                        {brand.name[0]}
                                    </div>
                                )}
                                <BrandActions brandId={brand.id} brandName={brand.name} />
                            </div>

                            <h3 className="text-xl font-bold text-zinc-900 mb-1">{brand.name}</h3>
                            <p className="text-sm text-zinc-500 mb-6 flex items-center gap-1.5 uppercase tracking-wider font-semibold">
                                <ShoppingBag size={14} />
                                {brand.websiteType}
                            </p>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Reviews</p>
                                    <p className="font-bold text-zinc-900">--</p>
                                </div>
                                <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                                    <p className="text-[10px] text-zinc-400 font-bold uppercase mb-1">Clicks</p>
                                    <p className="font-bold text-zinc-900">--</p>
                                </div>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Globe size={16} className="text-zinc-400" />
                                <MessageSquare size={16} className="text-zinc-400" />
                            </div>
                            <Link
                                href={`/admin/settings?bid=${brand.id}`}
                                className="text-sm font-bold text-zinc-900 hover:underline"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}

                <Link
                    href="/admin/super"
                    className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-3xl p-6 flex flex-col items-center justify-center text-zinc-400 hover:border-zinc-300 hover:text-zinc-500 transition-all min-h-[300px]"
                >
                    <div className="w-12 h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center mb-3">
                        <Plus size={24} />
                    </div>
                    <p className="font-semibold">Create New Brand</p>
                </Link>
            </div>
        </div>
    );
}
