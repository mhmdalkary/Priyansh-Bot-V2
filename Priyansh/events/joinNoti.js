module.exports.config = {
    name: "joinNoti",
    eventType: ["log:subscribe"],
    version: "1.0.1",
    credits: "Priyansh Rajput (تعديل: محمد)",
    description: "إشعار بانضمام شخص جديد أو البوت للمجموعة مع صورة/فيديو/GIF عشوائي",
    dependencies: {
        "fs-extra": "",
        "path": "",
        "pidusage": ""
    }
};
 
module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
 
    const path = join(__dirname, "cache", "joinvideo");
    if (existsSync(path)) mkdirSync(path, { recursive: true }); 
 
    const path2 = join(__dirname, "cache", "joinvideo", "randomgif");
    if (!existsSync(path2)) mkdirSync(path2, { recursive: true });
 
    return;
}
 
module.exports.run = async function({ api, event, Threads }) {
    const { join } = global.nodemodule["path"];
    const { threadID } = event;
    const moment = require("moment-timezone");
    const dateOnly = moment.tz("Asia/Kolkata").format("DD/MM/YYYY");

    if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
        const fs = require("fs");
        const threadData = await Threads.getData(threadID);
        const groupName = threadData.threadInfo.threadName || "المجموعة";
        
        return api.sendMessage(
            { 
                body: `✿❀ ─────────── ✿❀
➤⊹ البوت متصل الآن
➤⊹ المجموعة: ${groupName}
➤⊹ التاريخ: ${dateOnly}
✧ ✦ ─────────── ✧ ✦
مرحباً بالجميع، أنا ${global.config.BOTNAME || "البوت"}.
★☆ لعرض قائمة الأوامر اكتب: ${global.config.PREFIX}2اوامر
✿❀ ─────────── ✿❀`,
                attachment: fs.createReadStream(__dirname + "/cache/0648ed427d043e689a63b8e0328385a5.mp4") 
            }, 
            threadID
        );
    } else {
        try {
            const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
            let { threadName, participantIDs } = await api.getThreadInfo(threadID);
 
            const threadData = global.data.threadData.get(parseInt(threadID)) || {};
            const groupName = threadName || "المجموعة";
            const path = join(__dirname, "cache", "joinvideo");
            const pathGif = join(path, `${threadID}.video`);
 
            var mentions = [], nameArray = [], memLength = [], i = 0;
            
            for (let id in event.logMessageData.addedParticipants) {
                const userName = event.logMessageData.addedParticipants[id].fullName;
                nameArray.push(userName);
                mentions.push({ tag: userName, id });
                memLength.push(participantIDs.length - i++);
            }
            memLength.sort((a, b) => a - b);

            const dateNow = moment.tz("Asia/Kolkata").format("DD/MM/YYYY");
            
            (typeof threadData.customJoin == "undefined") 
                ? msg = `✿❀ ─────────── ✿❀
➤⊹ مرحباً ${nameArray.join(', ')}
➤⊹ أنت العضو رقم ${memLength.join(', ')}
➤⊹ المجموعة: ${groupName}
➤⊹ التاريخ: ${dateNow}
✧ ✦ ────────── ✧ ✦
سعداء بانضمامك إلينا، نتمنى لك وقتاً ممتعاً.
★☆ تواصل وتعرف على الأعضاء وشاركنا النقاش.
✿❀ ─────────── ✿❀`
                : msg = threadData.customJoin;
 
            if (existsSync(path)) mkdirSync(path, { recursive: true });
 
            const randomPath = readdirSync(join(__dirname, "cache", "joinGif", "randomgif"));
 
            if (existsSync(pathGif)) formPush = { body: msg, attachment: createReadStream(pathGif), mentions }
            else if (randomPath.length != 0) {
                const pathRandom = join(__dirname, "cache", "joinGif", "randomgif", `${randomPath[Math.floor(Math.random() * randomPath.length)]}`);
                formPush = { body: msg, attachment: createReadStream(pathRandom), mentions }
            }
            else formPush = { body: msg, mentions }
 
            return api.sendMessage(formPush, threadID);
        } catch (e) { 
            return console.log(e) 
        };
    }
}
