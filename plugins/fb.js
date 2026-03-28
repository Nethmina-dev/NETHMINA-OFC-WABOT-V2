const { cmd, commands } = require("../command");
const getFbVideoInfo = require("@xaviabot/fb-downloader");

cmd(
  {
    pattern: "fb",
    alias: ["facebook", "fbdown", "fbdl"],
    react: "🎥",
    desc: "Download Facebook Video",
    category: "download",
    filename: __filename,
  },
  async (danuwa, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("*Please provide a valid Facebook video URL!* ❤️");

      const fbRegex = /(https?:\/\/)?(www\.)?(facebook|fb)\.com\/.+/;
      if (!fbRegex.test(q))
        return reply("*Invalid Facebook URL! Please check and try again.* ☹️");

      reply("*Downloading your video...* ❤️");

      const result = await getFbVideoInfo(q);

      if (!result || (!result.sd && !result.hd)) {
        return reply("*Failed to download video. Please try again later.* ☹️");
      }

      const { title, sd, hd } = result;
      const bestQualityUrl = hd || sd;

      const desc = `
*📹 NETHMINA OFC FB DOWNLODER 📹*

*📍 Title:* ${title || "Unknown"}

*🎨 Quality:* ${qualityText}

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴇᴛʜᴍɪɴᴀ ᴏꜰᴄ ᴡᴀ-ʙᴏᴛ ||
`;

      await danuwa.sendMessage(
        from,
        {
          image: {
            url: "https://github.com/Nethmina-dev/BOT-DATA/blob/main/Logo/ChatGPT%20Image%20Mar%2018,%202026,%2005_47_58%20PM.png?raw=true",
          },
          caption: desc,
        },
        { quoted: mek }
      );

      await danuwa.sendMessage(
        from,
        {
          video: { url: bestQualityUrl },
          caption: `📥 *Downloaded in ${hd ? "HD" : "SD"} quality*`,
        },
        { quoted: mek }
      );

      return reply("Thank you for using NETHMINA OFC WA-BOT ❤️");
    } catch (e) {
      console.error(e);
      reply(`*Error:* ${e.message || e}`);
    }
  }
);
