const { cmd } = require('../command')
const config = require('../config')
const axios = require('axios')
const fs = require("fs")
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

cmd({
    pattern: "alive",
    react: "🎃",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
},
async (nethmina, mek, m, { from, quoted, reply }) => {
    try {
        // 1. Send reaction
        if (mek.key) {
            await nethmina.sendMessage(from, { react: { text: "🎃", key: mek.key } });
        }

        const audioUrl = 'https://github.com/Nethmina-dev/BOT-DATA/raw/refs/heads/main/Voice-notes/alive.mp3';
        const timestamp = Date.now();
        const inputPath = `./temp_alive_${timestamp}.mp3`;
        const outputPath = `./temp_alive_${timestamp}.opus`;

        // 2. Download the audio file
        const response = await axios({ 
            method: 'get', 
            url: audioUrl, 
            responseType: 'arraybuffer' 
        });
        fs.writeFileSync(inputPath, Buffer.from(response.data));

        // 3. Convert and Send Voice Note
        try {
            // FFmpeg command to convert MP3 to WhatsApp compatible OGG/OPUS
            await execPromise(`ffmpeg -i ${inputPath} -vn -ab 128k -ar 48000 -acodec libopus -f ogg ${outputPath} -y`);
            
            const buffer = fs.readFileSync(outputPath);
            await nethmina.sendMessage(from, {
                audio: buffer,
                mimetype: 'audio/ogg; codecs=opus',
                ptt: true
            }, { quoted: mek });

        } catch (ffmpegError) {
            console.error('FFmpeg Error:', ffmpegError);
            // Fallback: If FFmpeg fails, try sending as a normal audio with PTT flag
            await nethmina.sendMessage(from, {
                audio: fs.readFileSync(inputPath),
                mimetype: 'audio/mpeg',
                ptt: true
            }, { quoted: mek });
        }

        // 4. Send Video Note (PTV)
        await nethmina.sendMessage(from, {
            video: { url: "https://github.com/Nethmina-dev/BOT-DATA/raw/refs/heads/main/Video-notes/PTV-20250623-WA0021.mp4" },
            mimetype: 'video/mp4',
            ptv: true
        }, { quoted: mek });

        // 5. Send Image with Caption
        await nethmina.sendMessage(from, { 
            image: { url: config.ALIVE_IMG }, 
            caption: config.ALIVE_MSG 
        }, { quoted: mek });

        // 6. Clean up temp files
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

    } catch (e) {
        console.error('Main Error:', e);
        reply(`*Error:* ${e.message}`);
    }
});
