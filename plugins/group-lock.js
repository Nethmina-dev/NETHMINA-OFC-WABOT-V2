const { cmd } = require('../command');

cmd({
    pattern: "lockgc",
    alias: ["lock", "lockgroup"],
    desc: "Lock group settings (Admins only can edit).",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, reply, sender }) => {
    try {
        // 1. Group Check
        const isGroupChat = from.endsWith('@g.us');
        if (!isGroupChat) return reply("❌ This command can only be used in groups.");

        // 2. Group Metadata ලබා ගැනීම
        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants;

        // 3. Bot Admin Check (Manual)
        const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
        const botParticipant = participants.find(p => p.id === botNumber);
        const isBotActuallyAdmin = botParticipant && (botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin');

        if (!isBotActuallyAdmin) {
            return reply("❌ I need to be an *admin* to lock the group settings.");
        }

        // 4. User Admin Check (Manual)
        const userParticipant = participants.find(p => p.id === sender.split(":")[0] + "@s.whatsapp.net");
        const isUserActuallyAdmin = userParticipant && (userParticipant.admin === 'admin' || userParticipant.admin === 'superadmin');

        if (!isUserActuallyAdmin) {
            return reply("❌ Only group admins can use this command.");
        }

        // 5. Reaction: 🔒
        await conn.sendMessage(from, { react: { text: '🔒', key: mek.key } });

        // 6. Group Settings Lock කිරීම (announcement නොවෙයි, සෙටින්ග්ස් ලොක් කිරීම)
        // 'locked' - ඇඩ්මින්ලාට විතරයි සෙටින්ග්ස් වෙනස් කළ හැක්කේ
        // 'unlocked' - හැමෝටම සෙටින්ග්ස් වෙනස් කළ හැකියි
        await conn.groupSettingUpdate(from, 'locked');
        
        return reply("✅ *𝐆ʀᴏᴜ𝐏 𝐒ᴇᴛᴛɪɴɢ𝐒 𝐋ᴏᴄᴋᴇ𝐃.* \nNow only admins can edit group info.");

    } catch (e) {
        console.error("Error locking group settings:", e);
        return reply("❌ Failed to lock the group settings.");
    }
});
