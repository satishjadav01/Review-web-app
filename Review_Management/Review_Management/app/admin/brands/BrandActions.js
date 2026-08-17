"use client";

import { useState, useRef, useEffect } from "react";
import { MoreVertical, Edit2, Trash2, Settings, ExternalLink } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function BrandActions({ brandId, brandName, onEdit, onActionSuccess }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDelete = async () => {
        if (!confirm(`Are you absolutely sure you want to delete "${brandName}"? This will delete all customers, reviews, and links associated with this brand. This action cannot be undone.`)) {
            return;
        }

        const toastId = toast.loading("Deleting brand...");
        try {
            await axios.delete(`/api/admin/brands/${brandId}`);
            toast.success("Brand deleted successfully", { id: toastId });
            if (onActionSuccess) {
                onActionSuccess();
            } else {
                router.refresh();
            }
        } catch (error) {
            console.error("Delete brand error:", error);
            toast.error(error.response?.data?.error || "Failed to delete brand", { id: toastId });
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all"
            >
                <MoreVertical size={20} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1.5">
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                if (onEdit) {
                                    onEdit();
                                } else {
                                    router.push(`/admin/settings?bid=${brandId}`);
                                }
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all"
                        >
                            <Edit2 size={16} />
                            Edit Details
                        </button>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                router.push(`/admin/settings?bid=${brandId}`);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all"
                        >
                            <Settings size={16} />
                            Full Configuration
                        </button>

                        <button
                            onClick={() => {
                                setIsOpen(false);
                                router.push(`/admin/customers?bid=${brandId}`);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all"
                        >
                            <ExternalLink size={16} />
                            View Customers
                        </button>

                        <div className="h-px bg-zinc-100 my-1 mx-2" />

                        <button
                            onClick={handleDelete}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                            <Trash2 size={16} />
                            Delete Brand
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
