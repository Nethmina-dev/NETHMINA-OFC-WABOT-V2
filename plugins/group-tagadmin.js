const { cmd } = require('../command');

cmd({
    pattern: "tagadmins",
    alias: ["gc_tagadmins", "admins", "admintag"],
    react: "👑",
    desc: "To Tag all Admins of the Group (Directly or via Inbox using JID)",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const ownerNumber = "94760860835";
        const isOwner = sender.includes(ownerNumber);

        let targetJid = from;
        let message = "Attention Admins!";

        // 1. Reaction: 👑
        await conn.sendMessage(from, { react: { text: '👑', key: mek.key } });

        // 2. Inbox සිට Remote Tagging Check (Owner Only)
        // භාවිතය: .tagadmins [JID] [Message]
        if (!from.endsWith('@g.us') && isOwner && q) {
            const args = q.split(' ');
            if (args[0] && args[0].endsWith('@g.us')) {
                targetJid = args[0];
                message = args.slice(1).join(' ') || "Attention Admins!";
            } else {
                return reply("❌ Please provide a valid Group JID.\nExample: `.tagadmins 1203xxx@g.us Hello Admins`.");
            }
        } else if (q) {
            message = q;
        }

        // 3. Group Validity Check
        if (!targetJid.endsWith('@g.us')) return reply("❌ This command must target a group.");

        const metadata = await conn.groupMetadata(targetJid).catch(() => null);
        if (!metadata) return reply("❌ Failed to fetch group information.");

        // 4. ඇඩ්මින්ලා පමණක් වෙන් කර හඳුනා ගැනීම
        const participants = metadata.participants;
        const admins = participants
            .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
            .map(p => p.id);

        if (admins.length === 0) return reply("❌ No admins found in this group.");

        // 5. Message Content සකස් කිරීම
        let emojis = ['👑', '⚡', '🌟', '✨', '🎖️', '💎', '🔱', '🛡️', '🏆', '💎'];
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        let teks = `▢ 𝙶𝚁𝙾𝚄𝙿 : *${metadata.subject}*\n▢ 𝙰𝙳𝙼𝙸𝙽𝚂 : *${admins.length}*\n▢ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴: *${message}*\n\n┌───⊷ *𝐀ᴅᴍɪ𝐍 𝐌ᴇɴᴛɪᴏɴ𝐒*\n`;

        for (let adminId of admins) {
            teks += `${randomEmoji} @${adminId.split('@')[0]}\n`;
        }

        teks += "\n└──✪ <| 𝐊𝐈𝐍𝐆-𝐒𝐀𝐍𝐃𝐄𝐒𝐇-𝐌𝐃 𝐕❷🫧 ✪──";

        // 6. මැසේජ් එක යැවීම
        await conn.sendMessage(targetJid, { 
            text: teks, 
            mentions: admins 
        }, { quoted: (from === targetJid ? mek : null) });

        // 7. Inbox එකට විතරක් confirmation එකක් යැවීම
        if (from !== targetJid) {
            reply(`✅ Successfully tagged all *${admins.length}* admins in *${metadata.subject}*`);
        }

    } catch (e) {
        console.error("TagAdmins Error:", e);
        reply(`❌ *Error Occurred !!*\n\n${e.message}`);
    }
});
