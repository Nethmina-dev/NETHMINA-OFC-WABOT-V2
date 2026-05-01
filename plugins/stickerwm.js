const { cmd } = require('../command');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

cmd({
    pattern: "wm",
    desc: "Sticker එකේ pack name සහ author name වෙනස් කරයි.",
    category: "convert",
    filename: __filename
},
async (conn, mek, m, { from, reply, quoted, body }) => {
    try {
        
        if (!quoted) return reply("කරුණාකර ස්ටිකර් එකකට රිප්ලයි කරන්න! 😊");

        const isSticker = quoted.mtype === 'stickerMessage' || 
                          (quoted.message && quoted.message.stickerMessage);

        if (!isSticker) return reply("*You did not reply to a sticker. Please reply to a sticker. ☺*");

        let pack = "💟 𝙽𝙴𝚃𝙷𝙼𝙸𝙽𝙰 - 𝚂𝚃𝙸𝙲𝙺𝙴𝚁𝚂 💟"; 
        let author = "👨🏿‍💻 ɴᴇᴛʜᴍɪɴᴀ ᴏꜰꜰɪᴄɪᴀʟ ᴄᴏᴍᴍᴜɴɪᴛʏ 👨🏿‍💻";

        if (body.includes('|')) {
            let splitData = body.split('|');
            pack = splitData[0].replace('.wm', '').trim() || pack;
            author = splitData[1].trim() || author;
        }

        await conn.sendMessage(from, { react: { text: '🖊️', key: mek.key } });

        const buffer = await quoted.download().catch(() => conn.downloadMediaMessage(quoted));

        const sticker = new Sticker(buffer, {
            pack: pack,
            author: author,
            type: StickerTypes.FULL,
            categories: ['🤩', '🎉'],
            quality: 70,
        });

        const stickerBuffer = await sticker.toBuffer();
        return await conn.sendMessage(from, { sticker: stickerBuffer }, { quoted: mek });

    } catch (e) {
        console.log("WM Error: ", e);
        reply("වSomething went wrong! Please try again. 🛠");
    }
});
