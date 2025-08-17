const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytSearch = require("yt-search");

module.exports = {
  config: {
    name: "سمعيني",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "『𝐋𝐎𝐍𝐀』",
    description: "『»⊹ حمل اغنية او فيديو من اليوتيوب ⊹«』",
    commandCategory: "Media",
    usages: "سمعيني [اسم الاغنية]",
    cooldowns: 5,
    dependencies: {
      "node-fetch": "",
      "yt-search": "",
    },
  },

  run: async function ({ api, event, args }) {
    const songName = args.join(" ");
    if (!songName) {
      return api.sendMessage("『⊹ اكتب اسم الاغنية يا مز 😔 ⊹』", event.threadID, event.messageID);
    }

    try {
      const searchResults = await ytSearch(songName);
      if (!searchResults || !searchResults.videos.length) {
        throw new Error("ما لقيت شي على بحثك");
      }

      const top5 = searchResults.videos.slice(0, 5);
      let msg = "『»⊹ اختر رقم الاغنية من الخيارات ⊹«』\n\n";
      top5.forEach((video, i) => {
        msg += `${i + 1}. ${video.title}\n`;
      });
      msg += "\n➤⊹ رد برقم الاغنية عشان احملها لك";

      api.sendMessage(msg, event.threadID, (err, info) => {
        global.client.handleReply.push({
          type: "chooseSong",
          name: "سمعيني",
          messageID: info.messageID,
          author: event.senderID,
          results: top5
        });
      }, event.messageID);

    } catch (error) {
      console.error(error);
      api.sendMessage("『➤⊹ صار خطأ بالحمل ⊹➤』", event.threadID, event.messageID);
    }
  },

  handleReply: async function ({ api, event, handleReply }) {
    if (handleReply.author !== event.senderID) return;
    const choice = parseInt(event.body);
    if (isNaN(choice) || choice < 1 || choice > handleReply.results.length) {
      return api.sendMessage("『➤⊹ رقم غير صحيح ⊹➤』", event.threadID, event.messageID);
    }

    const chosen = handleReply.results[choice - 1];
    const videoId = chosen.videoId;
    const type = "audio";
    const apiKey = "priyansh-here";
    const apiUrl = `https://priyanshuapi.xyz/youtube?id=${videoId}&type=${type}&apikey=${apiKey}`;

    try {
      api.sendMessage("『»⊹ جاري التحميل ⊹«』", event.threadID, event.messageID);

      const downloadResponse = await axios.get(apiUrl);
      const downloadUrl = downloadResponse.data.downloadUrl;

      const safeTitle = chosen.title.replace(/[^a-zA-Z0-9 \-_]/g, "");
      const filename = `${safeTitle}.mp3`;
      const downloadPath = path.join(__dirname, "cache", filename);

      if (!fs.existsSync(path.dirname(downloadPath))) {
        fs.mkdirSync(path.dirname(downloadPath), { recursive: true });
      }

      const response = await axios({
        url: downloadUrl,
        method: "GET",
        responseType: "stream",
      });

      const fileStream = fs.createWriteStream(downloadPath);
      response.data.pipe(fileStream);

      await new Promise((resolve, reject) => {
        fileStream.on("finish", resolve);
        fileStream.on("error", reject);
      });

      await api.sendMessage({
        body: `『»⊹ ${chosen.title} ⊹«』\n➤⊹ تفضل الاغنية 🎧`,
        attachment: fs.createReadStream(downloadPath)
      }, event.threadID, () => fs.unlinkSync(downloadPath), event.messageID);

    } catch (err) {
      console.error(err);
      api.sendMessage("『 ما قدرت احمل الاغنية 』", event.threadID, event.messageID);
    }
  }
};
