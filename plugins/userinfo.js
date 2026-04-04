const { cmd } = require('../command');

cmd({
    pattern: "profile",
    alias: ["pinfo", "userinfo"],
    desc: "Get user profile picture, username and bio.",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender, isOwner }) => {
    try {
        // Owner Check (Optional - Everyone ට දෙනවා නම් මේ පේළිය අයින් කරන්න)
        if (!isOwner) return reply("❌ This command is only for the bot owner.");

        await conn.sendMessage(from, { react: { text: '👤', key: mek.key } }).catch(() => null);
      
        // 1. Target User හඳුනා ගැනීම (Logic Fix)
        let target;
        if (m.quoted) {
            // Reply කර ඇති පුද්ගලයා
            target = m.quoted.sender;
        } else if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]) {
            // @Mention කර ඇති පුද්ගලයා
            target = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
        } else if (q) {
            // අංකයක් ලබා දී ඇති විට (Clean number logic)
            let num = q.replace(/[^0-9]/g, '');
            target = num + '@s.whatsapp.net';
        } else {
            // කිසිවක් නැතිනම් තමාම (Sender)
            target = sender;
        }

        // 2. Profile Picture ලබා ගැනීම
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(target, 'image');
        } catch (e) {
            // Profile Picture එකක් නැතිනම් හෝ Privacy Settings නිසා පෙනෙන්නේ නැතිනම්
            ppUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        }

        // 3. Username සහ Bio ලබා ගැනීම
        let username = "Unknown";
        try {
            username = await conn.getName(target);
        } catch (e) {
            username = target.split('@')[0];
        }

        let userBio = "No Bio Available";
        try {
            const status = await conn.fetchStatus(target);
            userBio = status?.status || "No Bio Available";
        } catch (e) {
            userBio = "Privacy Protected / No Bio";
        }

        const userNum = target.split('@')[0];

        // 4. UI Caption
        let caption = `👤 *ＵＳＥＲ  ＰＲＯＦＩＬＥ  ＩＮＦＯ*

┌────────────────────⊷
│ 📝 *Name:* ${username}
│ 🔢 *Number:* ${userNum}
│ 💬 *Bio:* ${userBio}
└────────────────────⊷

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴇᴛʜᴍɪɴᴀ ᴏꜰᴄ`;

        // 5. Profile Picture එක සමඟ විස්තර යැවීම
        await conn.sendMessage(from, { 
            image: { url: ppUrl }, 
            caption: caption,
            mentions: [target] // Caption එකේ mention එකක් විදිහට පේන්න
        }, { quoted: mek });

    } catch (e) {
        console.error("Profile Error:", e);
        reply("❌ User info fetch failed. The number might be invalid or privacy restricted.");
    }
});
