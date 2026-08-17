const axios = require('axios');
const token = 'EAAL5MQL95cQBPsuxe7fp0jsL0FQ9caiYxfVxoGUUbgJcjYDRfQay4ST2mIGAqDMYNlzMZCUMwpoMOuTpx2KTsk1GHyvhM2yHD8ZAUjGrSTkZC9vwa2qlYqqpZBo9bYI0a3JBRlo4nvc2F9awOMqWHeyQuOUURTZAQGVKMYTDHHXkaafc5u9cCexhslwa26zd9FgZDZD';
const phoneNumberId = '170179492839259';

async function trySend(components, desc) {
    try {
        const payload = {
            messaging_product: "whatsapp",
            to: "918320809561",
            type: "template",
            template: {
                name: "tempp",
                language: { code: "en_US" }
            }
        };
        if (components !== null) {
            payload.template.components = components;
        }

        const res = await axios.post(
            `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
            payload,
            { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        console.log(`[SUCCESS] ${desc}:`, res.data);
    } catch (e) {
        let err = e.response ? JSON.stringify(e.response.data.error.message) : e.message;
        console.log(`[FAILED] ${desc}:`, err);
    }
}

async function start() {
    await trySend(null, "NO components key at all");
    // Body params
    await trySend([{ type: "body", parameters: [{ type: "text", text: "Param1" }] }], "1 body");
    await trySend([{ type: "body", parameters: [{ type: "text", text: "Param1" }, { type: "text", text: "Param2" }] }], "2 body");
    await trySend([{ type: "body", parameters: [{ type: "text", text: "Param1" }, { type: "text", text: "Param2" }, { type: "text", text: "Param3" }] }], "3 body params");
    await trySend([{ type: "body", parameters: [{ type: "text", text: "Param1" }, { type: "text", text: "Param2" }, { type: "text", text: "Param3" }, { type: "text", text: "Param4" }] }], "4 body params");

    // Header parameter
    await trySend([
        { type: "header", parameters: [{ type: "image", image: { link: "https://example.com/a.jpg" } }] }
    ], "1 header param image");

    // Header + Body
    await trySend([
        { type: "header", parameters: [{ type: "image", image: { link: "https://example.com/a.jpg" } }] },
        { type: "body", parameters: [{ type: "text", text: "BodyVal" }] }
    ], "1 header + 1 body");
}
start();
