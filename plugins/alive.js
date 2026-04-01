const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs'); // Local file read

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

        // Read local voice note
        const audioPath = './media/voice/alive.opus';
        const buffer = fs.readFileSync(audioPath);

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
