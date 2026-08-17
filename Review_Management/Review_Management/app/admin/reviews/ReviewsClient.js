"use client";

import { useState } from "react";
import {
    Star, ExternalLink, Calendar, Search, Filter,
    Globe, MessageSquare, Download, CheckCircle2, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import Pagination from "@/components/admin/Pagination";
import { useRouter } from "next/navigation";

export default function ReviewsClient({ initialReviews, initialSearch, pagination, brandId }) {
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const router = useRouter();
    const currentPage = pagination?.page || 1;
    const totalPages = Math.ceil((pagination?.totalCount || 0) / (pagination?.pageSize || 50));
    const currentData = initialReviews;

    const handlePageChange = (page) => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", page);
        router.push(`/admin/reviews?${params.toString()}`);
    };

    return (
        <div className="space-y-8">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-zinc-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
                <form action="/admin/reviews" method="GET" className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search feedback, customers or order IDs..."
                        name="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-100 rounded-xl outline-none focus:bg-white focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all text-sm font-medium"
                    />
                    {brandId && <input type="hidden" name="bid" value={brandId} />}
                    <button type="submit" className="sr-only">Search reviews</button>
                </form>
                <div className="flex items-center gap-2 text-[11px] font-black text-zinc-400 uppercase tracking-widest px-2">
                    {pagination?.totalCount || 0} Matches
                </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {currentData.length === 0 ? (
                    <div className="col-span-full py-24 text-center bg-zinc-50/50 border-2 border-dashed border-zinc-100 rounded-[32px]">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-zinc-100">
                            <MessageSquare className="text-zinc-300" size={32} />
                        </div>
                        <h3 className="text-xl font-black text-zinc-900 mb-1">No feedback found</h3>
                        <p className="text-sm text-zinc-500 max-w-xs mx-auto">Try adjusting your search or switching brands to see more results.</p>
                    </div>
                ) : (
                    currentData.map((review) => (
                        <div key={review._id} className="group bg-white p-6 rounded-[28px] border border-zinc-200 shadow-sm flex flex-col justify-between gap-6 hover:shadow-xl hover:shadow-zinc-200/50 hover:border-zinc-300 transition-all duration-300">
                            <div className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star
                                                key={s}
                                                size={18}
                                                className={cn(
                                                    "transition-all",
                                                    review.rating >= s ? "fill-yellow-400 text-yellow-400" : "fill-zinc-100 text-zinc-100"
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <div className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
                                        review.rating >= 4
                                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                            : "bg-zinc-50 text-zinc-500 border-zinc-200"
                                    )}>
                                        {review.rating >= 4 ? "Live on Google" : "Internal Feedback"}
                                    </div>
                                </div>

                                <div className="relative p-5 bg-zinc-50 rounded-2xl border border-zinc-100 min-h-[100px] group-hover:bg-white transition-colors duration-300">
                                    <div className="absolute top-0 right-4 -translate-y-1/2 bg-white px-2 py-1 rounded-md border border-zinc-100 opacity-0 group-hover:opacity-100 transition-all text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                                        Direct Quote
                                    </div>
                                    {review.feedback ? (
                                        <p className="text-zinc-900 text-base font-medium leading-relaxed italic">
                                            &ldquo;{review.feedback}&rdquo;
                                        </p>
                                    ) : (
                                        <p className="text-zinc-400 text-sm italic py-4">
                                            User shared a rating without written comments.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-black text-sm uppercase ring-4 ring-zinc-50 transition-transform group-hover:scale-110">
                                        {(review.customerInfo?.name?.[0] || "?")}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-black text-zinc-900 truncate">
                                            {review.customerInfo?.name || "Private User"}
                                        </p>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                                            <Calendar size={12} className="text-zinc-300" />
                                            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            <span className="w-1 h-1 bg-zinc-200 rounded-full"></span>
                                            <span className="text-zinc-900 font-black">#{review.orderId || "N/A"}</span>
                                        </div>
                                    </div>
                                </div>

                                {review.rating >= 4 && (
                                    <a
                                        href={review.googleUrl || "#"}
                                        target="_blank"
                                        className="w-10 h-10 flex items-center justify-center bg-zinc-50 text-zinc-400 hover:bg-zinc-900 hover:text-white rounded-xl transition-all shadow-sm active:scale-95"
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
