import Credentials from "next-auth/providers/credentials";

export default {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            // Authorize will be defined in the main auth.js to handle DB/Node logic
        }),
    ],
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "review-management-secret-key-fallback-dev",
    trustHost: true,
}




