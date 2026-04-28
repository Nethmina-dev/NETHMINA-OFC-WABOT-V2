const { cmd } = require('../command');

cmd({
    on: "body"
},    
async (conn, mek, m, { from, body, isOwner, readEnv }) => {
    try {
        
        if (m.key.fromMe) return;

        const msgText = body ? body.toLowerCase().trim() : "";
         const config = await readEnv();
        
        if (config.AUTO_VOICE === 'true') {
            
            let voiceUrl = '';

            
            if (msgText === 'hi' || msgText === 'hello') {
                voiceUrl = 'https://github.com/Nethmina-dev/BOT-DATA/raw/refs/heads/main/Voice-notes/hi%23old.mp3';
            } else if (msgText === 'mk' || msgText === 'මොකෝ') {
                voiceUrl = 'https://github.com/Nethmina-dev/BOT-DATA/raw/refs/heads/main/Voice-notes/Mk.mp3';
            }

            
            if (voiceUrl !== '') {
                
                await conn.sendPresenceUpdate('recording', from);

                await conn.sendMessage(from, { 
                    audio: { url: voiceUrl }, 
                    mimetype: 'audio/mpeg', 
                    ptt: false
                }, { quoted: mek });
            }
       }
    } catch (e) {
        console.log("Auto Voice Error: ", e);
    }
});
