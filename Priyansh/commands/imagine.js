module.exports.config = {
  name: "تخيل",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Priyansh Rajput (تعديل محمد)",
  description: "توليد صورة من وصف",
  commandCategory: "image",
  usages: "تخيل [الوصف]",
  cooldowns: 2,
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require("axios");
  const fs = require("fs-extra");
  const translate = require("@vitalets/google-translate-api");
  
  let { threadID, messageID } = event;
  let query = args.join(" ");
  if (!query) return api.sendMessage("✏️ اكتب وصف للصورة", threadID, messageID);

  try {
    // لو النص عربي يترجم للانجليزي
    const arabicRegex = /[\u0600-\u06FF]/;
    if (arabicRegex.test(query)) {
      let translated = await translate(query, { to: "en" });
      query = translated.text;
    }

    let path = __dirname + `/cache/poli.png`;
    const poli = (
      await axios.get(`https://image.pollinations.ai/prompt/${encodeURIComponent(query)}`, {
        responseType: "arraybuffer",
      })
    ).data;

    fs.writeFileSync(path, Buffer.from(poli, "utf-8"));
    api.sendMessage(
      {
        body: `🖼️ صورة متولدة من الوصف:\n"${query}"`,
        attachment: fs.createReadStream(path),
      },
      threadID,
      () => fs.unlinkSync(path),
      messageID
    );
  } catch (e) {
    api.sendMessage("⚠️ حصل خطأ: " + e.message, threadID, messageID);
  }
};
