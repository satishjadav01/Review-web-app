import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { customers, brandId } = await req.json();

        if (!customers || !Array.isArray(customers)) {
            return NextResponse.json({ error: "Invalid customer data" }, { status: 400 });
        }

        if (!brandId) {
            return NextResponse.json({ error: "Brand ID is required" }, { status: 400 });
        }

        const validCustomers = customers
            .filter(c => c.phone && c.orderId)
            .map(c => {
                let cleanPhone = String(c.phone).trim();

                // Handle Scientific Notation (e.g., 9.19727E+11) from Excel
                if (cleanPhone.includes("E+") || cleanPhone.includes("e+")) {
                    cleanPhone = Number(cleanPhone).toLocaleString('fullwide', { useGrouping: false });
                }

                // Remove all non-numeric characters
                cleanPhone = cleanPhone.replace(/\D/g, "");

                return {
                    brandId,
                    name: c.name || "Anonymous",
                    email: c.email || "",
                    phone: cleanPhone,
                    orderId: String(c.orderId).trim(),
                };
            })
            .filter(c => c.phone.length >= 10);

        if (validCustomers.length === 0) {
            return NextResponse.json({ error: "No valid customers to import" }, { status: 400 });
        }

        const result = await prisma.customer.createMany({
            data: validCustomers,
            skipDuplicates: true,
        });

        return NextResponse.json({
            success: true,
            count: result.count,
            message: `Successfully imported ${result.count} customers.`
        });

    } catch (error) {
        console.error("Import error:", error);
        return NextResponse.json({ error: "Failed to import customers: " + error.message }, { status: 500 });
    }
}
