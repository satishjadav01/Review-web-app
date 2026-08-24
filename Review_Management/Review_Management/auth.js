import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "review-management-secret-key-fallback-dev",
    trustHost: true,
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    });

                    if (user && user.password) {
                        const isPasswordCorrect = await bcrypt.compare(
                            credentials.password,
                            user.password
                        );

                        if (isPasswordCorrect) {
                            return {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                role: user.role,
                                brandId: user.brandId ? user.brandId : null,
                            };
                        }
                    }
                } catch (dbErr) {
                    console.warn("Database lookup warning during login:", dbErr?.message || dbErr);
                }

                // Check runtime memory users (for newly created brands)
                if (globalThis.__RUNTIME_USERS && globalThis.__RUNTIME_USERS.has(credentials.email)) {
                    const runtimeUser = globalThis.__RUNTIME_USERS.get(credentials.email);
                    if (runtimeUser.password === credentials.password) {
                        return {
                            id: runtimeUser.id || "u-runtime-" + Math.random().toString(36).substring(2, 9),
                            name: runtimeUser.name || "Brand Manager",
                            email: runtimeUser.email,
                            role: "brand_admin",
                            brandId: runtimeUser.brandId || null,
                        };
                    }
                }

                // Built-in credentials for Super Admin & all 3 Demo Brands
                if (credentials.email === "super@admin.com" && credentials.password === "admin123") {
                    return {
                        id: "00000000-0000-0000-0000-000000000001",
                        name: "Super Admin",
                        email: "super@admin.com",
                        role: "super_admin",
                        brandId: null,
                    };
                }

                // Brand 1: Zinc Lifestyle
                if ((credentials.email === "manager@brand.com" || credentials.email === "manager@zinc.com") && credentials.password === "brand123") {
                    return {
                        id: "00000000-0000-0000-0000-000000000002",
                        name: "Zinc Manager",
                        email: credentials.email,
                        role: "brand_admin",
                        brandId: "b1000000-0000-0000-0000-000000000001",
                    };
                }

                // Brand 2: Apex Fitness & Gear
                if (credentials.email === "manager@apex.com" && credentials.password === "apex123") {
                    return {
                        id: "00000000-0000-0000-0000-000000000003",
                        name: "Apex Manager",
                        email: "manager@apex.com",
                        role: "brand_admin",
                        brandId: "b2000000-0000-0000-0000-000000000002",
                    };
                }

                // Brand 3: Lumina Skincare
                if (credentials.email === "manager@lumina.com" && credentials.password === "lumina123") {
                    return {
                        id: "00000000-0000-0000-0000-000000000004",
                        name: "Lumina Manager",
                        email: "manager@lumina.com",
                        role: "brand_admin",
                        brandId: "b3000000-0000-0000-0000-000000000003",
                    };
                }

                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.brandId = user.brandId;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.role = token.role;
                session.user.brandId = token.brandId;
                session.user.id = token.id;
            }
            return session;
        },
    },
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
    },
});
