const { cmd } = require('../command');

cmd({
    pattern: "wm",
    alias: ["watermark", "packname"],
    desc: "Change sticker pack name and author.",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // 👤 React
        await conn.sendMessage(from, {
            react: { text: '🖊️', key: mek.key }
        }).catch(() => null);

        // ✅ Check if quoted message is a sticker
        if (!m.quoted || m.quoted.mtype !== 'stickerMessage') {
            return reply("❌ Please reply to a sticker to change its watermark.");
        }

        // 📥 Download the sticker
        const stickerBuffer = await m.quoted.download();
        if (!stickerBuffer) return reply("❌ Failed to download sticker.");

        // 🏷️ Your custom pack info — edit these!
        const packname = "NETHMINA OFC";
        const author = "© Nethmina";

        // 📦 Build sticker with new metadata
        const { Sticker, StickerTypes } = require('wa-sticker-formatter');

        const sticker = new Sticker(stickerBuffer, {
            pack: packname,
            author: author,
            type: StickerTypes.FULL,
            quality: 100
        });

        const stickerOut = await sticker.toBuffer();

        // 📤 Send the new sticker
        await conn.sendMessage(from, {
            sticker: stickerOut
        }, { quoted: mek });

    } catch (e) {
        console.error("WM Error:", e);
        reply("❌ Failed to change sticker watermark.");
    }
});
