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
        let message = "ＡＴＴＥＮＳＩＯＮ ＥＶＥＲＹＯＮＥ..!";

        // 1. Reaction එක ලබා දීම (🔊)
        await conn.sendMessage(from, { react: { text: '🔊', key: mek.key } });

        // 2. Inbox සිට Remote Tagging Check
        if (!from.endsWith('@g.us') && isOwner && q) {
            const args = q.split(' ');
            if (args[0] && args[0].endsWith('@g.us')) {
                targetJid = args[0];
                message = args.slice(1).join(' ') || "ＡＴＴＥＮＳＩＯＮ ＥＶＥＲＹＯＮＥ..!";
            } else {
                return reply("❌ Please provide a valid Group JID.\nExample: `.tagall 1203xxx@g.us Hello`.");
            }
        } else if (q) {
            message = q;
        }

        // 3. Group Validity Check
        if (!targetJid.endsWith('@g.us')) return reply("❌ This command must target a group.");

        const metadata = await conn.groupMetadata(targetJid).catch(() => null);
        if (!metadata) return reply("❌ Failed to fetch group info. Make sure I am in that group.");

        const participants = metadata.participants;
        
        // 4. Admin Check (ගෲප් එක ඇතුළේදී පමණක්)
        if (from.endsWith('@g.us')) {
            const userParticipant = participants.find(p => p.id === sender.split(":")[0] + "@s.whatsapp.net");
            const isUserActuallyAdmin = userParticipant && (userParticipant.admin === 'admin' || userParticipant.admin === 'superadmin');
            if (!isUserActuallyAdmin && !isOwner) return reply("❌ Only group admins can use this command.");
        }

        // 5. Message Content සකස් කිරීම
        let emojis = ['📢', '🔊', '🌐', '🔰', '📝', '🚀', '🎧', '⚡', '🚩', '🔥', '🛡️', '📦'];
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        let teks = `▢ 𝙶𝚁𝙾𝚄𝙿 : *${metadata.subject}*\n▢ 𝙼𝙴𝙼𝙱𝙴𝚁𝚂 : *${participants.length}*\n▢ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴: *${message}*\n\n┌───⊷ *ᴍᴇɴꜱɪᴏɴꜱ*\n`;

        for (let mem of participants) {
            teks += `${randomEmoji} @${mem.id.split('@')[0]}\n`;
        }
        teks += "└── ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴇᴛʜᴍɪɴᴀ ᴏꜰᴄ ──";

        // 6. මැසේජ් එක යැවීම
        await conn.sendMessage(targetJid, { 
            text: teks, 
            mentions: participants.map(a => a.id) 
        });

        // 7. Inbox එකට විතරක් confirmation එකක් යැවීම
        if (from !== targetJid) {
            reply(`✅ Successfully tagged all members in *${metadata.subject}*`);
        }

    } catch (e) {
        console.error("TagAll Error:", e);
        reply(`❌ *Error Occurred !!*\n\n${e.message}`);
    }
});
