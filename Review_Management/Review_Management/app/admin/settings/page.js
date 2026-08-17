import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import SettingsClient from "./SettingsClient";
import BrandSelector from "../customers/BrandSelector";

export default async function AdminSettingsPage({ searchParams }) {
  const session = await auth();
  if (!session) redirect("/login");

  const resolvedParams = await searchParams;
  const bid = resolvedParams.bid;
  let targetBrandId = session.user.brandId;

  if (session.user.role === "super_admin" && bid) {
    targetBrandId = bid;
  }

  if (!targetBrandId && session.user.role !== "super_admin") {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-zinc-200 shadow-sm max-w-lg mx-auto mt-12">
        <h3 className="text-xl font-bold text-zinc-900 mb-2">
          No Brand Assigned
        </h3>
        <p className="text-zinc-500 text-sm">
          Please contact an administrator to assign your account to a brand.
        </p>
      </div>
    );
  }

  // Fetch all brands if super admin (for the selector)
  let allBrands = [];
  if (session.user.role === "super_admin") {
    allBrands = await prisma.brand.findMany({
      select: { id: true, name: true, logoUrl: true, websiteType: true },
      orderBy: { name: "asc" },
    });
    // map to the shape expected by the client (previously used _id)
    allBrands = allBrands.map((b) => ({ ...b, _id: b.id }));
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
