const { cmd } = require('../command');
const config = require('../config');
const axios = require('axios');

cmd({
    pattern: "alive",
    alias: ["bot", "robo", "robot"],
    react: "🎃",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
},
async (nethmina, mek, m, {
    from,
    quoted,
    reply
}) => {
    try {
        // Bot recording presence
        await nethmina.sendPresenceUpdate('recording', from);

        // Download voice note from GitHub
        const audioUrl = "https://github.com/Nethmina-dev/BOT-DATA/raw/refs/heads/main/Voice-notes/alive.opus";
        const response = await axios.get(audioUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);

        // Send voice note
        await nethmina.sendMessage(from, {
            audio: buffer,
            mimetype: 'audio/opus',
            ptt: true
        }, { quoted: mek });

        // Send image + caption
        await nethmina.sendMessage(from, {
            image: { url: config.ALIVE_IMG },
            caption: config.ALIVE_MSG
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});
