import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SettingsClient from "./SettingsClient";
import BrandSelector from "../customers/BrandSelector";

import { DEMO_BRANDS } from "@/lib/demoData";

export default async function AdminSettingsPage({ searchParams }) {
  const session = await auth();
  if (!session) redirect("/login");

  const resolvedParams = await searchParams;
  const bid = resolvedParams.bid;
  let targetBrandId = session.user.brandId;

  if (session.user.role === "super_admin" && bid) {
    targetBrandId = bid;
  }

  // Fetch all brands if super admin (for the selector)
  let allBrands = [];
  if (session.user.role === "super_admin") {
    try {
      allBrands = await prisma.brand.findMany({
        select: { id: true, name: true, logoUrl: true, websiteType: true },
        orderBy: { name: "asc" },
      });
      allBrands = allBrands.map((b) => ({ ...b, _id: b.id }));
    } catch (e) {
      allBrands = [];
    }
    if (allBrands.length === 0) {
      allBrands = DEMO_BRANDS.map((b) => ({ ...b, _id: b.id }));
    }
  }

  if (!targetBrandId && allBrands.length > 0) {
    targetBrandId = allBrands[0].id;
  }

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header Area Managed by Client (or we can inject BrandSelector into the Client) */}
      <SettingsClient
        sessionRole={session.user.role}
        allBrands={allBrands}
        targetBrandId={targetBrandId}
        bid={bid}
      />
    </div>
  );
}
