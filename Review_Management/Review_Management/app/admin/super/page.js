"use client";

import { useState, useEffect } from "react";
import {
    Plus, Building2, User, Search, ArrowRight, Loader2, Signal,
    ShoppingBag, Terminal, X, ExternalLink, Mail, Lock, Upload
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import BrandActions from "../brands/BrandActions";
import Pagination from "@/components/admin/Pagination";

export default function SuperAdminDashboard() {
    const [brands, setBrands] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;

    const [formData, setFormData] = useState({
        brandName: "",
        googlePlaceId: "",
        logoUrl: "",
        managerName: "",
        managerEmail: "",
        managerPassword: "",
        websiteType: "shopify",
        shopifyStoreUrl: "",
        shopifyAccessToken: ""
    });

    const fetchBrands = async () => {
        try {
            const res = await axios.get("/api/admin/brands");
            setBrands(res.data.brands);
        } catch (error) {
            toast.error("Failed to load brands.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    // Reset pagination when searching
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const toastId = toast.loading("Adding brand...");

        try {
            if (editingId) {
                await axios.patch(`/api/admin/brands/${editingId}`, formData);
                toast.success("Brand updated successfully", { id: toastId });
            } else {
                await axios.post("/api/admin/brands", formData);
                toast.success("Brand added successfully", { id: toastId });
            }
            setIsModalOpen(false);
            setEditingId(null);
            fetchBrands();
            setFormData({
                brandName: "",
                googlePlaceId: "",
                logoUrl: "",
                managerName: "",
                managerEmail: "",
                managerPassword: "",
                websiteType: "shopify",
                shopifyStoreUrl: "",
                shopifyAccessToken: ""
            });
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to add brand", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (brand) => {
        setEditingId(brand._id);
        setFormData({
            brandName: brand.name,
            googlePlaceId: brand.googlePlaceId || "",
            logoUrl: brand.logoUrl || "",
            managerName: brand.manager?.name || "",
            managerEmail: brand.manager?.email || "",
            managerPassword: "", // Reset password field for security
            websiteType: brand.websiteType || "shopify",
            shopifyStoreUrl: brand.shopifyStoreUrl || "",
            shopifyAccessToken: brand.shopifyAccessToken || ""
        });
        setIsModalOpen(true);
    };

    const filteredBrands = brands.filter(b =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.slug.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
    const currentData = filteredBrands.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Brands</h1>
                    <p className="text-sm text-zinc-500 mt-1">Manage and provision brand configurations across the platform.</p>
                </div>

                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({
                            brandName: "",
                            googlePlaceId: "",
                            logoUrl: "",
                            managerName: "",
                            managerEmail: "",
                            managerPassword: "",
                            websiteType: "shopify",
                            shopifyStoreUrl: "",
                            shopifyAccessToken: ""
                        });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-sm shadow-zinc-200"
                >
                    <Plus size={18} />
                    Add Brand
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Brands" value={brands.length} icon={<Building2 className="text-zinc-500" />} />
                <StatCard label="Active Managers" value={brands.filter(b => b.manager).length} icon={<User className="text-zinc-500" />} />
                <StatCard label="System Status" value="Online" icon={<Signal className="text-green-500" />} />
            </div>

            {/* Brands Table */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search brands..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg outline-none focus:border-zinc-400 transition-all text-sm"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button className="flex-1 md:flex-none px-4 py-2.5 text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-colors">
                            Export
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-zinc-50/50 border-b border-zinc-100">
                                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Brand Name</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Manager</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Platform</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
                                            <p className="text-xs text-zinc-500 font-medium">Loading brands...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : currentData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center">
                                        <p className="text-sm text-zinc-500">No brands found.</p>
                                    </td>
                                </tr>
                            ) : currentData.map((brand) => (
                                <tr key={brand._id.toString()} className="hover:bg-zinc-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center font-bold text-sm text-zinc-600 overflow-hidden">
                                                {brand.logoUrl ? (
                                                    <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    brand.name[0].toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-zinc-900 text-sm">{brand.name}</div>
                                                <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider mt-0.5">{brand.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold text-zinc-900">{brand.manager?.name || "Unassigned"}</p>
                                            <p className="text-[11px] text-zinc-500">{brand.manager?.email || "—"}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-50 border border-zinc-200 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                                            {brand.websiteType === 'shopify' ? <ShoppingBag size={12} /> : <Terminal size={12} />}
                                            {brand.websiteType}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${brand.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            <span className="text-[11px] font-bold uppercase text-zinc-900">{brand.isActive ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex justify-end">
                                            <BrandActions
                                                brandId={brand._id.toString()}
                                                brandName={brand.name}
                                                onEdit={() => handleEdit(brand)}
                                                onActionSuccess={fetchBrands}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-zinc-100 flex items-center justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[24px] overflow-hidden shadow-2xl relative z-10 flex flex-col"
                        >
                            <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-zinc-900">
                                        {editingId ? "Edit Brand Details" : "Add New Brand"}
                                    </h2>
                                    <p className="text-sm text-zinc-500">
                                        {editingId ? "Update existing brand and manager information." : "Initialize a new brand account and manager."}
                                    </p>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-zinc-50 rounded-full transition-colors text-zinc-400">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-10">
                                {/* Section: Identity */}
                                <div className="space-y-6">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Brand Identity</h3>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <InputGroup label="Brand Name" value={formData.brandName} onChange={v => setFormData({ ...formData, brandName: v })} placeholder="e.g. Acme Corp" />
                                        <InputGroup label="Google Place ID" value={formData.googlePlaceId} onChange={v => setFormData({ ...formData, googlePlaceId: v })} placeholder="ChIJN1t_..." />
                                        <div className="space-y-2">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-0.5">Logo Image</label>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-lg border border-zinc-200 overflow-hidden bg-zinc-50 flex items-center justify-center shrink-0">
                                                        {formData.logoUrl ? (
                                                            <img src={formData.logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Upload size={18} className="text-zinc-300" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 space-y-2">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            id="logo-upload"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                const file = e.target.files[0];
                                                                if (file) {
                                                                    const reader = new FileReader();
                                                                    reader.onloadend = () => {
                                                                        setFormData({ ...formData, logoUrl: reader.result });
                                                                    };
                                                                    reader.readAsDataURL(file);
                                                                }
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor="logo-upload"
                                                            className="inline-flex items-center justify-center px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-900 cursor-pointer hover:bg-zinc-100 transition-all w-full"
                                                        >
                                                            Select Image
                                                        </label>
                                                        {formData.logoUrl && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, logoUrl: "" })}
                                                                className="text-[10px] text-red-500 font-bold uppercase tracking-wider hover:underline"
                                                            >
                                                                Remove
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section: Integration */}
                                <div className="space-y-6">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Integration Architecture</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, websiteType: "shopify" })}
                                            className={`p-6 rounded-2xl border-2 text-left transition-all ${formData.websiteType === 'shopify' ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-100 hover:border-zinc-200'}`}
                                        >
                                            <ShoppingBag className={formData.websiteType === 'shopify' ? 'text-zinc-900' : 'text-zinc-400'} size={24} />
                                            <p className="font-bold text-sm mt-4">Shopify</p>
                                            <p className="text-xs text-zinc-500 mt-1">Direct order synchronization.</p>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, websiteType: "other" })}
                                            className={`p-6 rounded-2xl border-2 text-left transition-all ${formData.websiteType === 'other' ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-100 hover:border-zinc-200'}`}
                                        >
                                            <Terminal className={formData.websiteType === 'other' ? 'text-zinc-900' : 'text-zinc-400'} size={24} />
                                            <p className="font-bold text-sm mt-4">Manual / Other</p>
                                            <p className="text-xs text-zinc-500 mt-1">Upload customers via CSV.</p>
                                        </button>
                                    </div>

                                    {formData.websiteType === 'shopify' && (
                                        <div className="grid md:grid-cols-2 gap-6 p-6 bg-zinc-50 rounded-2xl border border-zinc-100">
                                            <InputGroup label="Shopify Store URL" value={formData.shopifyStoreUrl} onChange={v => setFormData({ ...formData, shopifyStoreUrl: v })} placeholder="brand.myshopify.com" />
                                            <InputGroup label="Access Token" value={formData.shopifyAccessToken} onChange={v => setFormData({ ...formData, shopifyAccessToken: v })} placeholder="shpat_..." type="password" />
                                        </div>
                                    )}
                                </div>

                                {/* Section: Manager */}
                                <div className="space-y-6">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Manager Account</h3>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <InputGroup label="Name" value={formData.managerName} onChange={v => setFormData({ ...formData, managerName: v })} placeholder="John Doe" />
                                        <InputGroup label="Email" value={formData.managerEmail} onChange={v => setFormData({ ...formData, managerEmail: v })} placeholder="john@example.com" type="email" />
                                        <InputGroup label="Password" value={formData.managerPassword} onChange={v => setFormData({ ...formData, managerPassword: v })} placeholder="••••••••" type="password" />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="animate-spin" size={20} />
                                    ) : (
                                        editingId ? "Save Changes" : "Create Brand Account"
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatCard({ label, value, icon }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-zinc-50 flex items-center justify-center">
                {icon}
            </div>
            <div>
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">{label}</p>
                <p className="text-2xl font-bold text-zinc-900 mt-1">{value}</p>
            </div>
        </div>
    );
}

function InputGroup({ label, value, onChange, placeholder, type = "text" }) {
    return (
        <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider ml-0.5">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-12 bg-white border border-zinc-200 rounded-xl px-4 outline-none focus:border-zinc-400 transition-all text-sm font-medium"
                required
            />
        </div>
    );
}
