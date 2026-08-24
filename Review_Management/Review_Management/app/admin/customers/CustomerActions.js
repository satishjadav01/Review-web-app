"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, CheckCircle2, AlertCircle, Loader2, Mail } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

export default function CustomerActions({ customerId, phone, email, orderId, brandId, brandSlug, brandName, reviewMessageTemplate, name, whatsappSent, emailSent, isWhatsAppConfigured }) {
    const [status, setStatus] = useState("idle"); // idle | sending | sent | error
    const [lastMethod, setLastMethod] = useState(null);
    const router = useRouter();

    const hasValidPhone = phone && phone.trim().length > 3 && phone !== "undefined";

    const handleSend = async (method) => {
        setStatus("sending");
        setLastMethod(method.includes('whatsapp') ? 'whatsapp' : method);
        const toastId = toast.loading(`Sending request via ${method}...`);

        try {
            // Automated logic
            const apiMethod = method === 'whatsapp-api' ? 'whatsapp' : method;

            const res = await axios.post("/api/send-review-link", {
                brandId,
                phone,
                email,
                name,
                orderId,
                preferredMethod: apiMethod
            });

            if (res.data.sent) {
                setStatus("sent");
                toast.success(`Request sent successfully via ${apiMethod === 'whatsapp' ? 'WhatsApp API' : 'Email'} ✓`, {
                    id: toastId,
                    duration: 5000,
                });
                router.refresh();
                return;
            }

            // Direct WhatsApp Web / App Fallback
            if (method.includes('whatsapp') && hasValidPhone) {
                const cleanPhone = phone.replace(/\D/g, "");
                const reviewUrl = res.data.link || `${window.location.origin}/r/${brandSlug || brandId}`;
                const msg = res.data.message || `Hi ${name || 'there'}! Please share your review for order #${orderId} with ${brandName || 'us'}: ${reviewUrl}`;
                const waUrl = res.data.directWhatsAppUrl || `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodeURIComponent(msg)}`;

                window.open(waUrl, "_blank");
                await axios.post("/api/admin/customers/track-send", { orderId, brandId, customerId, method: "whatsapp" });

                setStatus("sent");
                toast.success("Opening WhatsApp with pre-filled message ✓", { id: toastId, duration: 4000 });
                router.refresh();
                return;
            }

            // Direct Email client Fallback
            if (method === 'email' && email) {
                const reviewUrl = res.data.link || `${window.location.origin}/r/${brandSlug || brandId}`;
                const subject = encodeURIComponent(`Share your feedback for Order #${orderId} - ${brandName || 'Review'}`);
                const bodyMsg = `Hi ${name || 'there'}!\n\nThank you for your order #${orderId}.\n\nPlease click the link below to share your review:\n${reviewUrl}\n\nThank you!`;

                window.location.href = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(bodyMsg)}`;
                await axios.post("/api/admin/customers/track-send", { orderId, brandId, customerId, method: "email" });

                setStatus("sent");
                toast.success("Opening Email client with review link ✓", { id: toastId, duration: 4000 });
                router.refresh();
                return;
            }

            setStatus("idle");
            toast.error("Could not send review request.", { id: toastId });
        } catch (err) {
            console.warn("Send warning:", err?.message || err);
            // Even on error, provide direct WhatsApp / mailto fallback
            if (method.includes('whatsapp') && hasValidPhone) {
                const cleanPhone = phone.replace(/\D/g, "");
                const waUrl = `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodeURIComponent(`Hi! Please leave a review for order #${orderId}: ${window.location.origin}`)}`;
                window.open(waUrl, "_blank");
                setStatus("sent");
                toast.success("Opening WhatsApp...", { id: toastId });
            } else if (method === 'email' && email) {
                window.location.href = `mailto:${email}?subject=Order%20Review&body=Please%20leave%20your%20review`;
                setStatus("sent");
                toast.success("Opening Email app...", { id: toastId });
            } else {
                setStatus("error");
                toast.error("Failed to process request", { id: toastId });
                setTimeout(() => setStatus("idle"), 3000);
            }
        }
    };

    return (
        <div className="flex items-center justify-end gap-3">
            {status === "sending" && (
                <div className="flex items-center gap-2 text-sm text-zinc-400 font-medium">
                    <Loader2 size={13} className="animate-spin" />
                    <span>Sending...</span>
                </div>
            )}

            {status === "sent" && (
                <div className={cn(
                    "flex items-center gap-1.5 text-sm font-bold uppercase tracking-tighter",
                    lastMethod === 'email' ? "text-blue-600" : "text-green-600"
                )}>
                    <CheckCircle2 size={14} />
                    {lastMethod === 'email' ? "Sent Email" : "Sent WhatsApp"}
                </div>
            )}

            {status === "error" && (
                <div className="flex items-center gap-1.5 text-sm font-bold text-red-500">
                    <AlertCircle size={14} />
                    Failed
                </div>
            )}

            {status === "idle" && (
                <>
                    {hasValidPhone && !whatsappSent && (
                        <button
                            onClick={() => handleSend('whatsapp-api')}
                            className={cn(
                                "flex items-center gap-1.5 text-sm font-bold text-zinc-900 transition-all font-inter",
                                isWhatsAppConfigured ? "hover:opacity-70" : "opacity-40 cursor-help"
                            )}
                            title={isWhatsAppConfigured ? "Send via WhatsApp Business API" : "WhatsApp API Credentials missing in Settings"}
                        >
                            <MessageSquare size={14} className={isWhatsAppConfigured ? "text-emerald-500" : "text-zinc-400"} />
                            <span className="hidden sm:inline">Whatsapp</span>
                        </button>
                    )}

                    {email && (
                        <button
                            onClick={() => handleSend('email')}
                            className={cn(
                                "flex items-center gap-1.5 text-sm font-bold text-zinc-900 hover:opacity-70 transition-all font-inter",
                                (hasValidPhone && !whatsappSent) && "border-l border-zinc-200 pl-3"
                            )}
                            title="Send Email"
                        >
                            <Mail size={14} className="text-blue-500" />
                            <span className="hidden sm:inline">Email</span>
                        </button>
                    )}

                    {(!hasValidPhone || whatsappSent) && !email && (
                        <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">
                            {whatsappSent ? "Sent WhatsApp" : "No Contact"}
                        </span>
                    )}
                </>
            )}
        </div>
    );
}
