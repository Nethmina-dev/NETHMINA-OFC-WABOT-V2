const { cmd } = require('../command');

cmd({
    pattern: "tagall",
    alias: ["gc_tagall", "everyone"],
    react: "🔊",
    desc: "To Tag all Members (Directly or via Inbox using JID)",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, q, sender, reply }) => {
    try {
        const ownerNumber = "94760860835";
        const isOwner = sender.includes(ownerNumber);

        let targetJid = from;
        let message = q || "ＡＴＴＥＮＳＩＯＮ ＥＶＥＲＹＯＮＥ..!";

        // 1. Inbox එකේ සිට Remote Tagging (Owner Only)
        // භාවිතය: .tagall 120363xxx@g.us Hello Everyone
        if (!from.endsWith('@g.us') && isOwner) {
            const args = q.split(' ');
            if (args[0] && args[0].endsWith('@g.us')) {
                targetJid = args[0];
                message = args.slice(1).join(' ') || "ＡＴＴＥＮＳＩＯＮ ＥＶＥＲＹＯＮＥ..!";
            } else {
                return reply("❌ Please provide a valid Group JID.\nExample: `.tagall 1203xxx@g.us Hello` වලට පස්සේ මැසේජ් එක දාන්න.");
            }
        }

        // 2. Group Check & Metadata Fetching
        if (!targetJid.endsWith('@g.us')) return reply("❌ This command must target a group.");

        const metadata = await conn.groupMetadata(targetJid).catch(() => null);
        if (!metadata) return reply("❌ Failed to fetch group information. Make sure I am in that group.");

        const participants = metadata.participants;
        
        // 3. Admin Check (ගෲප් එක ඇතුළේදී පමණක්)
        if (from.endsWith('@g.us')) {
            const userParticipant = participants.find(p => p.id === sender.split(":")[0] + "@s.whatsapp.net");
            const isUserActuallyAdmin = userParticipant && (userParticipant.admin === 'admin' || userParticipant.admin === 'superadmin');
            if (!isUserActuallyAdmin && !isOwner) return reply("❌ Only group admins can use this command.");
        }

        // 4. Message සකස් කිරීම
        let emojis = ['📢', '🔊', '🌐', '🔰', '❤‍🩹', '🤍', '🖤', '🩵', '📝', '💗', '🔖', '🪩', '📦', '🎉', '🛡️', '🚀', '🎧', '⚡', '🚩', '🔥'];
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        let teks = `▢ 𝙶𝚁𝙾𝚄𝙿 : *${metadata.subject}*\n▢ 𝙼𝙴𝙼𝙱𝙴𝚁𝚂 : *${participants.length}*\n▢ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴: *${message}*\n\n┌───⊷ *ᴍᴇɴꜱɪᴏɴꜱ*\n`;

        for (let mem of participants) {
            teks += `${randomEmoji} @${mem.id.split('@')[0]}\n`;
        }

        teks += "└──✪ ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴇᴛʜᴍɪɴᴀ ᴏꜰᴄ ✪──";

        // 5. මැසේජ් එක යැවීම
        await conn.sendMessage(targetJid, { 
            text: teks, 
            mentions: participants.map(a => a.id) 
        }, { quoted: (from === targetJid ? mek : null) });

        // 6. Inbox එකට Confirmation එකක් දීම
        if (from !== targetJid) {
            reply(`✅ Successfully tagged all members in *${metadata.subject}*`);
        }

    } catch (e) {
        console.error("TagAll Error:", e);
        reply(`❌ *Error Occurred !!*\n\n${e.message}`);
    }
});
