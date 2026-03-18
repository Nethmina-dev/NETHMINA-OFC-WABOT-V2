const config = require('../config')
const { cmd, commands } = require('../command')
const axios = require('axios')

// Gemini API Key
const GEMINI_API_KEY = "AIzaSyChqVNBwlTbGsJvZ4-qzxYbXqlG2Pf3N8A";

cmd({
    pattern: "topup_logic",
    desc: "Auto reply for TopUp Store",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, reply }) => {
    try {
        // ❌ Remove isCmd check, allow AI to reply to normal messages
        const userMsg = body;
        if (!userMsg) return;

        const systemPrompt = `
        You are a friendly, fast, and helpful Customer Support AI Bot for an Online TopUp Store in Sri Lanka. 
        Your goal is to guide customers to buy game top-ups.

        **Business Info:**
        - Free Fire: 100 Diamonds = Rs.350, 210 Diamonds = Rs.700.
        - PUBG: 60 UC = Rs.380.
        - Bank: BOC / Account: 12345678 / Name: A. Perera.

        **Instructions:**
        1. Speak in the same language as the customer (Sinhala, Singlish, or English).
        2. Give price lists when they ask.
        3. Ask for Player ID & In-game name.
        4. Provide bank details for payment.
        5. Ask for a payment screenshot.

        Customer Message: ${userMsg}
        `;

        const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
            contents: [{ parts: [{ text: systemPrompt }] }]
        });

        const aiReply = response.data.candidates[0].content.parts[0].text;
        return reply(aiReply);

    } catch (e) {
        console.log("Error in TopUp Bot:", e);
        reply("⚠️ Sorry, AI is temporarily unavailable.");
    }
})
