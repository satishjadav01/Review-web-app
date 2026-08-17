import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { name, email, password, secretKey } = await req.json();

        // Basic security to prevent random registration
        if (secretKey !== process.env.AUTH_SECRET) {
            console.log("[Registration] Unauthorized attempt with invalid secret key.");
            return NextResponse.json({ error: "Unauthorized registration" }, { status: 401 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            console.log(`[Registration] Signup attempt with existing email: ${email}`);
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "super_admin",
            },
        });

        console.log(`[Registration] Super Admin created: ${email}`);
        return NextResponse.json({ success: true, message: "Super Admin registered successfully" }, { status: 201 });
    } catch (error) {
        console.error("Super Admin Registration API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
