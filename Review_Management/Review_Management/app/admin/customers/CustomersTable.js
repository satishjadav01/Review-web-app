"use client";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  Search,
  Clock,
  Star,
  Send,
  CheckSquare,
  Square,
  Loader2,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CustomerActions from "./CustomerActions";
import Pagination from "@/components/admin/Pagination";

export default function CustomersTable({
  initialCustomers,
  currentFilter,
  currentSearch,
  brandSlug,
  brandName,
  reviewMessageTemplate,
  isWhatsAppConfigured,
  pagination,
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkSending, setIsBulkSending] = useState(false);
  const [currentPage, setCurrentPage] = useState(pagination?.page || 1);
  const itemsPerPage = pagination?.pageSize || 50;
  const router = useRouter();

  // Reset pagination when data or pagination changes
  useEffect(() => {
    setCurrentPage(pagination?.page || 1);
  }, [initialCustomers, pagination?.page]);

  const totalPages = Math.ceil(
    (pagination?.totalCount || initialCustomers.length) / itemsPerPage,
  );
  // initialCustomers is already paginated by server
  const currentData = initialCustomers;

  const toggleSelectAll = () => {
    if (selectedIds.length === currentData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentData.map((c) => c._id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    } else {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const handleBulkSend = async () => {
    if (selectedIds.length === 0) return;

    setIsBulkSending(true);
    const toastId = toast.loading(
      `Sending review links to ${selectedIds.length} customers...`,
    );

    try {
      const selectedCustomers = initialCustomers.filter((c) =>
        selectedIds.includes(c._id),
      );
      const res = await axios.post("/api/admin/customers/bulk-send", {
        customers: selectedCustomers.map((c) => ({
          phone: c.phone,
          email: c.email,
          name: c.name,
          orderId: c.orderId,
          brandId: c.brandId,
        })),
      });

      if (res.data.success) {
        toast.success(
          `Successfully processed ${res.data.summary.success} links`,
          { id: toastId },
        );
        setSelectedIds([]);
        router.refresh();
      }
    } catch (error) {
      console.error("Bulk send error:", error);
      toast.error("Failed to process bulk request", { id: toastId });
    } finally {
      setIsBulkSending(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // push new URL to trigger server-side data fetch
    const params = new URLSearchParams(window.location.search);
    params.set("page", page);
    if (currentSearch) params.set("search", currentSearch);
    params.set("filter", currentFilter || "all");
    router.push(`/admin/customers?${params.toString()}`);
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-[24px] shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* 🛠️ Enhanced Toolbar */}
      <div className="px-8 py-6 border-b border-zinc-100 flex flex-col lg:flex-row items-center justify-between gap-6 bg-zinc-50/30">
        <div className="flex-1 w-full max-w-2xl">
          <form
            action="/admin/customers"
            method="GET"
            className="relative flex items-center gap-3"
          >
            <div className="relative flex-1 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors"
                size={18}
              />
              <input
                type="text"
                name="search"
                key={currentSearch}
                defaultValue={currentSearch}
                placeholder="Search by name, phone, email or order ID..."
                className="w-full pl-12 pr-12 py-3.5 bg-white border border-zinc-200 rounded-2xl outline-none focus:border-zinc-900 focus:ring-[3px] focus:ring-zinc-900/5 transition-all placeholder:text-zinc-400 text-sm font-medium shadow-sm"
              />
              {currentSearch && (
                <a
                  href={`/admin/customers?filter=${currentFilter}`}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 text-zinc-500 rounded-full transition-all"
                >
                  <X size={12} />
                </a>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-white hover:bg-zinc-50 text-zinc-900 text-sm font-bold rounded-2xl transition-all border border-zinc-200 shadow-sm active:scale-95"
            >
              Search
            </button>
            <input type="hidden" name="filter" value={currentFilter} />
          </form>

          {currentSearch && (
            <div className="flex items-center gap-2 mt-3 text-[11px] text-zinc-500 font-bold uppercase tracking-wider px-1">
              <span className="w-1 h-1 bg-zinc-300 rounded-full"></span>
              Found {initialCustomers.length} results for "
              <span className="text-zinc-900">{currentSearch}</span>"
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkSend}
              disabled={isBulkSending}
              className="w-full lg:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 bg-zinc-900 text-white text-sm font-bold rounded-2xl hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 disabled:opacity-50 active:scale-95 group"
            >
              {isBulkSending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Send
                  size={18}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              )}
              Process Bulk ({selectedIds.length})
            </button>
          )}
        </div>
      </div>

      {/* 📊 Compact Responsive Table Container */}
      <div className="relative">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
          <table className="w-full text-left border-collapse table-auto min-w-[700px]">
            <thead>
              <tr className="bg-white border-b border-zinc-100">
                <th className="px-3 py-4 w-10 text-center">
                  <button
                    onClick={toggleSelectAll}
                    className={cn(
                      "w-4 h-4 mx-auto rounded border flex items-center justify-center transition-all",
                      selectedIds.length === currentData.length &&
                        currentData.length > 0
                        ? "bg-zinc-900 border-zinc-900 text-white"
                        : "bg-white border-zinc-200 hover:border-zinc-400",
                    )}
                  >
                    {selectedIds.length === currentData.length &&
                      currentData.length > 0 && (
                        <CheckCircle2 size={10} strokeWidth={3} />
                      )}
                  </button>
                </th>
                <th className="px-3 py-4 text-[10px] font-bold text-zinc-400 border-b border-zinc-100 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-3 py-4 text-[10px] font-bold text-zinc-400 border-b border-zinc-100 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-3 py-4 text-[10px] font-bold text-zinc-400 border-b border-zinc-100 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-3 py-4 text-[10px] font-bold text-zinc-400 border-b border-zinc-100 uppercase tracking-wider text-center">
                  Status
                </th>
                <th className="px-3 py-4 text-[10px] font-bold text-zinc-400 border-b border-zinc-100 uppercase tracking-wider text-center">
                  Rating
                </th>
                <th className="px-4 py-4 text-[10px] font-bold text-zinc-400 border-b border-zinc-100 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {currentData.map((item) => (
                <tr
                  key={item._id}
                  className={cn(
                    "group transition-all duration-200",
                    selectedIds.includes(item._id)
                      ? "bg-zinc-50/80"
                      : "hover:bg-zinc-50/40",
                  )}
                >
                  <td className="px-3 py-3 text-center">
                    <button
                      onClick={() => toggleSelect(item._id)}
                      className={cn(
                        "w-4 h-4 mx-auto rounded border flex items-center justify-center transition-all",
                        selectedIds.includes(item._id)
                          ? "bg-zinc-900 border-zinc-900 text-white"
                          : "bg-white border-zinc-200 group-hover:border-zinc-400",
                      )}
                    >
                      {selectedIds.includes(item._id) && (
                        <CheckCircle2 size={10} strokeWidth={3} />
                      )}
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center text-[10px] font-black text-white shadow-sm shrink-0">
                        {item.name ? item.name[0].toUpperCase() : "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-900 truncate group-hover:text-black transition-colors">
                          {item.name || "Anonymous"}
                        </p>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter truncate">
                          {item.source || "Direct"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="space-y-0.5 min-w-0 max-w-[150px]">
                      <p className="text-[11px] font-bold text-zinc-700 truncate">
                        {item.phone || "—"}
                      </p>
                      <p className="text-[10px] text-zinc-400 truncate">
                        {item.email || "—"}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex px-1.5 py-0.5 bg-zinc-100 rounded text-[10px] font-bold text-zinc-600 border border-zinc-200/50">
                      {item.orderId ? `#${item.orderId}` : "—"}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex justify-center">
                      {item.link ? (
                        <div className="flex flex-col items-center gap-1">
                          {item.link.whatsappSent && item.link.emailSent ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100">
                              All Sent
                            </span>
                          ) : item.link.whatsappSent ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-green-50 text-green-700 border border-green-100">
                              Sent WhatsApp
                            </span>
                          ) : item.link.emailSent ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-blue-50 text-blue-700 border border-blue-100">
                              Sent Email
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-100">
                              Sent
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-zinc-400 text-[9px] font-black uppercase">
                          Pending
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex justify-center">
                      {item.review ? (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-50 rounded-full border border-yellow-100">
                          <Star
                            size={10}
                            className="fill-yellow-500 text-yellow-500"
                          />
                          <span className="font-black text-yellow-700 text-[10px]">
                            {item.review.rating}
                          </span>
                        </div>
                      ) : (
                        <span className="text-zinc-200 text-[10px]">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <CustomerActions
                      customerId={item._id}
                      name={item.name}
                      phone={item.phone}
                      email={item.email}
                      orderId={item.orderId}
                      brandId={item.brandId}
                      brandSlug={brandSlug}
                      brandName={brandName}
                      reviewMessageTemplate={reviewMessageTemplate}
                      whatsappSent={item.link?.whatsappSent}
                      emailSent={item.link?.emailSent}
                      isWhatsAppConfigured={isWhatsAppConfigured}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 💡 Table Footer Info */}
      <div className="px-6 py-4 bg-white border-t border-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-4">
          <p>Total {initialCustomers.length} records</p>
          <span className="w-1 h-1 bg-zinc-200 rounded-full"></span>
          <p>
            Showing page {currentPage} of {totalPages}
          </p>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          Live Synchronization
        </div>
      </div>
    </div>
  );
}
