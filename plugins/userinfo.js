const { cmd } = require('../command');

cmd({
    pattern: "profile",
    alias: ["pinfo", "userinfo"],
    desc: "Get user profile picture, username and bio.",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, q, reply, sender, pushname }) => {
    try {

        // 👤 React
        await conn.sendMessage(from, {
            react: { text: '👤', key: mek.key }
        }).catch(() => null);

        let target;
        let name;

        // 🔍 Target detection
        if (m.quoted) {
            target = m.quoted.sender;
            name = m.quoted.pushName || m.quoted.participant || "User";

        } else if (q) {
            const num = q.replace(/[^0-9]/g, '');
            if (!num) return reply("❌ Valid number ekak denna");

            target = num + '@s.whatsapp.net';
            name = "User";

        } else {
            target = sender;
            name = pushname;
        }

        // 🛠 Ensure correct format
        if (!target.includes('@s.whatsapp.net')) {
            target = target + '@s.whatsapp.net';
        }

        // 🖼 Profile Picture
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(target, 'image');
        } catch {
            ppUrl = 'https://i.ibb.co/2WzRZ6G/user.png';
        }

        // 💬 Bio / Status
        let userBio = "Hidden by Privacy";
        const status = await conn.fetchStatus(target).catch(() => null);

        if (status?.status) userBio = status.status;

        // ✂️ Limit bio length
        if (userBio.length > 100) {
            userBio = userBio.substring(0, 97) + "...";
        }

        // 🧠 Name resolve
        if (!name || name === "User") {
            try {
                const contact = conn.getName(target);
                name = contact || target.split('@')[0];
            } catch {
                name = target.split('@')[0];
            }
        }

        // 🧹 Clean name
        if (name && name.includes('@')) {
            name = name.split('@')[0];
        }

        const userNum = target.split('@')[0];

        // 🧾 Final Caption
        let caption = `👤 *USER PROFILE INFO*

┌────────────────────⊷
│ 📝 *Name:* ${name}
│ 🔢 *Number:* ${userNum}
│ 👤 *Tag:* @${userNum}
│ 🔗 *Wa.me:* https://wa.me/${userNum}
│ 💬 *Bio:* ${userBio}
└────────────────────⊷

> © POWERED BY NETHMINA OFC`;

        // 📤 Send Message
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
