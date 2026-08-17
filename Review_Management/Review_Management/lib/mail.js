import { Resend } from 'resend';
import nodemailer from 'nodemailer';

export async function sendReviewEmail({
    to,
    brandName,
    orderId,
    reviewUrl,
    apiKey,
    fromEmail,
    smtpConfig,
    reviewMessageTemplate // Add this to params
}) {
    // ── SMTP FLOW ──
    if (smtpConfig && smtpConfig.useSMTP) {
        try {
            console.log(`📧 [SMTP] Attempting send to ${to} via ${smtpConfig.host}...`);
            const transporter = nodemailer.createTransport({
                host: smtpConfig.host,
                port: parseInt(smtpConfig.port) || 587,
                secure: smtpConfig.port == 465,
                auth: {
                    user: smtpConfig.user,
                    pass: smtpConfig.pass,
                },
            });

            const emailBody = reviewMessageTemplate
                ? reviewMessageTemplate.replace("[[orderId]]", orderId).replace("[[link]]", `<br/><br/><a href="${reviewUrl}" style="background-color: #111827; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; display: inline-block;">Yes, I'll help!</a>`)
                : `Hi! Your recent purchase from <strong>${brandName}</strong> means a lot to us. Could you spare 30 seconds to share your thoughts? It helps us improve and helps others decide!`;

            await transporter.sendMail({
                from: `"${brandName}" <${smtpConfig.user}>`,
                to,
                replyTo: fromEmail || smtpConfig.user,
                subject: `One quick favor? (Order #${orderId})`,
                html: `
                    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 550px; margin: 40px auto; padding: 40px; border: 1px solid #f3f4f6; border-radius: 24px; background-color: #ffffff; text-align: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);">
                        <div style="margin-bottom: 24px;">
                            <span style="font-size: 40px;">⭐</span>
                        </div>
                        <h1 style="color: #111827; font-size: 24px; font-weight: 800; margin-bottom: 12px; letter-spacing: -0.025em;">How did we do?</h1>
                        <p style="color: #6b7280; line-height: 1.6; font-size: 16px; margin-bottom: 32px; white-space: pre-line;">
                            ${emailBody}
                        </p>
                        <div style="margin: 32px 0;">
                            <a href="${reviewUrl}" style="background-color: #111827; color: #ffffff; padding: 16px 36px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); transition: all 0.2s ease;">
                                Yes, I'll help!
                            </a>
                        </div>
                        <p style="color: #9ca3af; font-size: 13px; margin-top: 40px; border-top: 1px solid #f3f4f6; pt: 24px;">
                            Your order: <strong>#${orderId}</strong>
                        </p>
                    </div>
                `,
            });

            console.log("✅ [SMTP] Success!");
            return { success: true, id: 'smtp-' + Date.now() };
        } catch (smtpErr) {
            console.error("❌ [SMTP] Error:", smtpErr);
            return { success: false, error: `SMTP Error: ${smtpErr.message}` };
        }
    }

    // ── RESEND FLOW (Original) ──
    const finalApiKey = apiKey || process.env.RESEND_API_KEY;

    if (!finalApiKey) {
        console.warn("[Email] Missing API Key. Skipping email send.");
        return { success: false, error: "Email configuration missing" };
    }

    const resend = new Resend(finalApiKey);

    try {
        const emailBody = reviewMessageTemplate
            ? reviewMessageTemplate.replace("[[orderId]]", orderId).replace("[[link]]", `<br/><br/><a href="${reviewUrl}" style="background-color: #111827; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; display: inline-block;">Yes, I'll help!</a>`)
            : `Hi! Your recent purchase from <strong>${brandName}</strong> means a lot to us. Could you spare 30 seconds to share your thoughts? It helps us improve and helps others decide!`;

        const { data, error } = await resend.emails.send({
            from: fromEmail || 'MegaReview <onboarding@resend.dev>',
            to: [to],
            reply_to: fromEmail || undefined,
            subject: `One quick favor? (Order #${orderId})`,
            html: `
                <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 550px; margin: 40px auto; padding: 40px; border: 1px solid #f3f4f6; border-radius: 24px; background-color: #ffffff; text-align: center; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);">
                    <div style="margin-bottom: 24px;">
                        <span style="font-size: 40px;">⭐</span>
                    </div>
                    <h1 style="color: #111827; font-size: 24px; font-weight: 800; margin-bottom: 12px; letter-spacing: -0.025em;">How did we do?</h1>
                    <p style="color: #6b7280; line-height: 1.6; font-size: 16px; margin-bottom: 32px; white-space: pre-line;">
                        ${emailBody}
                    </p>
                    <div style="margin: 32px 0;">
                        <a href="${reviewUrl}" style="background-color: #111827; color: #ffffff; padding: 16px 36px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);">
                            Yes, I'll help!
                        </a>
                    </div>
                    <p style="color: #9ca3af; font-size: 13px; margin-top: 40px; border-top: 1px solid #f3f4f6; padding-top: 24px;">
                        Your order: <strong>#${orderId}</strong>
                    </p>
                </div>
            `,
        });

        if (error) {
            console.error("❌ [Email] Resend Error:", error);
            let errorMessage = error.message;
            // Common error: "onboarding@resend.dev" can only send to the signup email
            if (error.message?.includes('onboarding@resend.dev')) {
                errorMessage = "Resend restriction: 'onboarding@resend.dev' only allows sending to your own signup email. Please verify your domain in Resend to send to others.";
            }
            return { success: false, error: errorMessage };
        }

        console.log("✅ [Email] Success! Message ID:", data.id);
        return { success: true, id: data.id };
    } catch (err) {
        console.error("❌ [Email] Unexpected Error:", err);
        return { success: false, error: err.message };
    }
}
