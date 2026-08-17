import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function DELETE(req, { params }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const review = await prisma.review.findUnique({
            where: { id }
        });

        if (!review) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        if (session.user.role !== "super_admin" && review.brandId !== session.user.brandId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await prisma.review.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: "Review deleted" });
    } catch (error) {
        console.error("DELETE Review Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
