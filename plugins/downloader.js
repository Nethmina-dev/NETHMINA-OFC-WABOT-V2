
const { cmd } = require("../command");
const { ytmp3 } = require("sadaslk-dlcore");
const yts = require("yt-search");

async function getYoutube(query) {
  const isUrl = /(youtube\.com|youtu\.be)/i.test(query);
  if (isUrl) {
    const id = query.split("v=")[1] || query.split("/").pop();
    const info = await yts({ videoId: id });
    return info;
  }

  const search = await yts(query);
  if (!search.videos.length) return null;
  return search.videos[0];
}

cmd(
  {
    pattern: "song",
    alias: ["mp3", "ytmp3", "music"],
    react: "🎶",
    desc: "Download Song",
    category: "download",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply }) => {
    try {

      if (!q) return reply("🎵 Send song name or YouTube link");

      reply("🔎 Searching YouTube...");
      const video = await getYoutube(q);
      if (!video) return reply("❌ No results found");

      // MP3 download first (to get size)
      const mp3 = await ytmp3(video.url);
      if (!mp3?.url) return reply("❌ Failed to download MP3");

      const fileSize = mp3.size || "Unknown";

      const caption = `
*🎧❤️ NETHMINA OFC SONG DOWNLOADER ❤️🎧*

┌───────────────────
├ *📀 Title:* ${video.title}
├ *⏱️ Duration:* ${video.timestamp}
├ *📆 Uploaded:* ${video.ago}
├ *👁️ Views:* ${video.views.toLocaleString()}
├ *👍 Likes:* ${video.likes || "N/A"}
├ *📡 Channel:* ${video.author?.name || "Unknown"}
├ *🔗 Watch/Download:* ${video.url}
├ *📥 Size:* ${fileSize}
└───────────────────

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴇᴛʜᴍɪɴᴀ ᴏꜰᴄ ||
`;

      await bot.sendMessage(
        from,
        {
          image: { url: video.thumbnail },
          caption,
        },
        { quoted: mek }
      );

      reply("⬇️ Downloading MP3...");

      await bot.sendMessage(
        from,
        {
          audio: { url: mp3.url },
          mimetype: "audio/mpeg",
          fileName: `${video.title}.mp3`
        },
        { quoted: mek }
      );

    } catch (e) {
      console.log("YTMP3 ERROR:", e);
      reply("❌ Error while downloading MP3");
    }
  }
);

cmd(
  {
    pattern: "video",
    alias: ["ytv", "mp4", "ytmp4"],
    react: "🎥",
    desc: "Download YouTube MP4 by name or link",
    category: "download",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("🎬 Send video name or YouTube link");

      reply("🔎 Searching YouTube...");
      const video = await getYoutube(q);
      if (!video) return reply("❌ No results found");

      const caption = `
*🎬 NETHMINA OFC VIDEO DOWNLOADER 🎬*

┌───────────────────
├ *📀 Title:* ${video.title}
├ *📡 Channel:* ${video.author?.name || "Unknown"}
├ *⏱️ Duration:* ${video.timestamp}
├ *📆 Uploaded:* ${video.ago}
├ *👁️ Views:* ${video.views.toLocaleString()}
├ *🔗 Watch/Download:* ${video.url}
└───────────────────

> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ɴᴇᴛʜᴍɪɴᴀ ᴏꜰᴄ ||
`;

      await bot.sendMessage(
        from,
        {
          image: { url: video.thumbnail },
          caption,
        },
        { quoted: mek }
      );

      reply("⬇️ Downloading video...");

      const data = await ytmp4(video.url, {
        format: "mp4",
        videoQuality: "360",
      });

      if (!data?.url) return reply("❌ Failed to download video");

      await bot.sendMessage(
        from,
        {
          video: { url: data.url },
          mimetype: "video/mp4",
          fileName: data.filename || "youtube_video.mp4",
          caption: "🎬 Your video is ready!",
          gifPlayback: false,
        },
        { quoted: mek }
      );

    } catch (e) {
      console.log("YTMP4 ERROR:", e);
      reply("❌ Error while downloading video");
    }
  }
);


cmd(
  {
    pattern: "tiktok",
    alias: ["tt"],
    react: "📹",
    desc: "Download TikTok video",
    category: "download",
    filename: __filename,
  },
  async (bot, mek, m, { from, q, reply }) => {
    try {
      if (!q) return reply("📱 Send TikTok link");

      reply("⬇️ Downloading TikTok video...");

      const data = await tiktok(q);
      if (!data?.no_watermark)
        return reply("❌ Failed to download TikTok video");

      const caption =
        `🎵 *${data.title || "TikTok Video"}*\n\n` +
        `👤 Author: ${data.author || "Unknown"}\n` +
        `⏱ Duration: ${data.runtime}s`;

      await bot.sendMessage(
        from,
        {
          video: { url: data.no_watermark },
          caption,
        },
        { quoted: mek }
      );
    } catch (e) {
      console.log("TIKTOK ERROR:", e);
      reply("❌ Error while downloading TikTok video");
    }
  }
);

