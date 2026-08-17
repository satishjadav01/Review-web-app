const axios = require('axios');
const token = 'EAAL5MQL95cQBPsuxe7fp0jsL0FQ9caiYxfVxoGUUbgJcjYDRfQay4ST2mIGAqDMYNlzMZCUMwpoMOuTpx2KTsk1GHyvhM2yHD8ZAUjGrSTkZC9vwa2qlYqqpZBo9bYI0a3JBRlo4nvc2F9awOMqWHeyQuOUURTZAQGVKMYTDHHXkaafc5u9cCexhslwa26zd9FgZDZD';
const phoneNumberId = '170179492839259';

async function testTxt() {
    try {
        const url = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;
        const response = await axios.post(
            url,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: "917043238504",
                type: "text",
                text: {
                    preview_url: true,
                    body: "Hello! This is a test text message from the Meta API."
                }
            },
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
        console.log("Success text:", response.data);
    } catch (error) {
        console.error("WhatsApp API Error:", error.response?.data || error.message);
    }
}
testTxt();
