const { cmd } = require('../command');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

cmd({
    pattern: "wm",
    desc: "Sticker එකේ pack name සහ author name වෙනස් කරයි.",
    category: "convert",
    use: ".wm <pack name>|<author name>",
    filename: __filename
},
async (conn, mek, m, { from, reply, quoted, body, isCreator }) => {
    try {
   
        if (!quoted || quoted.mtype !== 'stickerMessage') return reply("Please reply to a sticker. 😊");

        let pack = "💟 𝙽𝙴𝚃𝙷𝙼𝙸𝙽𝙰 - 𝚂𝚃𝙸𝙲𝙺𝙴𝚁𝚂 💟"; 
        let author = "👨🏿‍💻 ɴᴇᴛʜᴍɪɴᴀ ᴏꜰꜰɪᴄɪᴀʟ ᴄᴏᴍᴍᴜɴɪᴛʏ 👨🏿‍💻";

        if (body.includes('|')) {
            pack = body.split('|')[0].replace('.wm ', '');
            author = body.split('|')[1];
        }

        await conn.sendMessage(from, { react: { text: '🖊️', key: mek.key } });

        const buffer = await quoted.download();

        const sticker = new Sticker(buffer, {
            pack: pack,
            author: author,
            type: StickerTypes.FULL, // ස්ටිකර් එකේ shape එක ආරක්ෂා කරයි
            categories: ['🤩', '🎉'],
            id: '12345',
            quality: 70,
        });

        const stickerBuffer = await sticker.toBuffer();

        return await conn.sendMessage(from, { sticker: stickerBuffer }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("Something went wrong! Please try again. 🛠");
    }
});
