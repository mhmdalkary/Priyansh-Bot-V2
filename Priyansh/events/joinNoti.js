module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "1.0.3",
    credits: "Priyansh Rajput (تعديل: محمد)",
    description: "إشعار بانضمام شخص جديد أو البوت للمجموعة مع فيديو ثابت",
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const pathCache = join(__dirname, "cache");
    if (!existsSync(pathCache)) mkdirSync(pathCache, { recursive: true });
};

module.exports.handleEvent = async function({ api, event, Threads }) {
    const { join } = global.nodemodule["path"];
    const fs = require("fs-extra");
    const moment = require("moment-timezone");
    const { threadID } = event;

    const dateOnly = moment.tz("Asia/Kolkata").format("DD/MM/YYYY");
    const videoPath = join(__dirname, "cache", "0648ed427d043e689a63b8e0328385a5.mp4");

    // تأكد إن الفيديو موجود
    if (!fs.existsSync(videoPath)) {
        console.log("⚠ ملف الفيديو غير موجود:", videoPath);
        return;
    }

    // لو البوت هو اللي انضم
    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        const threadData = await Threads.getData(threadID);
        const groupName = threadData.threadInfo.threadName || "المجموعة";

        return api.sendMessage({
            body: `✿❀ ─────────── ✿❀
➤⊹ البوت متصل الآن
➤⊹ المجموعة: ${groupName}
➤⊹ التاريخ: ${dateOnly}
✧ ✦ ─────────── ✧ ✦
مرحباً بالجميع، أنا ${global.config.BOTNAME || "البوت"}.
★☆ لعرض قائمة الأوامر اكتب: ${global.config.PREFIX}2اوامر
✿❀ ─────────── ✿❀`,
            attachment: fs.createReadStream(videoPath)
        }, threadID);
    }

    // لو عضو جديد هو اللي انضم
    let { threadName, participantIDs } = await api.getThreadInfo(threadID);
    const groupName = threadName || "المجموعة";

    let mentions = [], nameArray = [], memLength = [], i = 0;
    for (let user of event.logMessageData.addedParticipants) {
        nameArray.push(user.fullName);
        mentions.push({ tag: user.fullName, id: user.userFbId });
        memLength.push(participantIDs.length - i++);
    }
    memLength.sort((a, b) => a - b);

    let msg = `✿❀ ─────────── ✿❀
➤⊹ مرحباً ${nameArray.join(', ')}
➤⊹ أنت العضو رقم ${memLength.join(', ')}
➤⊹ المجموعة: ${groupName}
➤⊹ التاريخ: ${dateOnly}
✧ ✦ ────────── ✧ ✦
سعداء بانضمامك إلينا، نتمنى لك وقتاً ممتعاً
★☆ تواصل وتعرف على الأعضاء وشاركنا النقاش
✿❀ ─────────── ✿❀`;

    return api.sendMessage({
        body: msg,
        mentions,
        attachment: fs.createReadStream(videoPath)
    }, threadID);
};
