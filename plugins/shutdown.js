const { cmd } = require('../command');
const { sleep } = require('../lib/functions');

// 1. Shutdown Command
cmd({
    pattern: "shutdown",
    desc: "Shutdown the bot.",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");

    // Reaction එක මුලින්ම ලබා දීම
    await conn.sendMessage(from, { react: { text: '🛑', key: mek.key } }).catch(() => null);
    
    await reply("🛑 *𝐍𝐄𝐓𝐇𝐌𝐈𝐍𝐀 𝐎𝐅𝐂 𝐢𝐬 𝐒𝐡𝐮𝐭𝐭𝐢𝐧𝐠 𝐃𝐨𝐰𝐧...*");
    await sleep(2000); // මැසේජ් එක යැවීමට සහ රියැක්ට් වීමට කාලය ලබා දීම
    process.exit();
});

// 2. Start (Restart) Command
cmd({
    pattern: "start",
    desc: "Restart the bot.",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");

    // Reaction එක මුලින්ම ලබා දීම
    await conn.sendMessage(from, { react: { text: '🔄', key: mek.key } }).catch(() => null);

    await reply("🔄 *𝐍𝐄𝐓𝐇𝐌𝐈𝐍𝐀 𝐎𝐅𝐂 𝐢𝐬 𝐑𝐞𝐬𝐭𝐚𝐫𝐭𝐢𝐧𝐠...*");
    await sleep(2000);
    process.exit(); // PM2 මගින් බොට් නැවත පණගන්වනු ඇත
});
