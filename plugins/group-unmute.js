const { cmd } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
    pattern: "unmute",
    alias: ["tunmute", "open", "unmute-group"],
    desc: "Unmute the group (Instant or Scheduled for minutes, hours, or days).",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        // 1. Group & Admin Checks (Manual Logic)
        const isGroupChat = from.endsWith('@g.us');
        if (!isGroupChat) return reply("❌ This command can only be used in groups.");

        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants;

        const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
        const botParticipant = participants.find(p => p.id === botNumber);
        const isBotActuallyAdmin = botParticipant && (botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin');

        if (!isBotActuallyAdmin) return reply("❌ I need to be an *admin* to unmute the group.");

        const userParticipant = participants.find(p => p.id === sender.split(":")[0] + "@s.whatsapp.net");
        const isUserActuallyAdmin = userParticipant && (userParticipant.admin === 'admin' || userParticipant.admin === 'superadmin');

        if (!isUserActuallyAdmin) return reply("❌ Only group admins can use this command.");

        // 2. Instant Unmute (Input එකක් නැතිනම්)
        if (!q) {
            // Reaction for Instant: 🔊
            await conn.sendMessage(from, { react: { text: '🔊', key: mek.key } });
            
            await conn.groupSettingUpdate(from, 'not_announcement');
            return reply("✅ *𝐆ʀᴏᴜ𝐏 𝐔ɴᴍᴜᴛᴇ𝐃 𝐈ɴꜱᴛᴀɴᴛʟ𝐘.* \nEveryone can send messages now.");
        }

        // 3. Time Logic (Minutes/Hours/Days අඳුනා ගැනීම)
        let milliseconds = 0;
        let timeValue = parseInt(q.replace(/[^0-9]/g, ''));
        let timeUnit = q.toLowerCase().replace(/[0-9]/g, '').trim();

        if (timeUnit === 'd' || timeUnit === 'day' || timeUnit === 'days') {
            milliseconds = timeValue * 24 * 60 * 60 * 1000;
            reply(`⏳ *𝐒ᴄʜᴇ𝐃ᴜʟᴇ𝐃 𝐔ɴᴍᴜᴛᴇ:* Group will be unmuted in *${timeValue} day(s)*.`);
        } else if (timeUnit === 'h' || timeUnit === 'hour' || timeUnit === 'hours') {
            milliseconds = timeValue * 60 * 60 * 1000;
            reply(`⏳ *𝐒ᴄʜᴇ𝐃ᴜʟᴇ𝐃 𝐔ɴᴍᴜᴛᴇ:* Group will be unmuted in *${timeValue} hour(s)*.`);
        } else {
            // Default unit is minutes (m)
            milliseconds = timeValue * 60 * 1000;
            reply(`⏳ *𝐒ᴄʜᴇ𝐃ᴜʟᴇ𝐃 𝐔ɴᴍᴜᴛᴇ:* Group will be unmuted in *${timeValue} minute(s)*.`);
        }

        // 4. Reaction for Scheduled: ⏳
        await conn.sendMessage(from, { react: { text: '⏳', key: mek.key } });

        // 5. නියමිත වේලාව තෙක් රැඳී සිටීම
        await sleep(milliseconds);

        // 6. Group එක Unmute කිරීම
        await conn.groupSettingUpdate(from, 'not_announcement');
        await conn.sendMessage(from, { text: "🔊 *𝐆ʀᴏᴜ𝐏 𝐔ɴᴍᴜᴛᴇ𝐃 𝐀ᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟ𝐘.* \nEveryone can send messages now." });

    } catch (e) {
        console.error("Scheduled Unmute Error:", e);
        reply("❌ Error occurred while scheduling unmute.");
    }
});
