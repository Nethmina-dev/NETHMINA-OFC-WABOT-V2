const config = require('../config');
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const fs = require('fs');
const path = require('path');


cmd({
    pattern: "alive",
    desc: "Check bot online status",
    category: "main",
    filename: __filename
},
async (nethmina, mek, m, { from, pushname, reply }) => {
    try {
        // 1. Reaction
        await nethmina.sendMessage(from, { react: { text: "🎃", key: m.key } });

        const uptime = runtime(process.uptime());
        const date = new Date().toLocaleDateString('en-GB', { timeZone: 'Asia/Colombo' });
        const time = new Date().toLocaleTimeString('en-US', { hour12: true, timeZone: 'Asia/Colombo' });

        await nethmina.sendPresenceUpdate('recording', from);
        await nethmina.sendMessage(from, { audio: { url: "https://github.com/Nethmina-dev/BOT-DATA/raw/refs/heads/main/Voice-notes/alive.mp3" }, mimetype: 'audio/mpeg', ptt: false }, { quoted: mek });
        // 3. Video Note (PTV)
        await nethmina.sendMessage(from, {
            video: { url: "https://github.com/Nethmina-dev/BOT-DATA/raw/refs/heads/main/Video-notes/PTV-20250623-WA0021.mp4" },
            mimetype: 'video/mp4',
            ptv: true
        }, { quoted: mek });

        // 4. Alive Message Caption
        let mainCaption = `👋 *HELLOW*, *${pushname || 'User'}*

*╭─「 ᴅᴀᴛᴇ ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ 」──●●►*
*│*📅 Date : ${date}
*│*🕒 Time : ${time}
*╰──────────●●►*

*╭─「 ꜱᴛᴀᴛᴜꜱ ᴅᴇᴛᴀɪʟꜱ 」──●●►*
*│*👤 User : ${pushname || 'User'}
*│*🧑‍💻 Owner : ${config.OWNER_NAME}
*│*✒️ Prefix : ${config.PREFIX}
*│*🧬 Version : V 02
*│*📟 Uptime : ${uptime}
*╰──────────●●►*

🔢 *REPLY THE NUMBER BELLOW*

01 ❯❯◦ COMMANDS MENU
02 ❯❯◦ CHECK BOT PING

*> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴇᴛʜᴍɪɴᴀ ᴏꜰᴄ ||*`;

        // 5. Final Message with Clickable Link Logic
        return await conn.sendMessage(from, { 
            text: mainCaption, // image: වෙනුවට text: පාවිච්චි කිරීමෙන් preview එක වඩාත් පැහැදිලි වෙනවා
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363233544482017@newsletter',
                    newsletterName: 'NETHMINA-OFC-WA-BOT',
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: `NETHMINA-OFC WA-BOT IS ONLINE 🎀`,
                    body: `NETHMINA-OFC-WA-BOT V2 🍒`,
                    mediaType: 1,
                    sourceUrl: "https://github.com/nethmina-ofc", // මෙය ක්ලික් කළ විට විවෘත වන ලින්ක් එක
                    thumbnailUrl: config.ALIVE_IMG,
                    renderLargerThumbnail: true, 
                    showAdAttribution: true
                }
            }
        }, { 
            quoted: {
                key: { 
                    remoteJid: 'status@broadcast', 
                    fromMe: false, 
                    participant: '0@s.whatsapp.net' 
                },
                message: {
                    contactMessage: {
                        displayName: "SANDES-AI ツ",
                        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;SANDES-AI ツ;;;\nFN:SANDES-AI ツ\nitem1.TEL;waid=94760860835:+94 76 086 0835\nitem1.X-ABLabel:PSTN\nEND:VCARD`
                    }
                }
            }
        });

    } catch (e) {
        console.error(e);
        reply(`Error: ${e}`);
    }
});
