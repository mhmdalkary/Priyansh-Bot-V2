const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
    name: "اخطبيلي3",
    version: "6.0",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐮𝐭 | تعديل محمد",
    description: "اعمل خطوبة مع توافق عشوائي وجنس مختلف",
    commandCategory: "Love",
    usages: "[@mention/reply]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async() => {
    const { resolve } = global.nodemodule["path"];
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { downloadFile } = global.utils;
    const dirMaterial = __dirname + `/cache/canvas/`;
    const pathImg = resolve(__dirname, 'cache/canvas', 'marrywi.png');
    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(pathImg)) await downloadFile("https://i.imgur.com/4ATHG80.png", pathImg);
}

async function circle(image) {
    let img = await jimp.read(image);
    img.circle();
    return await img.getBufferAsync("image/png");
}

async function makeImage({ one, two }) {
    const __root = path.resolve(__dirname, "cache", "canvas");
    const batgiam_img = await jimp.read(__root + "/marrywi.png");
    const pathImg = __root + `/married_${one}_${two}.png`;
    const avatarOne = __root + `/avt_${one}.png`;
    const avatarTwo = __root + `/avt_${two}.png`;

    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;

    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));

    const circleOne = await jimp.read(await circle(avatarOne));
    const circleTwo = await jimp.read(await circle(avatarTwo));

    batgiam_img.resize(432, 280)
                .composite(circleOne.resize(60, 60), 200, 23)
                .composite(circleTwo.resize(60, 60), 136, 40);

    const raw = await batgiam_img.getBufferAsync("image/png");
    fs.writeFileSync(pathImg, raw);
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);

    return pathImg;
}

module.exports.run = async function ({ event, api, args, usersData }) {    
    const { threadID, messageID, senderID } = event;
    let two, tag;

    // التاغ
    if (Object.keys(event.mentions).length > 0) {
        two = Object.keys(event.mentions)[0];
        tag = event.mentions[two].replace("@", "");
    }
    // الرد على رسالة
    else if (event.type == "message_reply") {
        two = event.messageReply.senderID;
        tag = "الشخص اللي رديت عليه";
    }
    // العشوائي
    else {
        const threadInfo = await api.getThreadInfo(threadID);
        const members = threadInfo.participantIDs.filter(id => id != senderID);
        let senderData = await usersData.get(senderID);
        let senderGender = senderData.gender; // 1 ذكر 2 انثى

        for (let i = 0; i < 30; i++) {
            const randomID = members[Math.floor(Math.random() * members.length)];
            const data = await usersData.get(randomID);
            if (data?.gender && data.gender !== senderGender) {
                two = randomID;
                tag = "شريك عشوائي";
                break;
            }
        }
        if (!two) return api.sendMessage("😿 ما لقيت شريك مناسب حاليا", threadID, messageID);
    }

    const lovePercent = Math.floor(Math.random() * 101);
    const pathImg = await makeImage({ one: senderID, two });

    return api.sendMessage({
        body: `💌 أحسست بالقلب يخفق! تم خطبتك مع ${tag} 💖\n🌟 نسبة التوافق بينكم: ${lovePercent}%`,
        attachment: fs.createReadStream(pathImg)
    }, threadID, () => fs.unlinkSync(pathImg), messageID);
}
