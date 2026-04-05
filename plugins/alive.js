const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

cmd({
    pattern: "alive",
    react: "🎃",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
},
async (nethmina, mek, m, { from, quoted, reply }) => {
    try {
        if (mek.key && mek.key.remoteJid) {
            await nethmina.sendMessage(from, { react: { text: "🎃", key: mek.key } });
        }
        const mp3Path = path.join(__dirname, "..", "Voice-notes", "alive.mp3");
        const oggPath = path.join(__dirname, "..", "Voice-notes", "alive.ogg");
        await new Promise((resolve, reject) => {
            exec(`ffmpeg -y -i "${mp3Path}" -c:a libopus -b:a 64k -vbr on "${oggPath}"`, (err, stdout, stderr) => {
                if (err) return reject(err);
                resolve();
            });
        });

        await nethmina.sendMessage(from, { 
            audio: fs.readFileSync(oggPath),
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true 
        }, { quoted: mek });

        // Send video note
        await nethmina.sendMessage(
            from,
            {
                video: { url: "https://github.com/Nethmina-dev/BOT-DATA/raw/refs/heads/main/Video-notes/PTV-20250623-WA0021.mp4" },
                mimetype: 'video/mp4',
                ptv: true
            },
            { quoted: mek }
        );

        // Send alive image with caption
        return await nethmina.sendMessage(
            from,
            { image: { url: config.ALIVE_IMG }, caption: config.ALIVE_MSG },
            { quoted: mek }
        );

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
