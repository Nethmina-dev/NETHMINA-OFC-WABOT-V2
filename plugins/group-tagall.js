const { cmd } = require('../command');

cmd({
    pattern: "tagall",
    alias: ["everyone", "all"],
    react: "🔊",
    desc: "To Tag all Members in a group.",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, q, isGroup, isOwner, isAdmins, reply }) => {
    try {
        // 1. Permission Check (Owner හෝ Admin විය යුතුය)
        if (!isOwner && !isAdmins) return reply("❌ Only group admins or the owner can use this command.");

        // 2. Inbox සිට Remote Tagging Logic (JID එකක් දුන්නොත්)
        let targetJid = from;
        let message = q || "ＡＴＴＥＮＳＩＯＮ ＥＶＥＲＹＯＮＥ..!";

        if (!isGroup && isOwner && q) {
            const args = q.split(' ');
            if (args[0] && args[0].endsWith('@g.us')) {
                targetJid = args[0];
                message = args.slice(1).join(' ') || "ＡＴＴＥＮＳＩＯＮ ＥＶＥＲＹＯＮＥ..!";
            }
        }

        // 3. Group Validity Check
        if (!targetJid.endsWith('@g.us')) return reply("❌ Please use this in a group or provide a valid Group JID.");

        const metadata = await conn.groupMetadata(targetJid).catch(() => null);
        if (!metadata) return reply("❌ Failed to fetch group info. Make sure I am in that group.");

        const participants = metadata.participants;
        
        // 4. Message Content සකස් කිරීම
        let emojis = ['📢', '🔊', '🌐', '🔰', '📝', '🚀', '🎧', '⚡', '🚩', '🔥', '🛡️', '📦'];
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        let teks = `▢ *𝙶𝚁𝙾𝚄𝙿 :* ${metadata.subject}\n▢ *𝙼𝙴𝙼𝙱𝙴𝚁𝚂 :* ${participants.length}\n▢ *𝙼𝙴𝚂𝚂𝙰𝙶𝙴:* ${message}\n\n┌───⊷ *ᴍᴇɴꜱɪᴏɴꜱ*\n`;

        for (let mem of participants) {
            teks += `│ ${randomEmoji} @${mem.id.split('@')[0]}\n`;
        }
        teks += "└───────────────⊷\n\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴇᴛʜᴍɪɴᴀ ᴏꜰᴄ";

        // 5. මැසේජ් එක යැවීම
        await conn.sendMessage(targetJid, { 
            text: teks, 
            mentions: participants.map(a => a.id) 
        });

        // 6. Inbox එකට confirmation එකක් යැවීම (Remote tagging නම් පමණි)
        if (from !== targetJid) {
            reply(`✅ Successfully tagged all members in *${metadata.subject}*`);
        }

    } catch (e) {
        console.error("TagAll Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
