const { cmd } = require("../command");

cmd(
  {
    pattern: "ping",
    desc: "Bot response speed test",
    category: "main",
    filename: __filename,
  },
  async (nethmina, mek, m, { from }) => {
    try {
      // 1️⃣ React to the original message
      try {
        await nethmina.sendMessage(from, { react: { text: "🏓", key: mek.key } });
      } catch (e) {
        console.log("Reaction failed:", e);
      }

      // 2️⃣ Send initial "🏓 Pinging..." message
      const sentMsg = await nethmina.sendMessage(
        from,
        { text: "🏓 Pinging..." },
        { quoted: mek }
      );

      // 3️⃣ Calculate response time
      const start = Date.now();
      const end = Date.now();

      // 4️⃣ Edit the previous message with response time
      await nethmina.sendMessage(
        from,
        { text: `🏓 Pong! Response time: *${end - start}ms*` },
        { quoted: mek, edit: sentMsg.key }
      );
    } catch (err) {
      console.log("Ping command error:", err);
    }
  }
);
