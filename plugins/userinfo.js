const { cmd } = require('../command');

cmd({
    pattern: "profile",
    alias: ["pinfo", "userinfo"],
    desc: "Get user profile picture, username and bio.",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender, isOwner, pushname }) => {
    try {
        if (!isOwner) return reply("❌ This command is only for the bot owner.");

        await conn.sendMessage(from, { react: { text: '👤', key: mek.key } }).catch(() => null);
      
        let target;
        let name;

        // 1. Target & Name Detection Logic
        if (m.quoted) {
            target = m.quoted.sender;
            // රිප්ලයි එකේ pushName එක බැලීම (sms function එක අනුව වෙනස් විය හැක)
            name = m.quoted.pushName || m.quoted.name || "User";
        } else if (q) {
            target = q.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            name = "User"; 
        } else {
            target = sender;
            name = pushname; // තමන්ගේ නම
        }

        // 2. Profile Picture (PP) ලබා ගැනීම
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(target, 'image');
        } catch (e) {
            ppUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        }

        // 3. Bio/Status ලබා ගැනීමට උත්සාහ කිරීම
        let userBio = "Hidden by Privacy";
        try {
            const status = await conn.fetchStatus(target);
            if (status && status.status) userBio = status.status;
        } catch (e) {
            userBio = "Privacy Protected";
        }

        // 4. නම තවමත් "User" නම්, බොට්ගේ Contact List එකෙන් නම සෙවීම
        if (name === "User" || !name) {
            try {
                const contact = await conn.getName(target);
                name = contact || target.split('@')[0];
            } catch {
                name = target.split('@')[0];
            }
        }

        // නම අංකයම නම්, අංකය පමණක් පෙන්වන්න (අනවශ්‍ය @s.whatsapp.net අයින් කර)
        if (name.includes('@')) name = name.split('@')[0];

        const userNum = target.split('@')[0];

        let caption = `👤 *ＵＳＥＲ  ＰＲＯＦＩＬＥ  ＩＮＦＯ*

┌────────────────────⊷
│ 📝 *Name:* ${name}
│ 🔢 *Number:* ${userNum}
│ 💬 *Bio:* ${userBio}
└────────────────────⊷

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴇᴛʜᴍɪɴᴀ ᴏꜰᴄ`;

        await conn.sendMessage(from, { 
            image: { url: ppUrl }, 
            caption: caption,
            mentions: [target]
        }, { quoted: mek });

    } catch (e) {
        console.error("Profile Error:", e);
        reply("❌ Error fetching profile info.");
    }
});
