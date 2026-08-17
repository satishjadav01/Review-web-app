import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {
    Star, Users, Send, MousePointer2, ArrowUpRight,
    TrendingUp, MoreHorizontal, LayoutDashboard, Search,
    Activity, ShieldCheck, Zap, Globe
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

async function getStats(brandId, role) {
    try {
        const query = (role === "super_admin" || !brandId) ? {} : { brandId };

        const [
            totalReviews,
            positiveReviews,
            negativeReviews,
            totalCustomers,
            whatsappSent,
            emailSent,
            clicks,
            totalSent
        ] = await Promise.all([
            prisma.review.count({ where: query }),
            prisma.review.count({ where: { ...query, rating: { gte: 4 } } }),
            prisma.review.count({ where: { ...query, rating: { lte: 3 } } }),
            prisma.customer.count({ where: query }),
            prisma.reviewLink.count({ where: { ...query, whatsappSent: true } }),
            prisma.reviewLink.count({ where: { ...query, emailSent: true } }),
            prisma.reviewLink.count({ where: { ...query, isUsed: true } }),
            prisma.reviewLink.count({ where: query })
        ]);

        // Get Brand info if not super admin
        let brandInfo = null;
        if (role !== "super_admin" && brandId) {
            brandInfo = await prisma.brand.findUnique({
                where: { id: brandId },
                select: { name: true, websiteType: true }
            });
        }

        return {
            totalReviews,
            positiveReviews,
            negativeReviews,
            totalCustomers,
            whatsappSent,
            emailSent,
            totalSent,
            clicks,
            brandInfo
        };
    } catch (e) {
        console.error("Error getting stats:", e);
        return { totalReviews: 0, positiveReviews: 0, negativeReviews: 0, totalCustomers: 0, whatsappSent: 0, emailSent: 0, totalSent: 0, clicks: 0, brandInfo: null };
    }
}

export default async function AdminDashboard() {
    const session = await auth();
    const stats = await getStats(session.user.brandId, session.user.role);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#A22C29] mb-2">Command center</p>
                    <h1 className="text-3xl font-bold text-zinc-900 tracking-tight font-display">Overview</h1>
                    <div className="flex items-center gap-2 text-sm text-zinc-500 mt-1">
                        <span className="font-medium text-zinc-700">{stats.brandInfo?.name || "Global"}</span>
                        <span>•</span>
                        <span>{session.user.role === 'super_admin' ? 'Administration' : 'Dashboard'}</span>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#A22C29]/10 text-[#A22C29] rounded-full text-[10px] font-bold uppercase tracking-wider">
                    <Activity size={12} />
                    Live Data
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label="Customers"
                    value={stats.totalCustomers}
                    icon={<Users size={18} />}
                    subValue={`${stats.totalCustomers - stats.totalSent} Pending`}
                    color="zinc"
                />
                <MetricCard
                    label="WhatsApp Sent"
                    value={stats.whatsappSent}
                    icon={<Send size={18} className="text-[#A22C29]" />}
                    subValue="Direct Messages"
                    color="red"
                />
                <MetricCard
                    label="Email Sent"
                    value={stats.emailSent}
                    icon={<Globe size={18} className="text-[#A22C29]" />}
                    subValue="Invitations"
                    color="light"
                />
                <MetricCard
                    label="CTR Engagement"
                    value={`${stats.totalSent > 0 ? ((stats.clicks / stats.totalSent) * 100).toFixed(1) : 0}%`}
                    icon={<MousePointer2 size={18} className="text-[#A22C29]" />}
                    subValue={`${stats.clicks} Clicks`}
                    color="deep"
                />
            </div>

            {/* Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity / Chart Placeholder */}
                <div className="lg:col-span-2 bg-white border border-[#B9BAA3] rounded-2xl p-6 sm:p-7 shadow-[0_10px_28px_rgba(0,0,0,0.07)]">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-medium text-zinc-900">Review Sentiment</h3>
                        <select className="text-sm border border-[#B9BAA3] rounded-lg px-2 py-1 bg-[#D6D5C9] text-black/70 outline-none">
                            <option>Last 30 Days</option>
                            <option>Last 7 Days</option>
                        </select>
                    </div>

                    <div className="space-y-4">
                        <SentimentBar label="5 Stars" count={stats.positiveReviews} total={stats.totalReviews} color="bg-[#A22C29]" />
                        <SentimentBar label="4 Stars" count={0} total={stats.totalReviews} color="bg-[#A22C29]/70" />
                        <SentimentBar label="3 Stars" count={0} total={stats.totalReviews} color="bg-[#B9BAA3]" />
                        <SentimentBar label="1-2 Stars" count={stats.negativeReviews} total={stats.totalReviews} color="bg-[#902923]" />
                    </div>
                </div>

                {/* Quick Actions / Status */}
                <div className="space-y-4">
                    <div className="bg-black border border-black rounded-2xl p-6 shadow-[0_12px_35px_rgba(0,0,0,0.18)]">
                        <h3 className="font-medium text-white mb-4">System Status</h3>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#B9BAA3]">Review Gating</span>
                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/10 text-white text-xs font-medium">
                                    <ShieldCheck size={12} /> Active
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#B9BAA3]">Shopify Sync</span>
                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/10 text-white text-xs font-medium">
                                    <Activity size={12} /> Operational
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#B9BAA3]/30 border border-[#B9BAA3] rounded-2xl p-6">
                        <h3 className="font-medium text-zinc-900 mb-2">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <Link href="/admin/customers" className="flex flex-col items-center justify-center p-4 bg-white border border-[#B9BAA3] rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all text-center gap-2">
                                <Users size={20} className="text-[#A22C29]" />
                                <span className="text-xs font-medium text-zinc-700">Customers</span>
                            </Link>
                            <Link href="/admin/reviews" className="flex flex-col items-center justify-center p-4 bg-white border border-[#B9BAA3] rounded-xl hover:-translate-y-0.5 hover:shadow-md transition-all text-center gap-2">
                                <Star size={20} className="text-[#A22C29]" />
                                <span className="text-xs font-medium text-zinc-700">Reviews</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, icon, subValue, color }) {
    const colorClasses = {
        red: "bg-white border-[#A22C29]/40",
        light: "bg-white border-[#B9BAA3]",
        zinc: "bg-white border-[#B9BAA3]",
        deep: "bg-[#B9BAA3]/35 border-[#B9BAA3]",
    };

    return (
        <div className={cn(
            "border rounded-2xl p-6 shadow-[0_8px_24px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_32px_rgba(0,0,0,0.10)]",
            colorClasses[color] || "bg-white border-zinc-200"
        )}>
            <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">{label}</span>
                <div className="p-2 bg-[#D6D5C9] rounded-xl border border-[#B9BAA3]">
                    {icon}
                </div>
            </div>
            <div className="space-y-1">
                <div className="text-3xl font-black text-zinc-900 tracking-tighter tabular-nums">
                    {value}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-tight">
                    <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
                    {subValue}
                </div>
            </div>
        </div>
    );
}

function SentimentBar({ label, count, total, color }) {
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (
        <div className="flex items-center gap-4 text-sm">
            <div className="w-16 text-zinc-500 font-medium">{label}</div>
            <div className="flex-1 h-2 bg-[#D6D5C9] rounded-full overflow-hidden">
                <div
                    className={cn("h-full rounded-full", color)}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="w-12 text-right text-zinc-600">{count}</div>
        </div>
    );
}
