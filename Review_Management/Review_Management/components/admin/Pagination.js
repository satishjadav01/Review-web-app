"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, start + maxVisible - 1);

            if (end === totalPages) {
                start = Math.max(1, end - maxVisible + 1);
            }

            for (let i = start; i <= end; i++) pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 py-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
                <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-1">
                {getPageNumbers().map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={cn(
                            "w-10 h-10 rounded-xl text-sm font-bold transition-all",
                            currentPage === page
                                ? "bg-zinc-900 text-white shadow-lg shadow-zinc-200"
                                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900"
                        )}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
