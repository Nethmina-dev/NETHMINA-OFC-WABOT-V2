const { cmd } = require('../command');

cmd({
    pattern: "ginfo",
    alias: ["groupinfo", "info"],
    react: "🥏",
    desc: "Get group information.",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender }) => {
    try {
        // 1. Group Check
        const isGroupChat = from.endsWith('@g.us');
        if (!isGroupChat) return reply("❌ This command only works in group chats.");

        // 2. Fetch Group Metadata (අලුත්ම දත්ත ලබා ගැනීම)
        const metadata = await conn.groupMetadata(from);
        const participants = metadata.participants;
        
        // 3. Bot Admin Check (Manual)
        const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
        const botParticipant = participants.find(p => p.id === botNumber);
        const isBotActuallyAdmin = botParticipant && (botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin');

        if (!isBotActuallyAdmin) {
            return reply("❌ I need to be an *admin* to fetch full group details.");
        }

        // 4. User Admin Check (Manual)
        const userParticipant = participants.find(p => p.id === sender.split(":")[0] + "@s.whatsapp.net");
        const isUserActuallyAdmin = userParticipant && (userParticipant.admin === 'admin' || userParticipant.admin === 'superadmin');

        if (!isUserActuallyAdmin) {
            return reply("⛔ Only *Group Admins* can use this command.");
        }

        // 5. Profile Picture ලබා ගැනීම
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(from, 'image');
        } catch {
            // Profile picture එකක් නැත්නම් Default image එකක්
            ppUrl = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';
        }

        // 6. Admin List එක සැකසීම
        const groupAdmins = participants.filter(p => p.admin !== null);
        const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');
        const owner = metadata.owner || metadata.id.split('-')[0] + "@s.whatsapp.net" || "Unknown";

        // 7. විස්තර පෙළ (Caption)
        const gdata = `*「 Ｇʀᴏᴜᴘ Ｉɴꜰᴏ 」*

*𝙶𝚁𝙾𝚄𝙿 𝙽𝙰𝙼𝙴* : ${metadata.subject}
*𝙶𝚁𝙾𝚄𝙿 𝙸𝙳* : ${metadata.id}
*𝙿𝙰𝚁𝚃𝙸𝙲𝙸𝙿𝙰𝙽𝚃𝚂* : ${participants.length}
*𝙶𝚁𝙾𝚄𝙿 𝙲𝚁𝙴𝙰𝚃𝙾𝚁* : @${owner.split('@')[0]}
*𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝚃𝙸𝙾𝙽* : ${metadata.desc?.toString() || 'No description'}\n
*𝙰𝙳𝙼𝙸𝙽𝚂 (${groupAdmins.length})*:
${listAdmin}

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴇᴛʜᴍɪɴᴀ ᴏꜰᴄ ||`;

        // 8. මැසේජ් එක යැවීම (Image + Caption)
        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption: gdata,
            mentions: groupAdmins.map(v => v.id).concat([owner])
        }, { quoted: mek });

    } catch (e) {
        console.error("Ginfo Command Error:", e);
        reply("❌ Failed to fetch group information.");
    }
});
