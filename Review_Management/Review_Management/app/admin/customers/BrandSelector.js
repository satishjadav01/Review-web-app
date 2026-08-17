"use client";

import { useState } from "react";
import { ChevronDown, Building2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function BrandSelector({ brands, currentBrandId }) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const currentBrand = brands.find(b => b._id === currentBrandId);

    const handleSelect = (brandId) => {
        setIsOpen(false);
        router.push(`${pathname}?bid=${brandId}`);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-all shadow-sm min-w-[200px] justify-between group"
            >
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center shrink-0">
                        {currentBrand?.logoUrl ? (
                            <img src={currentBrand.logoUrl} alt={currentBrand.name} className="w-full h-full object-cover rounded-lg" />
                        ) : (
                            <Building2 size={16} className="text-white" />
                        )}
                    </div>
                    <div className="text-left">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">Active Store</p>
                        <p className="text-sm font-black text-zinc-900 truncate max-w-[120px]">
                            {currentBrand?.name || "Select Store"}
                        </p>
                    </div>
                </div>
                <ChevronDown size={16} className={cn("text-zinc-400 transition-transform duration-300", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top">
                        <div className="p-2 max-h-[300px] overflow-y-auto">
                            {brands.map((brand) => (
                                <button
                                    key={brand._id}
                                    onClick={() => handleSelect(brand._id)}
                                    className={cn(
                                        "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                                        brand._id === currentBrandId
                                            ? "bg-zinc-50 border border-zinc-100"
                                            : "hover:bg-zinc-50"
                                    )}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0 overflow-hidden">
                                        {brand.logoUrl ? (
                                            <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-[10px] font-black text-zinc-400">{brand.name[0]}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-zinc-900 truncate">{brand.name}</p>
                                        <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-tighter">{brand.websiteType}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
