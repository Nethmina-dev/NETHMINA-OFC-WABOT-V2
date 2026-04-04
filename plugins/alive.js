const { cmd } = require('../command')
const config = require('../config')
const axios = require('axios')
const fs = require("fs")

cmd({
    pattern: "alive",
    react: "🎃",
    desc: "Check bot online status with Ad Card and 1,2 Reply Support.",
    category: "main",
    filename: __filename
},
async (nethmina, mek, m, { from, reply }) => {
    try {
        // 1. Voice Note එක යැවීම
        const audioUrl = 'https://github.com/Nethmina-dev/BOT-DATA/raw/refs/heads/main/Voice-notes/alive.mp3';
        await nethmina.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: mek });

        // 2. Caption එක (මෙතන "ALIVE NOW" කියන වචනය අනිවාර්යයෙන්ම තියෙන්න ඕනේ index.js එකට අඳුරගන්න)
        const aliveMsg = `👋 *HELLO, I AM ALIVE NOW!*

${config.ALIVE_MSG || "I am NETHMINA-OFC WhatsApp Bot."}

*Reply with a number to navigate:*
1️⃣ *Check Ping ⚡*
2️⃣ *Get Menu 📜*

> Powered by Nethmina-dev`;

        // 3. Ad Card එක සමඟ මැසේජ් එක යැවීම
        await nethmina.sendMessage(from, {
            image: { url: config.ALIVE_IMG },
            caption: aliveMsg,
            contextInfo: {
                externalAdReply: {
                    title: "🤖 NETHMINA-OFC WA-BOT ONLINE",
                    body: "Status: Active & Running 🚀",
                    mediaType: 1,
                    sourceUrl: "https://github.com/Nethmina-dev",
                    thumbnailUrl: config.ALIVE_IMG,
                    renderLargerThumbnail: true,
                    showAdAttribution: true
                }
            }
        }, { quoted: mek });

        // 4. Video Note එක (Optional)
        await nethmina.sendMessage(from, {
            video: { url: "https://github.com/Nethmina-dev/BOT-DATA/raw/refs/heads/main/Video-notes/PTV-20250623-WA0021.mp4" },
            mimetype: 'video/mp4',
            ptv: true
        }, { quoted: mek });

    } catch (e) {
        console.error('Alive Error:', e);
        reply(`*Error:* ${e.message}`);
    }
});
