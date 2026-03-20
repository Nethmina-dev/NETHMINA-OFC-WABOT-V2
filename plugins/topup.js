const axios = require("axios");
const config = require("../config");
const { addReplyHandler } = require("../command");

// Memory
let userMemory = {};

addReplyHandler(
    // 🔍 FILTER → which messages should trigger AI
    async (text, { sender }) => {
        if (!text) return false;

        // ❌ ignore commands
        if (text.startsWith(".")) return false;

        return true; // all normal messages trigger AI
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
    }
);        });

        // Limit memory (last 5 messages)
        userMemory[from] = userMemory[from].slice(-5);

        // --- SYSTEM PROMPT ---
        const systemPrompt = `
You are a friendly WhatsApp AI assistant for a Gaming TopUp Store in Sri Lanka.

Rules:
- Reply short, clear, and helpful
- Speak Sinhala / English / Singlish based on user
- Focus on selling and helping

Store Info:
Free Fire:
100 Diamonds = Rs.350
210 Diamonds = Rs.700

PUBG:
60 UC = Rs.380

Payment:
Bank: BOC
Account: 12345678
Name: A. Perera

Flow:
1. Ask game name
2. Ask Player ID
3. Tell price
4. Give payment details
5. Ask for payment screenshot
`;

        // --- Build Gemini request format ---
        const contents = [
            {
                role: "user",
                parts: [{ text: systemPrompt }]
            },
            ...userMemory[from].map(msg => ({
                role: "user",
                parts: [{ text: msg.text }]
            }))
        ];

        // --- API CALL ---
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                contents: contents
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        // --- SAFE RESPONSE EXTRACTION ---
        const aiReply =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
            "⚠️ Server busy. Please try again.";

        // Save bot reply in memory
        userMemory[from].push({
            role: "bot",
            text: aiReply
        });

        // --- SEND REPLY ---
        return reply(aiReply);

    } catch (error) {
        console.log("AI BOT ERROR:", error?.response?.data || error.message);

        return reply("⚠️ AI service error. Try again later.");
    }
});
