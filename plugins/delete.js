const { cmd } = require('../command');

cmd({
    pattern: "delete",
    alias: ["del"],
    desc: "Delete a replied message.",
    category: "group",
    filename: __filename
},
async (conn, mek, m, { from, quoted, isOwner, isAdmins, isBotAdmins, reply }) => {
    try {
        // 1. Permission Check (Owner හෝ Admin විය යුතුය)
        if (!isOwner && !isAdmins) return; // සද්ද නැතුව ඉන්නවා (නැත්නම් reply එකක් දාන්න)

        // 2. රිප්ලයි එකක් තියෙනවාද බලන්න
        if (!quoted) return reply("❌ Please reply to the message you want to delete.");

        // 3. Bot Admin ද බලන්න (වෙනත් අයගේ මැසේජ් මැකීමට නම්)
        // Bot ගේම මැසේජ් එකක් නම් Admin ඕනේ නැහැ.
        if (!quoted.fromMe && !isBotAdmins) {
            return reply("❌ I need to be an *Admin* to delete messages from other members.");
        }

        // 4. මැසේජ් එක මැකීම
        await conn.sendMessage(from, { 
            delete: { 
                remoteJid: from, 
                fromMe: quoted.fromMe, 
                id: quoted.id, 
                participant: quoted.sender 
            } 
        });

        // 5. ඔයා දාපු කමාන්ඩ් එකත් මැකීම (Optional)
        await conn.sendMessage(from, { delete: mek.key });

    } catch (e) {
        console.log("Delete Error:", e);
        reply("❌ Error: Could not delete the message.");
    }
});
