const { cmd } = require('../command')
const config = require('../config')
const axios = require('axios')
const fs = require("fs")

cmd({
    pattern: "alive",
    react: "🎃",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
},
async (nethmina, mek, m, { from, quoted, reply }) => {
    try {
        // 1. Send Audio (Original logic without FFmpeg dependency issues)
        const audioUrl = 'https://github.com/Nethmina-dev/BOT-DATA/raw/refs/heads/main/Voice-notes/alive.mp3';
        await nethmina.sendMessage(from, {
            audio: { url: audioUrl },
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: mek });

        // 2. Prepare Buttons
        const buttons = [
            { buttonId: '.ping', buttonText: { displayText: '⚡ CHECK PING' }, type: 1 },
            { buttonId: '.menu', buttonText: { displayText: '📜 GET MENU' }, type: 1 }
        ]

        // 3. Button Message Structure
        const buttonMessage = {
            image: { url: config.ALIVE_IMG },
            caption: config.ALIVE_MSG || "I am Alive Now! 🤖",
            footer: "> Powered by NETHMINA-OFC",
            buttons: buttons,
            headerType: 4
        }

        // 4. Send Message
        await nethmina.sendMessage(from, buttonMessage, { quoted: mek });

        // 5. Send Video Note (Optional - as in your original code)
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
