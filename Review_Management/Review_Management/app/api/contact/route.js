import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, phone, message, plan } = body;

        // Basic validation
        if (!name || !email || !phone || !plan) {
            return NextResponse.json(
                { error: "Name, email, phone, and plan are required." },
                { status: 400 }
            );
        }

        const newRequest = await prisma.contactRequest.create({
            data: {
                name,
                email,
                phone,
                message,
                plan,
            },
        });

        return NextResponse.json(
            { message: "Request submitted successfully", id: newRequest.id },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error submitting contact request:", error);
        return NextResponse.json(
            { error: "Failed to submit request" },
            { status: 500 }
        );
    }
}