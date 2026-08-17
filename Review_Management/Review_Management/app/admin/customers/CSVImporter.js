"use client";

import { useState, useRef } from "react";
import { UploadCloud, Loader2, FileUp } from "lucide-react";
import Papa from "papaparse";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CSVImporter({ brandId }) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const router = useRouter();

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Reset input
        event.target.value = "";

        if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
            toast.error("Please upload a valid CSV file.");
            return;
        }

        setIsUploading(true);
        const toastId = toast.loading("Parsing CSV...");

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const { data, meta } = results;

                if (data.length === 0) {
                    toast.error("The CSV file is empty.", { id: toastId });
                    setIsUploading(false);
                    return;
                }

                toast.loading(`Importing ${data.length} customers...`, { id: toastId });

                try {
                    // Normalize keys (handle case-insensitive or slight variations)
                    const normalizedData = data.map(row => {
                        const newRow = {};
                        Object.keys(row).forEach(key => {
                            const lowerKey = key.toLowerCase().trim();
                            let value = row[key];

                            // Clean Excel escape formatting like ="911234567890"
                            if (typeof value === "string" && value.startsWith('="') && value.endsWith('"')) {
                                value = value.substring(2, value.length - 1);
                            }

                            if (lowerKey === "name" || lowerKey === "customer name" || lowerKey === "customer") {
                                newRow.name = value;
                            } else if (lowerKey === "phone" || lowerKey === "mobile" || lowerKey === "number") {
                                newRow.phone = value;
                            } else if (lowerKey === "orderid" || lowerKey === "order id" || lowerKey === "order #" || lowerKey === "order_id") {
                                newRow.orderId = value;
                            } else if (lowerKey === "email" || lowerKey === "e-mail" || lowerKey === "mail") {
                                newRow.email = value;
                            }
                        });
                        return newRow;
                    }).filter(row => row.phone || row.orderId);

                    if (normalizedData.length === 0) {
                        toast.error("Could not find required columns (Phone, Order ID) in CSV.", { id: toastId });
                        setIsUploading(false);
                        return;
                    }

                    const response = await axios.post("/api/admin/customers/import", {
                        customers: normalizedData,
                        brandId
                    });

                    if (response.data.success) {
                        toast.success(response.data.message, { id: toastId });
                        router.refresh();
                    } else {
                        toast.error(response.data.error || "Failed to import", { id: toastId });
                    }
                } catch (error) {
                    console.error("Import error:", error);
                    toast.error(error.response?.data?.error || "Error importing customers", { id: toastId });
                } finally {
                    setIsUploading(false);
                }
            },
            error: (error) => {
                console.error("CSV Parse Error:", error);
                toast.error("Failed to parse CSV file.", { id: toastId });
                setIsUploading(false);
            }
        });
    };

    const handleDownloadSample = () => {
        const headers = ["Name", "Email", "Phone", "OrderId"];
        const rows = [
            ["John Doe", "john@example.com", '="919876543210"', '="ORD-123"'],
            ["Jane Smith", "jane@example.com", '="918765432109"', '="ORD-456"']
        ];

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "sample_customers.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex items-center gap-2">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                className="hidden"
            />

            <button
                onClick={handleDownloadSample}
                className="group flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 text-zinc-500 text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-50 hover:text-zinc-900 transition-all shadow-sm"
            >
                <FileUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                Sample CSV
            </button>

            <button
                onClick={handleButtonClick}
                disabled={isUploading}
                className="flex items-center gap-2 px-5 py-2 bg-zinc-900 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 disabled:opacity-50"
            >
                {isUploading ? (
                    <Loader2 size={14} className="animate-spin" />
                ) : (
                    <UploadCloud size={14} />
                )}
                {isUploading ? "Processing..." : "Ingest CSV"}
            </button>
        </div>
    );
}
