"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Star,
  Users,
  Settings,
  Rocket,
  LoaderCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Brands", href: "/admin/brands", icon: ShoppingBag, superAdminOnly: true },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Share Page", href: "/admin/share", icon: Rocket },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebarNav({ isSuperAdmin }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [pendingHref, setPendingHref] = useState(null);
  const items = navItems.filter((item) => !item.superAdminOnly || isSuperAdmin);

  // Warm the RSC payload while the user is working, then refresh it on hover.
  useEffect(() => {
    navItems
      .filter((item) => !item.superAdminOnly || isSuperAdmin)
      .forEach((item) => router.prefetch(item.href));
  }, [router, isSuperAdmin]);

  const navigate = (event, href) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setPendingHref(href);
    startTransition(() => router.push(href));
  };

  return (
    <nav className="admin-sidebar-nav space-y-1.5">
      {items.map((item) => {
        const Icon = item.icon;
        const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
        const pending = isPending && pendingHref === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            onMouseEnter={() => router.prefetch(item.href)}
            onFocus={() => router.prefetch(item.href)}
            onClick={(event) => navigate(event, item.href)}
            aria-busy={pending}
            className={cn(
              "group flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all",
              active || pending
                ? "bg-[#A22C29] text-white shadow-lg shadow-black/20"
                : "text-[#B9BAA3] hover:bg-white/10 hover:text-white",
            )}
          >
            {pending ? <LoaderCircle size={18} className="animate-spin" /> : <Icon size={18} />}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
