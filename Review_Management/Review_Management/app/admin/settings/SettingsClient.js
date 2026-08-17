"use client";

import { useState, useEffect } from "react";
import {
    Building2,
    Palette,
    MessageSquare,
    ShieldCheck,
    Globe,
    Check,
    Save,
    Settings as SettingsIcon,
    Smartphone,
    X,
    Upload,
    Loader2,
    ShoppingCart,
    Link as LinkIcon,
    AlertCircle,
    Mail
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";
import BrandSelector from "../customers/BrandSelector";

export default function SettingsClient({ sessionRole, allBrands, targetBrandId, bid }) {
    const [brand, setBrand] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const fetchBrandData = async () => {
        if (!targetBrandId && sessionRole === "super_admin") {
            setBrand(null);
            setIsLoading(false);
            return;
        }

        try {
            const url = bid ? `/api/admin/brand-data?bid=${bid}` : "/api/admin/brand-data";
            const res = await axios.get(url);
            // Ensure defaults for new fields
            const data = {
                ...res.data.brand,
                smtpHost: res.data.brand.smtpHost || '',
                smtpPort: res.data.brand.smtpPort || '587',
                smtpUser: res.data.brand.smtpUser || '',
                smtpPass: res.data.brand.smtpPass || '',
                useSMTP: res.data.brand.useSMTP || false,
                brandEmail: res.data.brand.brandEmail || ''
            };
            setBrand(data);
        } catch (error) {
            console.error("Fetch Settings Error:", error);
            toast.error("Failed to load settings.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBrandData();
    }, [bid, targetBrandId, sessionRole]);

    const handleSave = async () => {
        setIsSaving(true);
        const toastId = toast.loading("Saving settings...");
        try {
            await axios.post("/api/admin/brand-data", {
                ...brand,
                shareCategories: brand.shareCategories || [],
                bid // Pass the target brand ID for super admins
            });
            toast.success("Settings updated successfully.", { id: toastId });
        } catch (error) {
            console.error("Save Settings Error:", error);
            toast.error("Failed to save settings.", { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="py-24 text-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
                    <p className="text-xs text-zinc-500 font-medium">Loading your configurations...</p>
                </div>
            </div>
        );
    }

    if (!brand) {
        return (
            <div className="p-12 text-center bg-white rounded-3xl border border-zinc-200 shadow-sm max-w-lg mx-auto mt-12">
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Please select a brand</h3>
                <p className="text-zinc-500 text-sm mb-6">Select a brand from the top menu to view its settings.</p>
                {sessionRole === "super_admin" && (
                    <div className="flex justify-center">
                        <BrandSelector brands={allBrands} currentBrandId={targetBrandId} />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                            <SettingsIcon size={20} className="text-zinc-400" />
                            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Settings</h1>
                        </div>
                        {sessionRole === "super_admin" && (
                            <div className="sm:hidden">
                                <BrandSelector brands={allBrands} currentBrandId={targetBrandId} />
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-zinc-500">Manage your brand identity, platform integrations, and automated messaging.</p>
                </div>

                <div className="flex items-center gap-4">
                    {sessionRole === "super_admin" && (
                        <div className="hidden sm:block">
                            <BrandSelector brands={allBrands} currentBrandId={targetBrandId} />
                        </div>
                    )}
                    <div className="flex items-center gap-3">
                    <div className={cn(
                        "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2",
                        brand.isActive ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
                    )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", brand.isActive ? "bg-green-500 animate-pulse" : "bg-red-500")} />
                        {brand.isActive ? "System Online" : "System Offline"}
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-900 text-white rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        Save Changes
                    </button>
                </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Main Settings */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Brand Identity */}
                    <SettingSection
                        title="Brand Identity"
                        icon={<Building2 size={18} />}
                        description="Basic details about your business used across the review platform."
                    >
                        <div className="grid md:grid-cols-2 gap-6">
                            <InputGroup
                                label="Company Name"
                                value={brand.name}
                                onChange={v => setBrand({ ...brand, name: v })}
                                placeholder="Your Business Name"
                            />
                            <InputGroup
                                label="Brand Slug (Read Only)"
                                value={brand.slug}
                                disabled
                            />
                            <div className="md:col-span-2">
                                <InputGroup
                                    label="Google Place ID"
                                    value={brand.googlePlaceId}
                                    onChange={v => setBrand({ ...brand, googlePlaceId: v })}
                                    placeholder="ChIJu46S-6hDTo4R9Y9..."
                                />
                                <p className="mt-1.5 text-[10px] text-zinc-400">This ID connects your platform to your Google Business Profile for direct reviews.</p>
                            </div>
                        </div>
                    </SettingSection>

                    {/* Platform Integration */}
                    <SettingSection
                        title="Platform Integration"
                        icon={<ShoppingCart size={18} />}
                        description="Connect your store to automatically import orders and customers."
                    >
                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <div>
                                    <p className="text-sm font-bold text-zinc-900">Website Platform</p>
                                    <p className="text-xs text-zinc-500">Switch between Shopify automation or manual CSV imports.</p>
                                </div>
                                <select
                                    value={brand.websiteType || "other"}
                                    onChange={e => setBrand({ ...brand, websiteType: e.target.value })}
                                    className="bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus:border-zinc-400"
                                >
                                    <option value="shopify">Shopify Store</option>
                                    <option value="other">Manual / Other</option>
                                </select>
                            </div>

                            {brand.websiteType === "shopify" && (
                                <div className="grid md:grid-cols-2 gap-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <InputGroup
                                        label="Shopify Store URL"
                                        value={brand.shopifyStoreUrl}
                                        onChange={v => setBrand({ ...brand, shopifyStoreUrl: v })}
                                        placeholder="your-store.myshopify.com"
                                        autoComplete="new-password"
                                    />
                                    <InputGroup
                                        label="Admin Access Token"
                                        value={brand.shopifyAccessToken}
                                        onChange={v => setBrand({ ...brand, shopifyAccessToken: v })}
                                        type="password"
                                        placeholder="shpat_xxxxxxxxxxxxxxxx"
                                        autoComplete="new-password"
                                    />
                                    <div className="md:col-span-2 p-3 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
                                        <ShieldCheck size={18} className="text-blue-500 shrink-0" />
                                        <p className="text-[11px] text-blue-700 leading-relaxed">
                                            <strong>Security:</strong> We only require <code>read_orders</code> and <code>read_customers</code> scopes to sync your data. Never share this token outside of this settings page.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </SettingSection>

                    {/* WhatsApp Configuration */}
                    <SettingSection
                        title="WhatsApp Messaging & Sharing"
                        icon={<MessageSquare size={18} />}
                        description="Configure automated Meta Cloud API messaging and manual customer-led sharing."
                    >
                        <div className="space-y-6">
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-2">
                                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-widest">Meta Cloud API Managed Globally</h4>
                                <p className="text-[11px] text-blue-700 leading-relaxed">
                                    WhatsApp automated messaging is configured globally via environment variables. Specific brand-level credentials are not required.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-0.5">Manual WhatsApp Message Template</label>
                                <textarea
                                    rows={4}
                                    value={brand.reviewMessageTemplate}
                                    onChange={e => setBrand({ ...brand, reviewMessageTemplate: e.target.value })}
                                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl outline-none focus:border-zinc-400 font-medium text-sm leading-relaxed transition-all"
                                    placeholder="Hi! I just had a great experience with [[brandName]]. Could you please leave feedback here? ⭐\n\nLeave a review here: [[link]]"
                                />
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="text-[9px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-bold uppercase">[[link]]</span>
                                    <span className="text-[9px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-bold uppercase">[[brandName]]</span>
                                    <span className="text-[9px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-bold uppercase">[[orderId]]</span>
                                </div>
                                <p className="text-[10px] text-zinc-400 italic mt-2">This message will appear as a draft for the sender when they click the manual WhatsApp button.</p>
                            </div>
                        </div>
                    </SettingSection>

                    {/* Email Configuration */}
                    <SettingSection
                        title="Email Delivery"
                        icon={<Mail size={18} />}
                        description="Configure Resend to send review requests when phone numbers are missing."
                    >
                        <div className="space-y-6">
                            <InputGroup
                                        label="Resend API Key"
                                        value={brand.resendApiKey || ''}
                                        onChange={v => setBrand({ ...brand, resendApiKey: v })}
                                        type="password"
                                        placeholder="re_xxxxxxxxxxxxxxxx"
                                        autoComplete="new-password"
                                    />
                            <InputGroup
                                label="Sender Email (Verified in Resend)"
                                value={brand.brandEmail || ''}
                                onChange={v => setBrand({ ...brand, brandEmail: v })}
                                type="email"
                                placeholder="reviews@yourdomain.com"
                                autoComplete="new-password"
                            />
                            <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold text-zinc-900">Use Custom SMTP</p>
                                    <p className="text-[10px] text-zinc-500">Enable this to use your own email server (Outlook, Gmail, etc.)</p>
                                </div>
                                <div
                                    onClick={() => setBrand({ ...brand, useSMTP: !brand.useSMTP })}
                                    className={cn(
                                        "w-11 h-6 rounded-full transition-all relative cursor-pointer",
                                        brand.useSMTP ? "bg-zinc-900" : "bg-zinc-200"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                                        brand.useSMTP ? "left-6" : "left-1"
                                    )} />
                                </div>
                            </div>

                            {brand.useSMTP && (
                                <div className="space-y-4 pt-2 border-t border-zinc-100 animate-in fade-in slide-in-from-top-1">
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="md:col-span-2">
                                            <InputGroup
                                                label="SMTP Host"
                                                value={brand.smtpHost}
                                                onChange={v => setBrand({ ...brand, smtpHost: v })}
                                                placeholder="smtp.gmail.com"
                                            />
                                        </div>
                                        <InputGroup
                                            label="Port"
                                            value={brand.smtpPort}
                                            onChange={v => setBrand({ ...brand, smtpPort: v })}
                                            placeholder="587"
                                        />
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <InputGroup
                                            label="SMTP User"
                                            value={brand.smtpUser}
                                            onChange={v => setBrand({ ...brand, smtpUser: v })}
                                            placeholder="your-email@example.com"
                                            autoComplete="new-password"
                                        />
                                        <InputGroup
                                            label="SMTP Password"
                                            value={brand.smtpPass}
                                            onChange={v => setBrand({ ...brand, smtpPass: v })}
                                            type="password"
                                            placeholder="••••••••"
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </div>
                            )}

                            {!brand.useSMTP && (
                                <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl flex gap-3">
                                    <AlertCircle size={18} className="text-zinc-500 shrink-0" />
                                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                                        Get your API key from <a href="https://resend.com" target="_blank" className="text-blue-500 hover:underline">Resend.com</a>. By default, you can only send to your own email until you verify a domain.
                                    </p>
                                </div>
                            )}
                        </div>
                    </SettingSection>
                </div>

                {/* Right: Sidebar Settings */}
                <div className="space-y-8">
                    <SettingSection title="Visual Branding" icon={<Palette size={18} />}>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Primary Theme Color</p>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-xl border border-zinc-200 shadow-inner"
                                        style={{ backgroundColor: brand.primaryColor || '#A22C29' }}
                                    />
                                    <div className="flex-1 relative">
                                        <input
                                            type="text"
                                            value={brand.primaryColor || '#A22C29'}
                                            onChange={e => setBrand({ ...brand, primaryColor: e.target.value })}
                                            className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm font-mono uppercase focus:border-zinc-400 outline-none"
                                        />
                                        <input
                                            type="color"
                                            value={brand.primaryColor || '#A22C29'}
                                            onChange={e => setBrand({ ...brand, primaryColor: e.target.value })}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 border-none bg-transparent cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Business Logo</p>
                                <div className="aspect-square bg-zinc-50 border border-zinc-200 rounded-3xl flex items-center justify-center overflow-hidden group relative transition-all hover:border-zinc-300">
                                    {brand.logoUrl ? (
                                        <img src={brand.logoUrl} className="w-full h-full object-contain p-6" alt="Logo" />
                                    ) : (
                                        <div className="text-zinc-300 flex flex-col items-center gap-2">
                                            <Upload size={24} />
                                            <span className="font-bold uppercase text-[10px] tracking-widest">Upload Logo</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="logo-settings-upload"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    setBrand({ ...brand, logoUrl: reader.result });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor="logo-settings-upload"
                                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-widest gap-2 cursor-pointer backdrop-blur-sm"
                                    >
                                        <Upload size={14} />
                                        {brand.logoUrl ? "Change Logo" : "Upload File"}
                                    </label>
                                </div>
                                {brand.logoUrl && (
                                    <button
                                        onClick={() => setBrand({ ...brand, logoUrl: "" })}
                                        className="w-full py-2 text-[10px] text-red-500 font-bold uppercase tracking-wider hover:bg-red-50 rounded-lg transition-all"
                                    >
                                        Remove Logo
                                    </button>
                                )}
                            </div>
                        </div>
                    </SettingSection>

                    <SettingSection title="System Status" icon={<ShieldCheck size={18} />}>
                        <div className="space-y-3">
                            <StatusItem
                                label="Shopify Connection"
                                active={!!(brand.shopifyStoreUrl && brand.shopifyAccessToken && brand.websiteType === "shopify")}
                                status={brand.websiteType === "shopify" ? (brand.shopifyAccessToken ? "Connected" : "Setup Required") : "N/A (Manual)"}
                            />
                            <StatusItem
                                label="WhatsApp API"
                                active={true}
                                status="Managed Globally"
                            />
                            <StatusItem
                                label="Google Reviews"
                                active={!!brand.googlePlaceId}
                                status={brand.googlePlaceId ? "Configured" : "Pending"}
                            />
                            <StatusItem
                                label="Email Service"
                                active={!!brand.resendApiKey}
                                status={brand.resendApiKey ? "Ready" : "Not Configured"}
                            />

                            <div className="pt-4 mt-4 border-t border-zinc-100">
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold text-zinc-900">Active Status</p>
                                        <p className="text-[10px] text-zinc-500">Enable or disable all messaging.</p>
                                    </div>
                                    <div
                                        onClick={() => setBrand({ ...brand, isActive: !brand.isActive })}
                                        className={cn(
                                            "w-11 h-6 rounded-full transition-all relative",
                                            brand.isActive ? "bg-zinc-900" : "bg-zinc-200"
                                        )}
                                    >
                                        <div className={cn(
                                            "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                                            brand.isActive ? "left-6" : "left-1"
                                        )} />
                                    </div>
                                </label>
                            </div>
                        </div>
                    </SettingSection>
                </div>
            </div>
        </div>
    );
}

function SettingSection({ title, description, icon, children }) {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="mb-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-600 border border-zinc-100 shadow-sm shrink-0">
                    {icon}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-zinc-900 leading-none mb-1.5">{title}</h3>
                    {description && <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>}
                </div>
            </div>
            {children}
        </div>
    );
}

function InputGroup({ label, value, onChange, placeholder, disabled = false, type = "text", autoComplete }) {
    return (
        <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest ml-0.5">{label}</label>
            <input
                type={type}
                value={value || ""}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                autoComplete={autoComplete}
                className="w-full h-12 bg-zinc-50/50 border border-zinc-200 rounded-xl px-4 outline-none focus:border-zinc-400 focus:bg-white transition-all text-sm font-medium disabled:bg-zinc-100 disabled:text-zinc-400 disabled:cursor-not-allowed"
            />
        </div>
    );
}

function StatusItem({ label, status, active = false }) {
    return (
        <div className="flex items-center justify-between p-3.5 bg-zinc-50/50 border border-zinc-100 rounded-2xl">
            <span className="text-[11px] font-semibold text-zinc-600">{label}</span>
            <div className="flex items-center gap-2">
                <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    active ? "text-green-600" : "text-zinc-400"
                )}>{status}</span>
                <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    active ? "bg-green-500" : "bg-zinc-300"
                )} />
            </div>
        </div>
    );
}
