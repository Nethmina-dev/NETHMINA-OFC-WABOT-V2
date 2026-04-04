const { cmd } = require('../command');

cmd({
    pattern: "admin",
    alias: ["admins", "adminlist"],
    desc: "List all group admins",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // 1. ගෲප් එකක්ද කියා JID එකෙන් පරීක්ෂා කිරීම
        const isGroupChat = from.endsWith('@g.us');
        if (!isGroupChat) return reply("❌ This command can only be used in groups.");

        // 2. Reaction: 👑
        await conn.sendMessage(from, { react: { text: "👑", key: mek.key } });

        // 3. ගෲප් එකේ දත්ත (Metadata) අලුතින්ම ලබා ගැනීම
        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants;
        
        // ඇඩ්මින්ලා පමණක් වෙන් කර ගැනීම
        const groupAdmins = participants.filter(p => p.admin !== null);
        
        let adminText = `👑 *𝐆𝐑𝐎𝐔𝐏 𝐀𝐃𝐌𝐈𝐍 𝐋𝐈𝐒𝐓*\n\n`;
        adminText += `*Group:* ${groupMetadata.subject}\n`;
        adminText += `*Total Admins:* ${groupAdmins.length}\n\n`;

        const mentions = [];

        groupAdmins.forEach((admin, i) => {
            const isSuperAdmin = admin.admin === 'superadmin'; // Group Creator
            
            const role = isSuperAdmin ? "👑 [Creator]" : "🛡️ [Admin]";
            const jid = admin.id;
            mentions.push(jid);
            
            adminText += `${i + 1}. ${role} @${jid.split('@')[0]}\n`;
        });

        adminText += `\n> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴇᴛʜᴍɪɴᴀ ᴏꜰᴄ ||`;

        // 4. මැසේජ් එක යැවීම (Mentions සමඟ)
        return reply(adminText, { mentions });

    } catch (error) {
        console.error("Admin List Error:", error);
        return reply("❌ Failed to fetch admin list.");
    }
});
