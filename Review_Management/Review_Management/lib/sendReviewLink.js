import prisma from "@/lib/prisma";
import { generateToken } from "@/lib/utils";
import { sendReviewEmail } from "@/lib/mail";
import { DEMO_BRANDS } from "@/lib/demoData";

// ── Send WhatsApp Message (Text mode to avoid template mismatch) ──
export async function sendWhatsAppReviewLink(toPhone, orderId, reviewToken, brand, fullReviewUrl) {
    const accessToken = brand.whatsappApiKey || process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = brand.whatsappPhoneNumberId || process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId) {
        console.error("❌ [WhatsApp] Missing credentials:", {
            hasToken: !!accessToken,
            phoneNumberId,
            brandName: brand.name
        });
        return { success: false, error: "Missing WhatsApp credentials (token or phone ID)" };
    }

    const waTemplateName = brand.whatsappTemplateName || process.env.WHATSAPP_TEMPLATE_NAME || "tempp";
    const languageCode = brand.whatsappTemplateLanguage || process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en_US";

    console.log(`🚀 [WhatsApp] Sending template: ${waTemplateName} to ${toPhone}`);

    const defaultEnMsg = `Hi there! 😊\n\nYour order #${orderId} has been delivered — we hope you’re loving it!\n\nIf you have a minute, we’d really appreciate your feedback.\nClick below to leave a quick review:\n\n⭐ ${fullReviewUrl}\n\nYour support means everything to us. Thank you! 💛`;

    // Priority sequence: 1. Specific language override, 2. Global brand template, 3. Hardcoded default
    const draftTemplate = brand.localizedWhatsappDrafts?.[languageCode] || brand.reviewMessageTemplate || defaultEnMsg;

    let customMessage = draftTemplate
        .replace("[[link]]", fullReviewUrl)
        .replace("[[brandName]]", brand.name)
        .replace("[[orderId]]", orderId);

    const payload = {
        messaging_product: "whatsapp",
        to: toPhone,
        type: "text",
        text: {
            body: customMessage
        }
    };
    try {
        const response = await fetch(
            `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            }
        );

        const result = await response.json();

        if (response.ok && result.messages?.[0]?.id) {
            console.log("✅ [WhatsApp] Success! Message ID:", result.messages[0].id);
            return {
                success: true,
                provider: "whatsapp_cloud",
                messageId: result.messages[0].id,
            };
        }

        let errorDetails = result.error?.message || "Unknown WhatsApp API error";
        if (result.error?.error_data?.details) {
            errorDetails = `(#${result.error.code}) ${result.error.error_data.details}`;
        }

        console.error("❌ [WhatsApp] API Error:", result.error);
        return { success: false, error: errorDetails };
    } catch (fetchError) {
        console.error("[WhatsApp] Fetch/network error:", fetchError);
        return { success: false, error: fetchError.message || "Network failure" };
    }
}

/**
 * Shared logic to generate and send a review link
 * @param {Object} params
 * @param {string} params.brandId
 * @param {string} params.orderId
 * @param {string} [params.phone]
 * @param {string} [params.email]
 * @param {string} [params.name]
 */
export async function processAndSendReviewLink({ brandId, orderId, phone, email, name, preferredMethod }) {
    let brand = null;
    try {
        brand = await prisma.brand.findUnique({
            where: { id: brandId }
        });
    } catch (e) {
        console.warn("Notice: Could not load brand from DB:", e?.message);
    }

    if (!brand) {
        brand = DEMO_BRANDS.find(b => b.id === brandId) || DEMO_BRANDS[0];
    }

    // 1. Resolve contact info and create/update customer
    let cleanPhone = phone ? phone.replace(/\D/g, "") : null;
    if (cleanPhone && cleanPhone.length === 10) {
        cleanPhone = "91" + cleanPhone;
    }

    if (!cleanPhone && !email) {
        throw new Error("A valid phone number or email is required.");
    }

    let customer = null;
    try {
        const conditions = [];
        if (cleanPhone) conditions.push({ phone: cleanPhone });
        if (email) conditions.push({ email });

        if (conditions.length > 0) {
            customer = await prisma.customer.findFirst({
                where: {
                    brandId: brand.id,
                    OR: conditions,
                },
            });
        }

        if (!customer) {
            customer = await prisma.customer.create({
                data: {
                    brandId: brand.id,
                    phone: cleanPhone || null,
                    email: email || null,
                    name: name || "Anonymous",
                    orderId,
                },
            });
        }
    } catch (dbErr) {
        customer = {
            id: "c-demo-" + (cleanPhone || email || Math.random().toString(36).substring(2, 8)),
            name: name || "Anonymous",
            phone: cleanPhone,
            email,
            orderId
        };
    }

    // 2. Resolve or create review link
    const token = generateToken ? generateToken() : Math.random().toString(36).substring(2, 10);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    let reviewLinkId = "l-demo-" + token;
    try {
        let reviewLinkDoc = await prisma.reviewLink.findFirst({
            where: {
                brandId: brand.id,
                orderId,
                customerId: customer.id,
            },
        });

        if (reviewLinkDoc) {
            reviewLinkDoc = await prisma.reviewLink.update({
                where: { id: reviewLinkDoc.id },
                data: {
                    token,
                    expiresAt,
                    isUsed: false,
                },
            });
            reviewLinkId = reviewLinkDoc.id;
        } else {
            reviewLinkDoc = await prisma.reviewLink.create({
                data: {
                    brandId: brand.id,
                    customerId: customer.id,
                    orderId,
                    token,
                    expiresAt,
                },
            });
            reviewLinkId = reviewLinkDoc.id;
        }
    } catch (dbErr) {
        // Proceed with in-memory token
    }

    const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:8018";
    const fullReviewUrl = `${appBaseUrl}/r/${token}`;
    const fallbackMessage = `Hi ${name || 'there'}! 😊\n\nYour order #${orderId} with ${brand.name} has been delivered — we hope you’re loving it!\n\nIf you have a minute, we’d really appreciate your feedback.\nClick below to leave a quick review:\n\n⭐ ${fullReviewUrl}\n\nThank you! 💛`;

    const directWhatsAppUrl = cleanPhone
        ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(fallbackMessage)}`
        : null;

    let result = {
        success: true,
        sent: false,
        link: fullReviewUrl,
        message: fallbackMessage,
        directWhatsAppUrl,
        customerId: customer.id,
        reviewLinkId
    };

    // 3. Delivery Logic: Preference based, with fallback
    const tryWhatsApp = async () => {
        if (!cleanPhone) return { success: false, error: "No phone number" };
        const sendResult = await sendWhatsAppReviewLink(cleanPhone, orderId, token, brand, fullReviewUrl);
        if (sendResult.success) {
            return { success: true, provider: "whatsapp", messageId: sendResult.messageId };
        }
        return { success: false, error: sendResult.error };
    };

    const tryEmail = async () => {
        if (!email) return { success: false, error: "No email address" };
        const emailResult = await sendReviewEmail({
            to: email,
            brandName: brand.name,
            orderId,
            reviewUrl: fullReviewUrl,
            apiKey: brand.resendApiKey,
            fromEmail: brand.brandEmail,
            smtpConfig: {
                useSMTP: brand.useSMTP,
                host: brand.smtpHost,
                port: brand.smtpPort,
                user: brand.smtpUser,
                pass: brand.smtpPass
            },
            reviewMessageTemplate: brand.reviewMessageTemplate
        });
        if (emailResult.success) {
            return { success: true, provider: "email", messageId: emailResult.id };
        }
        return { success: false, error: emailResult.error };
    };

    if (preferredMethod === 'email' && email) {
        const eRes = await tryEmail();
        if (eRes.success) {
            await prisma.reviewLink.update({
                where: { id: reviewLinkDoc.id },
                data: { emailSent: true },
            });
            return { ...result, sent: true, provider: eRes.provider, messageId: eRes.messageId };
        }
        result.emailError = eRes.error;

        // Fallback to WhatsApp
        const wRes = await tryWhatsApp();
        if (wRes.success) {
            await prisma.reviewLink.update({
                where: { id: reviewLinkDoc.id },
                data: { whatsappSent: true },
            });
            return { ...result, sent: true, provider: wRes.provider, messageId: wRes.messageId };
        }
        result.waError = wRes.error;
    } else {
        // Default: WhatsApp first
        const wRes = await tryWhatsApp();
        if (wRes.success) {
            await prisma.reviewLink.update({
                where: { id: reviewLinkDoc.id },
                data: { whatsappSent: true },
            });
            return { ...result, sent: true, provider: wRes.provider, messageId: wRes.messageId };
        }
        result.waError = wRes.error;

        // Fallback to Email
        const eRes = await tryEmail();
        if (eRes.success) {
            await prisma.reviewLink.update({
                where: { id: reviewLinkDoc.id },
                data: { emailSent: true },
            });
            return { ...result, sent: true, provider: eRes.provider, messageId: eRes.messageId };
        }
        result.emailError = eRes.error;
    }

    return result;
}
