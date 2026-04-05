const { cmd } = require('../command');
const config = require('../config');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { runtime } = require('../lib/functions');


const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

cmd({
    pattern: "alive",
    react: "🎃",
    desc: "Check bot online status with Voice Note and PTV",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, pushname, reply }) => {
    try {
        
        await conn.sendMessage(from, { react: { text: "🎃", key: m.key } });

        const audioUrl = "https://github.com/Nethmina-dev/BOT-DATA/raw/refs/heads/main/Voice-notes/alive.mp3";
        const outputOgg = path.join(tempDir, `voice_${Date.now()}.ogg`);

        
        const downloadAndConvert = async (url, out) => {
            return new Promise(async (resolve, reject) => {
                ffmpeg(url)
                    .audioCodec('libopus')
                    .audioBitrate('16k')
                    .format('ogg')
                    .on('end', () => resolve(out))
                    .on('error', (err) => reject(err))
                    .save(out);
            });
        };

        try {
            await downloadAndConvert(audioUrl, outputOgg);
            
            
            await conn.sendMessage(from, { 
                audio: fs.readFileSync(outputOgg), 
                mimetype: 'audio/ogg; codecs=opus',
                ptt: true 
            }, { quoted: mek });
            
            if (fs.existsSync(outputOgg)) fs.unlinkSync(outputOgg); // වැඩේ ඉවර වුණාම ෆයිල් එක මකනවා
        } catch (err) {
            console.error("Voice Note Error:", err);
            
            await conn.sendMessage(from, { audio: { url: audioUrl }, mimetype: 'audio/mpeg', ptt: false }, { quoted: mek });
        }

        
        await conn.sendMessage(from, {
            video: { url: "https://github.com/Nethmina-dev/BOT-DATA/raw/refs/heads/main/Video-notes/PTV-20250623-WA0021.mp4" },
            mimetype: 'video/mp4',
            ptv: true
        }, { quoted: mek });

        
        const uptime = runtime(process.uptime());
        
        return await conn.sendMessage(from, { 
            image: { url: config.ALIVE_IMG }, 
            caption: config.ALIVE_MSG,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: `HELLO THERE I'M ALIVE NOW 🎀`,
                    body: `NETHMINA-OFC-WA-BOT V1 🍒`,
                    mediaType: 1,
                    sourceUrl: "https://github.com/nethmina-ofc",
                    thumbnailUrl: config.ALIVE_IMG,
                    renderLargerThumbnail: true,
                    showAdAttribution: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("General Alive Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
            from,
            {
                video: { url: "https://github.com/Nethmina-dev/BOT-DATA/raw/refs/heads/main/Video-notes/PTV-20250623-WA0021.mp4" },
                mimetype: 'video/mp4',
                ptv: true
            },
            { quoted: mek }
        );

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
