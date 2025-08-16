module.exports.config = {
    name: "حضن2",
    version: "7.3.1",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "أرسل حضن 🥰",
    commandCategory: "img",
    usages: "[@تاغ] | الرد على رسالة",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async () => {
    const { resolve } = global.nodemodule["path"];
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { downloadFile } = global.utils;
    const dirMaterial = __dirname + `/cache/canvas/`;
    const path = resolve(__dirname, 'cache/canvas', 'hugv3.png');
    if (!existsSync(dirMaterial + "canvas")) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(path)) await downloadFile("https://i.imgur.com/7lPqHjw.jpg", path);
}

async function makeImage({ one, two }) {
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    const axios = global.nodemodule["axios"];
    const jimp = global.nodemodule["jimp"];
    const __root = path.resolve(__dirname, "cache", "canvas");

    let base_img = await jimp.read(__root + "/hugv3.png");
    let pathImg = __root + `/hug_${one}_${two}.png`;

    // تحميل صورة المستخدم الأول
    let avatarOne = __root + `/avt_${one}.png`;
    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));

    // تحميل صورة المستخدم الثاني
    let avatarTwo = __root + `/avt_${two}.png`;
    let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));

    // تحويل الصور لدائرية
    let circleOne = await jimp.read(await circle(avatarOne));
    let circleTwo = await jimp.read(await circle(avatarTwo));

    // دمج الصور على الخلفية
    base_img.composite(circleOne.resize(150, 150), 320, 100).composite(circleTwo.resize(130, 130), 280, 280);

    let raw = await base_img.getBufferAsync("image/png");

    fs.writeFileSync(pathImg, raw);
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);

    return pathImg;
}

async function circle(image) {
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}

module.exports.run = async function ({ event, api }) {
    const fs = global.nodemodule["fs-extra"];
    const { threadID, messageID, senderID } = event;

    // التحقق من التاغ أو الرد
    let mention = Object.keys(event.mentions);
    let targetID;
    if (mention[0]) targetID = mention[0];
    else if (event.type === "message_reply") targetID = event.messageReply.senderID;
    else return api.sendMessage("يرجى عمل تاغ أو الرد على رسالة الشخص الذي تريد حضنه 😔", threadID, messageID);

    const one = senderID;
    const two = targetID;

    return makeImage({ one, two }).then(path => api.sendMessage({ body: "🥰 حضنك وصل!", attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID));
}
