import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req, { params }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { name, phone, orderId, brandId } = await req.json();

        let customer = null;

        if (id) {
            customer = await prisma.customer.findUnique({
                where: { id }
            });
        }

        if (!customer && phone && brandId) {
            customer = await prisma.customer.findFirst({
                where: { phone, brandId }
            });
        }

        if (!customer) {
            if (!brandId || !orderId) {
                return NextResponse.json({ error: "Missing required fields for customer creation" }, { status: 400 });
            }
            customer = await prisma.customer.create({
                data: {
                    brandId,
                    phone,
                    orderId,
                    name: name || null,
                }
            });
        } else {
            if (session.user.role !== "super_admin" && customer.brandId !== session.user.brandId) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            }

            const updateData = {};
            if (name) updateData.name = name;
            if (phone) updateData.phone = phone;
            if (orderId) updateData.orderId = orderId;

            customer = await prisma.customer.update({
                where: { id: customer.id },
                data: updateData
            });
        }

        return NextResponse.json({ success: true, customer: { ...customer, _id: customer.id } });
    } catch (error) {
        console.error("PATCH Customer Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const session = await auth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        if (id) {
            const customer = await prisma.customer.findUnique({
                where: { id }
            });

            if (customer) {
                if (session.user.role !== "super_admin" && customer.brandId !== session.user.brandId) {
                    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
                }
                await prisma.customer.delete({
                    where: { id }
                });
            }
        }

        return NextResponse.json({ success: true, message: "Customer removed from view" });
    } catch (error) {
        console.error("DELETE Customer Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
