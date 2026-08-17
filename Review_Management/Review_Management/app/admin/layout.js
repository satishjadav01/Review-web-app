import Link from "next/link";
import Image from "next/image";
import {
    Star,
    LogOut,
    Bell,
    Search,
} from "lucide-react";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import MobileNav from "./MobileNav";
import AdminSidebarNav from "./AdminSidebarNav";

export default async function AdminLayout({ children }) {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const isSuperAdmin = session.user.role === "super_admin";

    return (
        <div className="flex min-h-screen bg-[#D6D5C9] font-sans text-black">
            {/* Sidebar - Desktop */}
            <aside className="w-72 hidden lg:flex flex-col fixed inset-y-0 z-50 bg-black text-white shadow-[8px_0_30px_rgba(0,0,0,.12)]">
                <div className="h-20 flex items-center px-7 border-b border-white/15">
                    <Link href="/admin" className="flex items-center gap-3 font-bold text-lg tracking-tight">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden bg-white/10 shadow-lg shadow-black/30">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={36}
                                height={36}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        Review
                    </Link>
                </div>

                <div className="flex-1 px-4 py-7 overflow-y-auto">
                    <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#B9BAA3]">Workspace</p>
                    <AdminSidebarNav isSuperAdmin={isSuperAdmin} />
                </div>

                <div className="p-4 border-t border-white/15">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/10">
                        <div className="w-9 h-9 rounded-xl bg-[#A22C29] flex items-center justify-center text-xs font-bold text-white">
                            {session.user.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-white">{session.user.name}</p>
                            <p className="text-xs text-[#B9BAA3] truncate capitalize">{session.user.role.replace('_', ' ')}</p>
                        </div>
                        <form
                            action={async () => {
                                "use server";
                                await signOut({ redirectTo: "/login" });
                            }}
                        >
                            <button type="submit" className="p-2 hover:bg-white/10 rounded-lg text-[#B9BAA3] hover:text-white transition-colors">
                                <LogOut size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
                <header className="h-20 px-4 sm:px-8 lg:px-10 flex items-center justify-between bg-[#D6D5C9]/95 backdrop-blur-xl sticky top-0 z-40 border-b border-[#B9BAA3]/60">
                    <div className="flex items-center gap-4">
                        <MobileNav isSuperAdmin={isSuperAdmin} user={session.user} />
                        <div className="hidden sm:block">
                            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-black/45">Workspace</p>
                            <p className="text-sm font-semibold text-black">{isSuperAdmin ? 'Global Administration' : 'Brand Management'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="hidden md:flex items-center gap-2 h-10 w-56 px-3 rounded-xl border border-[#B9BAA3] bg-white text-black/50 focus-within:border-[#A22C29]">
                            <Search size={16} />
                            <input aria-label="Search" placeholder="Search workspace" className="w-full bg-transparent text-sm outline-none placeholder:text-black/40" />
                        </label>
                        <button aria-label="Notifications" className="relative w-10 h-10 grid place-items-center rounded-xl border border-[#B9BAA3] bg-white text-black/55 hover:text-[#A22C29] hover:border-[#A22C29] transition-all">
                            <Bell size={20} />
                            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#A22C29]" />
                        </button>
                    </div>
                </header>

                <div className="flex-1 bg-[#D6D5C9] p-4 sm:p-8 lg:p-10 overflow-x-hidden">
                    <div className="w-full max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
