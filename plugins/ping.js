const { cmd } = require("../command");

cmd(
  {
    pattern: "ping",
    desc: "Bot response speed test",
    category: "main",
    filename: __filename,
  },
  async (nethmina, mek, m, { reply, from }) => {
    // 1️⃣ React to the message
    try {
      await nethmina.sendMessage(from, { react: { text: "🏓", key: mek.key } });
    } catch (e) {
      console.log("Reaction failed:", e);
    }
      // 1️⃣ Send initial "🏓 Pinging..." message
      const sentMsg = await nethmina.sendMessage(from, { text: "🏓 Pinging..." }, { quoted: mek });

      // 2️⃣ Calculate response time
      const start = Date.now();
      // Optional: do something here if needed
      const end = Date.now();

      // 3️⃣ Edit the previous message with the response time
      await nethmina.editMessageText(
        sentMsg.key, // the key of the message to edit
        `🏓 Pong! Response time: *${end - start}ms*`
      );
    } catch (err) {
      console.log("Ping command error:", err);
    }
  }
);
