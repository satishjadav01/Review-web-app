"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, Lock, User, Key, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export default function SuperRegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        secretKey: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading("Creating Super Admin...");

        try {
            await axios.post("/api/auth/register-super", formData);
            toast.success("Account created successfully", {
                id: toastId,
            });
            router.push("/login");
        } catch (error) {
            toast.error("Registration failed", {
                id: toastId,
                description: error.response?.data?.error || "Invalid secret key or server error.",
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 font-sans text-zinc-900">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 font-bold text-2xl tracking-tight mb-8">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center overflow-hidden bg-zinc-100 shadow-md shadow-black/5">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={44}
                                height={44}
                                className="w-full h-full object-contain"
                                priority
                            />
                        </div>
                        Review
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Setup Super Admin</h1>
                    <p className="text-zinc-500 text-sm">Configure the master account for Review</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-700 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-all text-sm"
                                    placeholder="Jane Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-700 ml-1">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-all text-sm"
                                    placeholder="admin@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-700 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-all text-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-700 ml-1">System Secret Key</label>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                <input
                                    type="password"
                                    value={formData.secretKey}
                                    onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900 transition-all text-sm"
                                    placeholder="Enter AUTH_SECRET"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-zinc-900 text-white py-3 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                <>
                                    Create Account
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
