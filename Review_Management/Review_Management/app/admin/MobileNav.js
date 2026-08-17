"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Star,
    Users,
    Settings,
    LogOut,
    Rocket,
    Menu,
    X
} from "lucide-react";
import { signOut } from "next-auth/react";

export default function MobileNav({ isSuperAdmin, user }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navItems = [
        { label: "Overview", href: "/admin", icon: LayoutDashboard },
        { label: "Brands", href: "/admin/brands", icon: ShoppingBag, show: isSuperAdmin },
        { label: "Reviews", href: "/admin/reviews", icon: Star },
        { label: "Customers", href: "/admin/customers", icon: Users },
        { label: "Share Page", href: "/admin/share", icon: Rocket },
        { label: "Settings", href: "/admin/settings", icon: Settings },
    ].filter(item => item.show !== false);

    return (
        <div className="lg:hidden">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-zinc-500 hover:text-zinc-900 transition-colors"
                aria-label="Open menu"
            >
                <Menu size={24} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />
            )}

            <div className={`fixed inset-y-0 left-0 w-64 bg-white z-[100] transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-100 shrink-0">
                    <Link href="/admin" className="flex items-center gap-2.5 font-semibold text-lg tracking-tight" onClick={() => setIsOpen(false)}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-black/5">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={32}
                                height={32}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        Review
                    </Link>
                    <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-zinc-900">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 px-3 py-6 overflow-y-auto">
                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            // Exact match for overview, startsWith for others to keep them highlighted for subroutes
                            const isActive = item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`group flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium ${isActive ? 'bg-zinc-100 text-black' : 'text-gray-500 hover:text-black hover:bg-gray-50'}`}
                                >
                                    <Icon size={18} />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="p-4 border-t border-zinc-100 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 shrink-0">
                            {user?.name?.[0] || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name}</p>
                            <p className="text-xs text-zinc-400 truncate capitalize">{user?.role?.replace('_', ' ')}</p>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="p-2 hover:bg-zinc-100 rounded-md text-zinc-400 hover:text-red-600 transition-colors shrink-0"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
