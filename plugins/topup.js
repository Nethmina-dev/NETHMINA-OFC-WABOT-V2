const axios = require("axios");
const config = require("../config");
const { cmd } = require("../command");

// Memory
let userMemory = {};

cmd(
{
    // ❌ pattern නැහැ (IMPORTANT)
    pattern: null,

    // 🔍 FILTER (this is required)
    filter: (text, { sender }) => {
        if (!text) return false;

        // ❌ ignore commands
        if (text.startsWith(".")) return false;

        return true;
    },

    desc: "AI Auto Reply",
    category: "ai",
    filename: __filename
},

// ⚙️ FUNCTION
async (conn, mek, m, { from, body, reply }) => {
    try {
        const userMsg = body.trim();

        if (!userMemory[from]) userMemory[from] = [];

        userMemory[from].push(userMsg);
        userMemory[from] = userMemory[from].slice(-5);

        const systemPrompt = `
You are a WhatsApp AI assistant for a Gaming TopUp Store.

Reply short, friendly.

Prices:
Free Fire 100 Diamonds = Rs.350
PUBG 60 UC = Rs.380
`;

        const contents = [
            {
                role: "user",
                parts: [{ text: systemPrompt }]
            },
            ...userMemory[from].map(msg => ({
                role: "user",
                parts: [{ text: msg }]
            }))
        ];

        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.GEMINI_API_KEY}`,
            { contents },
            { headers: { "Content-Type": "application/json" } }
        );

        const aiReply =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Try again later.";

        return reply(aiReply);

    } catch (e) {
        console.log("AI ERROR:", e?.response?.data || e.message);
    }
});
