const config = require('../config');
const { cmd } = require('../command');
const { randomEmojis } = require('../lib/emojies'); // මෙන්න මෙතනින් Import කරනවා

cmd({
    on: "body"
},    
async (conn, mek, m, { from, isOwner }) => {
    try {
        // Main Switch එක පරීක්ෂා කිරීම
        if (config.AUTO_REACT !== 'true') return;

        // 1. OWNER REACT (Static Emoji)
        if (isOwner && config.OWNER_REACT === 'true') {
            return await conn.sendMessage(from, { 
                react: { 
                    text: config.OWNER_REACT_EMOJI, 
                    key: mek.key 
                } 
            });
        }

        // 2. USER REACT (Random Emojis from external file)
        if (!isOwner && config.USER_REACT === 'true') {
            // Import කරපු ලිස්ට් එකෙන් එකක් Random ලෙස තෝරා ගැනීම
            const randomEmoji = randomEmojis[Math.floor(Math.random() * randomEmojis.length)];
            
            return await conn.sendMessage(from, { 
                react: { 
                    text: randomEmoji, 
                    key: mek.key 
                } 
            });
        }

    } catch (e) {
        console.log("Auto React Error: ", e);
    }
});
