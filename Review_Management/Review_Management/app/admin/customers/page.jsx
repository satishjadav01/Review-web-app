// app/admin/customers/page.js
export const dynamic = "force-dynamic";
import { cn } from "@/lib/utils";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {
  Phone,
  CheckCircle2,
  Clock,
  Search,
  MoreHorizontal,
  MessageSquare,
  ArrowUpRight,
  SearchX,
  ShoppingBag,
  Terminal,
  UploadCloud,
  ShieldCheck,
  Globe,
  User2,
  Star,
} from "lucide-react";
import CustomerActions from "./CustomerActions";
import { fetchShopifyOrders } from "@/lib/shopify";
import CredentialUpdater from "./CredentialUpdater";
import CustomersTable from "./CustomersTable";
import CSVImporter from "./CSVImporter";
import BrandSelector from "./BrandSelector";

async function getCustomerData(
  brandId,
  role,
  requestedBrandId,
  page = 1,
  pageSize = 50,
  search = null,
) {
  try {
    const activeBrandId =
      role === "super_admin" && requestedBrandId ? requestedBrandId : brandId;

    // Fetch all brands if super admin (for the dropdown)
    let allBrands = [];
    if (role === "super_admin") {
      const rawBrands = await prisma.brand.findMany({
        select: { id: true, name: true, logoUrl: true, websiteType: true },
        orderBy: { name: "asc" },
      });
      allBrands = rawBrands.map((b) => ({ ...b, _id: b.id }));
    }

    // If NOT super admin and ID is missing, fail early
    if (!activeBrandId && role !== "super_admin") {
      return {
        type: "error",
        brandName: "—",
        customers: [],
        error: "No valid brand associated with your account",
      };
    }

    let brand = null;
    if (activeBrandId) {
      brand = await prisma.brand.findUnique({
        where: { id: activeBrandId },
      });
    }

    if (!brand && role !== "super_admin") {
      return {
        type: "error",
        brandName: "—",
        customers: [],
        allBrands,
        error: "Brand not found in database",
      };
    }

    if (brand && brand.websiteType === "shopify") {
      if (!brand.shopifyStoreUrl || !brand.shopifyAccessToken) {
        return {
          type: "error",
          brandName: brand.name || "Unnamed Shopify Brand",
          customers: [],
          error: "Shopify API credentials missing (store URL or access token)",
        };
      }

      const orders = await fetchShopifyOrders(
        brand.shopifyStoreUrl,
        brand.shopifyAccessToken,
      );

      if (!Array.isArray(orders)) {
        throw new Error("Invalid response from Shopify fetch");
      }

      const shopifyCustomers = orders.map((order) => ({
        _id: order.id.toString(),
        phone:
          order.customer?.phone || order.billing_address?.phone || "No Phone",
        email: order.customer?.email || order.email || "No Email",
        name:
          `${order.customer?.first_name || ""} ${order.customer?.last_name || ""}`.trim() ||
          "Anonymous",
        orderId: order.order_number?.toString() || order.id.toString(),
        createdAt: order.created_at,
        source: "shopify",
        brandId: brand.id,
      }));

      const orderIds = shopifyCustomers.map((c) => c.orderId);

      const [allLinks, allReviews] = await Promise.all([
        prisma.reviewLink.findMany({
          where: { orderId: { in: orderIds }, brandId: activeBrandId },
        }),
        prisma.review.findMany({
          where: { orderId: { in: orderIds }, brandId: activeBrandId },
        }),
      ]);

      const linksMap = new Map(
        allLinks.map((l) => [l.orderId, { ...l, _id: l.id }]),
      );
      const reviewsMap = new Map(
        allReviews.map((r) => [r.orderId, { ...r, _id: r.id }]),
      );

      const customers = shopifyCustomers.map((c) => ({
        ...c,
        link: linksMap.has(c.orderId) ? linksMap.get(c.orderId) : null,
        review: reviewsMap.has(c.orderId) ? reviewsMap.get(c.orderId) : null,
      }));

      return {
        type: "shopify",
        brandName: brand.name || "Shopify Store",
        brandSlug: brand.slug,
        reviewMessageTemplate: brand.reviewMessageTemplate,
        isWhatsAppConfigured: !!(
          process.env.WHATSAPP_ACCESS_TOKEN &&
          process.env.WHATSAPP_PHONE_NUMBER_ID
        ),
        customers,
        allBrands,
        activeBrandId: brand.id,
      };
    }

    let whereClause =
      role === "super_admin"
        ? activeBrandId
          ? { brandId: activeBrandId }
          : {}
        : { brandId: activeBrandId };

    // Server-side search: match name, email, phone, orderId
    if (search && typeof search === "string" && search.trim().length > 0) {
      const q = search.trim();
      whereClause = {
        AND: [whereClause],
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { phone: { contains: q, mode: "insensitive" } },
          { orderId: { contains: q, mode: "insensitive" } },
        ],
      };
    }

    // Run the count and page query together; neither query depends on the other.
    const [totalCount, dbCustomers] = await Promise.all([
      prisma.customer.count({ where: whereClause }),
      prisma.customer.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        orderId: true,
        createdAt: true,
      },
      }),
    ]);

    const customerIds = dbCustomers.map((c) => c.id);

    const [allLinks, allReviews] = await Promise.all([
      prisma.reviewLink.findMany({
        where: { customerId: { in: customerIds } },
        select: {
          id: true,
          orderId: true,
          customerId: true,
          whatsappSent: true,
          emailSent: true,
          token: true,
        },
      }),
      prisma.review.findMany({
        where: { customerId: { in: customerIds } },
        select: { id: true, orderId: true, customerId: true, rating: true },
      }),
    ]);

    const linksMap = new Map(
      allLinks.map((l) => [l.customerId, { ...l, _id: l.id }]),
    );
    const reviewsMap = new Map(
      allReviews.map((r) => [r.customerId, { ...r, _id: r.id }]),
    );

    const enrichedCustomers = dbCustomers.map((customer) => {
      const cId = customer.id;
      return {
        ...customer,
        _id: customer.id,
        link: linksMap.has(cId) ? linksMap.get(cId) : null,
        review: reviewsMap.has(cId) ? reviewsMap.get(cId) : null,
        source: "local",
      };
    });

    return {
      type: "other",
      brandName:
        brand?.name ||
        (role === "super_admin" ? "All Brands (Super Admin)" : "Local Brand"),
      brandSlug: brand?.slug,
      reviewMessageTemplate: brand?.reviewMessageTemplate,
      isWhatsAppConfigured: !!(
        process.env.WHATSAPP_ACCESS_TOKEN &&
        process.env.WHATSAPP_PHONE_NUMBER_ID
      ),
      customers: JSON.parse(JSON.stringify(enrichedCustomers)),
      allBrands,
      activeBrandId: brand?.id || null,
      pagination: { page, pageSize, totalCount },
    };
  } catch (err) {
    console.error("[getCustomerData] Critical error:", {
      message: err.message,
      stack: err.stack?.slice(0, 300),
    });

    return {
      type: "error",
      brandName: "—",
      customers: [],
      allBrands: [],
      error: err.message || "Failed to load customer data",
    };
  }
}

export default async function CustomersPage({ searchParams }) {
  const session = await auth();
  const resolvedParams = await searchParams;
  const currentFilter = resolvedParams.filter || "all";

  // Early auth guard
  if (!session?.user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center p-12 bg-white rounded-3xl border shadow-lg max-w-lg">
          <ShieldCheck size={64} className="mx-auto text-red-500 mb-6" />
          <h2 className="text-3xl font-black text-zinc-900 mb-4">
            Access Denied
          </h2>
          <p className="text-zinc-600 text-lg">
            Please sign in to view this page.
          </p>
        </div>
      </div>
    );
  }

  const page = parseInt(resolvedParams.page || "1", 10) || 1;
  const pageSize = parseInt(resolvedParams.pageSize || "50", 10) || 50;
  const currentSearch = resolvedParams.search || "";
  const data = await getCustomerData(
    session.user.brandId,
    session.user.role,
    resolvedParams.bid,
    page,
    pageSize,
    currentSearch,
  );
  let {
    type,
    customers,
    brandName,
    brandSlug,
    reviewMessageTemplate,
    isWhatsAppConfigured,
    error,
    allBrands,
    activeBrandId,
    pagination,
  } = data;

  // Apply Search first
  if (currentSearch) {
    const query = currentSearch.toLowerCase().trim();
    const queryNoHash = query.startsWith("#") ? query.slice(1) : query;
    const queryNumeric = query.replace(/\D/g, "");

    customers = customers.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const phone = (c.phone || "").toLowerCase();
      const phoneNumeric = phone.replace(/\D/g, "");
      const orderId = (c.orderId || "").toLowerCase();
      const email = (c.email || "").toLowerCase();

      const nameMatch = name.includes(query);
      const phoneMatch =
        phone.includes(query) ||
        (queryNumeric && phoneNumeric.includes(queryNumeric));
      const orderIdMatch =
        orderId.includes(query) || orderId.includes(queryNoHash);
      const emailMatch = email.includes(query);

      return nameMatch || phoneMatch || orderIdMatch || emailMatch;
    });
  }

  // ── Pre-calculate counts (based on current search) ──
  const counts = {
    all: customers.length,
    pending: customers.filter((c) => !c.link).length,
    sent: customers.filter((c) => c.link).length,
    whatsapp: customers.filter((c) => c.link?.whatsappSent).length,
    email: customers.filter((c) => c.link?.emailSent).length,
  };

  // Apply Tab filtering
  if (currentFilter === "pending") {
    customers = customers.filter((c) => !c.link);
  } else if (currentFilter === "sent") {
    customers = customers.filter((c) => c.link);
  } else if (currentFilter === "whatsapp") {
    customers = customers.filter((c) => c.link?.whatsappSent);
  } else if (currentFilter === "email") {
    customers = customers.filter((c) => c.link?.emailSent);
  }

  // ── Global error screen ───────────────────────────────────────
  if (type === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center mb-4">
          <ShieldCheck size={24} />
        </div>
        <h2 className="text-xl font-semibold text-zinc-900 mb-2">
          Configuration Error
        </h2>
        <p className="text-zinc-500 max-w-md mb-6">{error}</p>
        {session.user.brandId && (
          <CredentialUpdater brandId={session.user.brandId} error={error} />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-10 group/page">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-zinc-900 tracking-tighter">
            Customers
          </h1>
          <div className="flex items-center gap-3 text-[11px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
            <span className="text-zinc-900">{brandName}</span>
            <span className="w-1 h-1 bg-zinc-200 rounded-full"></span>
            <span className="flex items-center gap-1.5 hover:text-zinc-600 transition-colors cursor-default">
              {type} node synchronized
            </span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          {session.user.role === "super_admin" && allBrands?.length > 0 && (
            <BrandSelector brands={allBrands} currentBrandId={activeBrandId} />
          )}
          <div className="flex items-center gap-3">
            <div className="px-5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-[14px] text-[11px] font-bold text-zinc-900 uppercase tracking-widest shadow-sm">
              Records: {customers.length}
            </div>
            {type === "other" && (
              <CSVImporter brandId={activeBrandId || session.user.brandId} />
            )}
          </div>
        </div>
      </div>

      {/* Interaction Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex items-center gap-1.5 p-1.5 bg-zinc-100/80 backdrop-blur-sm rounded-[20px] border border-zinc-200/50 shadow-inner w-full sm:w-fit whitespace-nowrap min-w-max">
          {[
            { label: "View All", value: "all", count: counts.all },
            { label: "Pending", value: "pending", count: counts.pending },
            { label: "Delivered", value: "sent", count: counts.sent },
            { label: "WhatsApp", value: "whatsapp", count: counts.whatsapp },
            { label: "Email", value: "email", count: counts.email },
          ].map((tab) => (
            <a
              key={tab.value}
              href={`/admin/customers?filter=${tab.value}${currentSearch ? `&search=${encodeURIComponent(currentSearch)}` : ""}`}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-[15px] transition-all duration-300",
                currentFilter === tab.value
                  ? "bg-white text-zinc-900 shadow-md ring-1 ring-zinc-900/5"
                  : "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50",
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "flex items-center justify-center min-w-[20px] h-4 px-1 rounded-full text-[9px] font-bold tabular-nums",
                  currentFilter === tab.value
                    ? "bg-zinc-900 text-white"
                    : "bg-zinc-200 text-zinc-500",
                )}
              >
                {tab.count}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {customers.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-zinc-50 rounded-lg flex items-center justify-center text-zinc-400">
              <SearchX size={24} />
            </div>
            <div className="max-w-sm">
              <h3 className="text-base font-medium text-zinc-900 mb-1">
                No customers found
              </h3>
              <p className="text-sm text-zinc-500 mb-4">
                No customers match the current filter:{" "}
                <span className="font-bold text-zinc-900 uppercase">
                  {currentFilter}
                </span>
              </p>
              <a
                href="/admin/customers"
                className="text-sm font-bold text-zinc-900 border-b-2 border-zinc-900 hover:text-zinc-600 transition-all"
              >
                Clear all filters
              </a>
            </div>
          </div>
        </div>
      ) : (
        <CustomersTable
          initialCustomers={customers}
          currentFilter={currentFilter}
          currentSearch={currentSearch}
          brandSlug={brandSlug}
          brandName={brandName}
          reviewMessageTemplate={reviewMessageTemplate}
          isWhatsAppConfigured={isWhatsAppConfigured}
          pagination={pagination}
        />
      )}
    </div>
  );
}
