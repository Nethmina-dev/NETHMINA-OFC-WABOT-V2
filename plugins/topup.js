const axios = require("axios");
const config = require("../config");
const { cmd } = require("../command");

// ✅ Memory (per user)
let userMemory = {};

console.log("✅ AI Plugin Loaded");

// REGISTER AS REPLY HANDLER
cmd({
    // ❌ pattern දාන්න එපා (VERY IMPORTANT)
    filter: (text, { sender }) => {
        console.log("📩 MESSAGE RECEIVED:", text);

        if (!text) return false;

        // ❌ ignore commands
        if (text.startsWith(".")) return false;

        // ❌ ignore very short messages
        if (text.length < 2) return false;

        return true;
    },

    desc: "AI Auto Reply",
    category: "ai",
    filename: __filename
},

// MAIN FUNCTION
async (conn, mek, m, { from, body, reply }) => {
    try {
        if (mek.key.fromMe) return; // ignore bot own messages

        const userMsg = body.trim();

        // ✅ Memory setup
        if (!userMemory[from]) userMemory[from] = [];
        userMemory[from].push(userMsg);
        userMemory[from] = userMemory[from].slice(-5);

        // ✅ System prompt
        const systemPrompt = `
You are a WhatsApp AI assistant for a Gaming TopUp Store in Sri Lanka.

Rules:
- Reply short, friendly, and helpful
- Speak Sinhala / English / Singlish based on user
- Focus on helping customer to buy

Prices:
Free Fire:
100 Diamonds = Rs.350
210 Diamonds = Rs.700

PUBG:
60 UC = Rs.380

Flow:
1. Ask game name
2. Ask Player ID
3. Tell price
4. Give payment details
5. Ask for payment screenshot
`;

        // ✅ Build messages for Gemini API
        const messages = [
            {
                role: "system",
                content: [{ type: "text", text: systemPrompt }]
            },
            ...userMemory[from].map(msg => ({
                role: "user",
                content: [{ type: "text", text: msg }]
            }))
        ];

        // ✅ API CALL
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta2/models/gemini-pro-preview:generate?key=${config.GEMINI_API_KEY}`,
            {
                prompt: { messages }
            },
            { headers: { "Content-Type": "application/json" } }
        );

        // ✅ Get AI reply safely
        let aiReply = response.data?.output?.messages?.find(m => m.type === "output_text")?.text
            || "⚠️ AI service busy. Try again later.";

        // Save bot reply in memory
        userMemory[from].push(aiReply);

        // ✅ Send reply
        return reply(aiReply);

    } catch (error) {
        console.log("❌ AI ERROR:", error?.response?.data || error.message);
        return reply("⚠️ AI service error. Try again later.");
    }
});
