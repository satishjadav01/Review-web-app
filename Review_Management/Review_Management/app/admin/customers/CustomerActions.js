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

            // Fallback for email
            if (method === 'email' && email) {
                const error = res.data.emailError || "Failed to send email";
                toast.error(`Automated send failed: ${error}`, { duration: 6000 });

                const subject = encodeURIComponent(`Review your order #${orderId}`);
                const reviewLink = `${window.location.protocol}//${window.location.host}/r/${brandSlug || brandId}`;
                const finalMsg = `Hi! Please leave your feedback for order #${orderId}: ${reviewLink}`;
                window.location.href = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(finalMsg)}`;

                await axios.post("/api/admin/customers/track-send", { orderId, brandId, customerId, method: "email" });

                setStatus("sent");
                toast.info("Opening Email app...", { id: toastId });
                router.refresh();
            } else if (method === 'whatsapp-api') {
                setStatus("idle");
                const errorMsg = res.data.whatsappError
                    ? `WhatsApp API: ${res.data.whatsappError}`
                    : "WhatsApp API failed: Ensure Meta Cloud credentials are setup in Settings.";
                toast.error(errorMsg, { id: toastId, duration: 6000 });
            } else {
                setStatus("idle");
                toast.error(`Automated send failed.`, { id: toastId });
            }
        } catch (err) {
            console.error("Send error:", err);
            setStatus("error");
            toast.error("Failed to process request", { id: toastId });
            setTimeout(() => setStatus("idle"), 3000);
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
