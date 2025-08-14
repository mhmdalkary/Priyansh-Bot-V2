module.exports.config = {
name: "joinNoti",
eventType: ["log:subscribe"],
version: "1.0.2",
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

const pathVideo = join(__dirname, "cache", "joinvideo");  
if (!existsSync(pathVideo)) mkdirSync(pathVideo, { recursive: true });   

const pathGif = join(__dirname, "cache", "joinvideo", "randomgif");  
if (!existsSync(pathGif)) mkdirSync(pathGif, { recursive: true });  

return;

}

module.exports.run = async function({ api, event, Threads }) {
const { join } = global.nodemodule["path"];
const { threadID } = event;
const moment = require("moment-timezone");
const dateOnly = moment.tz("Asia/Kolkata").format("DD/MM/YYYY");
const fs = require("fs-extra");

// لو البوت هو اللي انضم  
if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {  
    const threadData = await Threads.getData(threadID);  
    const groupName = threadData.threadInfo.threadName || "المجموعة";  

    let attachment = [];  
    let videoPath = join(__dirname, "cache", "0648ed427d043e689a63b8e0328385a5.mp4");  
    if (fs.existsSync(videoPath)) attachment.push(fs.createReadStream(videoPath));  

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
attachment
},
threadID
);
}
// لو عضو جديد هو اللي انضم
else {
try {
const { createReadStream, existsSync, mkdirSync, readdirSync } = fs;
let { threadName, participantIDs } = await api.getThreadInfo(threadID);

const threadData = global.data.threadData.get(parseInt(threadID)) || {};  
        const groupName = threadName || "المجموعة";  
        const pathVideo = join(__dirname, "cache", "joinvideo");  
        const pathGif = join(pathVideo, `${threadID}.video`);  

        if (!existsSync(pathVideo)) mkdirSync(pathVideo, { recursive: true });  

        var mentions = [], nameArray = [], memLength = [], i = 0;  

        for (let user of event.logMessageData.addedParticipants) {  
            nameArray.push(user.fullName);  
            mentions.push({ tag: user.fullName, id: user.userFbId });  
            memLength.push(participantIDs.length - i++);  
        }  
        memLength.sort((a, b) => a - b);  

        const dateNow = moment.tz("Asia/Kolkata").format("DD/MM/YYYY");  

        let msg = (typeof threadData.customJoin == "undefined")   
        let attachment = [];  
        let videoPath = join(__dirname, "cache", "0648ed427d043e689a63b8e0328385a5.mp4");  
        if (fs.existsSync(videoPath)) attachment.push(fs.createReadStream(videoPath));  

            ? `✿❀ ─────────── ✿❀

➤⊹ مرحباً ${nameArray.join(', ')}
➤⊹ أنت العضو رقم ${memLength.join(', ')}
➤⊹ المجموعة: ${groupName}
➤⊹ التاريخ: ${dateNow}
✧ ✦ ────────── ✧ ✦
سعداء بانضمامك إلينا، نتمنى لك وقتاً ممتعاً.
★☆ تواصل وتعرف على الأعضاء وشاركنا النقاش.
✿❀ ─────────── ✿❀`
: threadData.customJoin;

let formPush = { body: msg, mentions };  

        // أولوية للفيديو الخاص بالقروب  
        if (existsSync(pathGif)) {  
            formPush.attachment = createReadStream(pathGif);  
        }   
        // بعدها ملفات الجيف العشوائية  
        else {  
            const randomFolder = join(__dirname, "cache", "joinvideo", "randomgif");  
            if (existsSync(randomFolder)) {  
                const randomFiles = readdirSync(randomFolder);  
                if (randomFiles.length > 0) {  
                    const randomFile = randomFiles[Math.floor(Math.random() * randomFiles.length)];  
                    formPush.attachment = createReadStream(join(randomFolder, randomFile));  
                }  
            }  
        }  

        return api.sendMessage(formPush, threadID);  
    } catch (e) {   
        console.log(e);  
    }  
}

}

