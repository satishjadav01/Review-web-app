"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight, Loader2, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const toastId = toast.loading("Signing in...");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                toast.error("Invalid credentials", {
                    id: toastId,
                });
                setIsLoading(false);
            } else {
                toast.success("Welcome back", {
                    id: toastId,
                });
                router.push("/admin");
            }
        } catch (error) {
            toast.error("Something went wrong", { id: toastId });
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#D6D5C9] flex flex-col items-center justify-center p-6 font-sans text-black">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-3 font-bold text-2xl tracking-tight mb-8 hover:scale-[1.02] transition-transform">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden bg-white shadow-lg shadow-black/10">
                            <Image
                                src="/logo.png"
                                alt="Logo"
                                width={48}
                                height={48}
                                className="w-full h-full object-contain"
                                priority
                            />
                        </div>
                        Review
                    </Link>
                    <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
                    <p className="text-black/60 text-sm">Sign in to manage your reputation.</p>
                </div>

                <div className="bg-white border border-[#B9BAA3] rounded-2xl p-7 sm:p-8 shadow-[0_24px_60px_rgba(0,0,0,.12)]">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-black/75 ml-1">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-black/45" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-[#D6D5C9]/45 border border-[#B9BAA3] rounded-xl pl-12 pr-4 py-3.5 outline-none transition-all text-sm text-black placeholder:text-black/40"
                                    placeholder="admin@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-semibold text-black/75">Password</label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-black/45" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#D6D5C9]/45 border border-[#B9BAA3] rounded-xl pl-12 pr-4 py-3.5 outline-none transition-all text-sm text-black placeholder:text-black/40"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#A22C29] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-[#902923] hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                                <>
                                    Sign In
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-black/60 text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register-super" className="text-[#A22C29] font-semibold hover:text-[#902923] hover:underline">
                        Set up Super Admin
                    </Link>
                </p>
            </div>
        </div>
    );
}
