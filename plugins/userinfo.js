const { cmd } = require('../command');

cmd({
    pattern: "profile",
    alias: ["pinfo", "userinfo"],
    desc: "Get user profile picture, username and bio.",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender }) => {
    try {

      await conn.sendMessage(from, { react: { text: '👤', key: mek.key } }).catch(() => null);
      
        // 1. Target User හඳුනා ගැනීම (Reply එකක් හෝ අංකයක් හෝ තමාම)
        let target = m.quoted ? m.quoted.sender : (q ? q.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : sender);

        // 2. Profile Picture ලබා ගැනීම
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(target, 'image');
        } catch (e) {
            // Profile Picture එකක් නැතිනම් Default එකක් පාවිච්චි කරයි
            ppUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
        }

        // 3. Username සහ Bio ලබා ගැනීම
        const status = await conn.fetchStatus(target).catch(() => ({ status: "No Bio Available" }));
        const username = await conn.getName(target);
        const userBio = status.status || "No Bio Available";
        const userNum = target.split('@')[0];

        // 4. Beautiful UI Caption එක සකස් කිරීම
        let caption = `
👤 *ＵＳＥＲ  ＰＲＯＦＩＬＥ  ＩＮＦＯ*

┌────────────────────⊷
│ 📝 *Name:* ${username}
│ 🔢 *Number:* ${userNum}
│ 💬 *Bio:* ${userBio}
└────────────────────⊷

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴇᴛʜᴍɪɴᴀ ᴏꜰᴄ ||`;

        // 5. Profile Picture එක සමඟ විස්තර යැවීම
        await conn.sendMessage(from, { 
            image: { url: ppUrl }, 
            caption: caption 
        }, { quoted: mek });

    } catch (e) {
        console.error("Profile Error:", e);
        reply("❌ Could not fetch profile information. Please check the number or try again.");
    }
});
