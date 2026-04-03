const { cmd } = require('../command')
const config = require('../config');

cmd({
    pattern: "alive",
    react: "🎃",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
},
async (nethmina, mek, m, { from, quoted, reply }) => {
    try {
        // Send reaction
        if (mek.key) {
            await nethmina.sendMessage(from, { react: { text: "🎃", key: mek.key } });
        }

        // Context Info ekath ekka image eka yawana hati
        return await nethmina.sendMessage(from, { 
            image: { url: config.ALIVE_IMG }, 
            caption: config.ALIVE_MSG,
            contextInfo: {
                externalAdReply: {
                    title: "WhatsApp Business", // Display wena main title eka
                    body: "Contact: SANDES-MD-LITE", // Title ekata pahalin thiyena body eka
                    mediaType: 1,
                    thumbnailUrl: config.ALIVE_IMG, // Thumbnail ekata yana image eka
                    sourceUrl: "https://whatsapp.com", // Thumbnail eka click kalama yana link eka
                    showAdAttribution: true, // "Ad" kiyala label eka danna
                    renderLargerThumbnail: false // Small thumbnail ekak danna (image eke widiyata)
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
