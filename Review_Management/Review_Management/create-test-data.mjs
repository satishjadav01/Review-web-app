import "dotenv/config";
import prisma from "./lib/prisma.js";

async function run() {
  // 1. Create a new brand using Prisma
  const brand = await prisma.brand.create({
    data: {
      name: "Acme Corp WhatsApp Test",
      websiteType: "other",
      googlePlaceId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
      slug: "acme-corp-wa-test-" + Date.now(),
    },
  });
  console.log("Created brand:", brand.id);

  // 2. Call the local API to create customer and send WhatsApp
  console.log("Calling send-review-link API...");
  try {
    const response = await fetch("http://localhost:8018/api/send-review-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        brandId: brand._id.toString(),
        orderId: "TEST-" + Math.floor(Math.random() * 10000),
        phone: "917043238504",
        email: "customer@example.com",
        name: "Test Customer",
        preferredMethod: "whatsapp",
      }),
    });

    const data = await response.json();
    console.log("API Result:", data);
  } catch (e) {
    console.error("API Call Failed:", e);
  }

  process.exit(0);
}

run();
