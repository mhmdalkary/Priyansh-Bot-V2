const { downloadVideo } = require('priyansh-all-dl');
const axios = require("axios");
const fs = require("fs-extra");
const tempy = require('tempy');

module.exports.config = {
    name: "انستا",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Priyansh Rajput",
    description: "Downloads Instagram video from HD link when user sends .انستا",
    commandCategory: "utility",
    usages: "انستا [Instagram video URL]",
    cooldowns: 5,
    dependencies: {
        "priyansh-all-dl": "latest",
        "axios": "0.21.1",
        "fs-extra": "10.0.0",
        "tempy": "0.4.0"
    }
};

module.exports.run = async function({ api, event, args }) {
    if (!args[0]) return api.sendMessage("اكتب رابط الإنستغرام بعد .انستا", event.threadID, event.messageID);

    const url = args[0];
    if (!url.startsWith("https://www.instagram.com/share/") && !url.startsWith("https://www.instagram.com/reel/")) {
        return api.sendMessage("الرابط مو صحيح", event.threadID, event.messageID);
    }

    try {
        const videoInfo = await downloadVideo(url);
        const hdLink = videoInfo.video;
        const response = await axios.get(hdLink, { responseType: 'stream' });
        const tempFilePath = tempy.file({ extension: 'mp4' });
        const writer = fs.createWriteStream(tempFilePath);
        response.data.pipe(writer);

        writer.on('finish', async () => {
            const attachment = fs.createReadStream(tempFilePath);
            await api.sendMessage({ attachment, body: "هاذي الفيديو اللي طلبته:" }, event.threadID);
            fs.unlinkSync(tempFilePath);
        });

        writer.on('error', (err) => {
            console.error("Error writing file:", err);
            api.sendMessage("حصل خطأ أثناء معالجة الفيديو، جرب مرة ثانية", event.threadID, event.messageID);
        });
    } catch (error) {
        console.error('Error downloading Instagram video:', error);
        api.sendMessage("حصل خطأ أثناء تحميل الفيديو، جرب مرة ثانية", event.threadID, event.messageID);
    }
};
