const { cmd } = require('../command');

cmd({
    pattern: "promote",
    alias: ["p", "makeadmin"],
    desc: "Promotes a member to group admin",
    category: "admin",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        // 1. Group Check (JID එකෙන් කෙලින්ම බලනවා)
        const isGroupChat = from.endsWith('@g.us');
        if (!isGroupChat) return reply("❌ This command can only be used in groups.");

        // 2. Group Metadata ලබා ගැනීම
        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants;

        // 3. Bot Admin ද කියා පරීක්ෂා කිරීම (Manual Check)
        const botNumber = conn.user.id.split(":")[0] + "@s.whatsapp.net";
        const botParticipant = participants.find(p => p.id === botNumber);
        const isBotActuallyAdmin = botParticipant && (botParticipant.admin === 'admin' || botParticipant.admin === 'superadmin');

        if (!isBotActuallyAdmin) {
            return reply("❌ I need to be an admin to promote members.");
        }

        // 4. User (Sender) Admin ද කියා පරීක්ෂා කිරීම (Manual Check)
        const userParticipant = participants.find(p => p.id === sender.split(":")[0] + "@s.whatsapp.net");
        const isUserActuallyAdmin = userParticipant && (userParticipant.admin === 'admin' || userParticipant.admin === 'superadmin');

        if (!isUserActuallyAdmin) {
            return reply("❌ Only group admins can use this command.");
        }

        // 5. Promote කළ යුතු අංකය හඳුනා ගැනීම
        let number;
        if (mek.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
            number = mek.message.extendedTextMessage.contextInfo.participant.split("@")[0];
        } else if (q) {
            number = q.replace(/[^0-9]/g, '');
        } else {
            return reply("❌ Please reply to a message or provide a number to promote.");
        }

        if (!number || number.length < 7) return reply("❌ Invalid phone number format.");

        const jid = number + "@s.whatsapp.net";

        // බොට්වම promote කරන්න උත්සාහ කළොත්
        if (jid === botNumber) return reply("❌ I am already an admin.");

        // 6. Reaction: ⬆️
        await conn.sendMessage(from, { react: { text: '⬆️', key: mek.key } });

        // 7. Promote කිරීම
        await conn.groupParticipantsUpdate(from, [jid], "promote");
        
        return reply(`✅ 𝐒ᴜᴄᴄᴇꜱꜱꜰᴜʟʟ𝐘 𝐏ʀᴏᴍᴏᴛᴇ𝐃 @${number} 𝐓𝐎 𝐀ᴅᴍɪ𝐍.`, { mentions: [jid] });

    } catch (error) {
        console.error("Promote command error:", error);
        reply("❌ Failed to promote the member. Make sure the user is in the group.");
    }
});
