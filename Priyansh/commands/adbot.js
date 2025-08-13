module.exports.config = {
    name: "انفو",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "وصف عن البوت",
    commandCategory: "Media",
    usages: "",
    cooldowns: 4,
    dependencies: {
        "request": "",
        "fs": ""
    }
};

module.exports.run = async ({ api, event, args }) => {
    const fs = global.nodemodule["fs-extra"];
    const request = global.nodemodule["request"];
    const threadSetting = global.data.threadData.get(parseInt(event.threadID)) || {};
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

    if (args.length == 0) return api.sendMessage(
        `يمكنك استخدام الأوامر:\n\n` +
        `${prefix}${this.config.name} يوزر => يعرض معلوماتك.\n` +
        `${prefix}${this.config.name} يوزر @[الشخص] => يعرض معلومات الشخص المحدد.\n` +
        `${prefix}${this.config.name} جروب => يعرض معلومات المجموعة (عدد الأعضاء، المسؤولين، ...)\n` +
        `${prefix}${this.config.name} ادمن => معلومات مشرف البوت.`, event.threadID, event.messageID);

    if (args[0] == "جروب") {
        let tid = args[1] || event.threadID;
        let threadInfo = await api.getThreadInfo(tid);
        let img = threadInfo.imageSrc;
        let maleCount = 0, femaleCount = 0;
        for (let userID in threadInfo.userInfo) {
            let gender = threadInfo.userInfo[userID].gender;
            if (gender == "MALE") maleCount++;
            else femaleCount++;
        }
        let approval = threadInfo.approvalMode;
        let approvalText = approval === false ? "مغلق" : approval === true ? "مفتوح" : "غير معروف";

        if (!img) {
            return api.sendMessage(
                `اسم المجموعة: ${threadInfo.threadName}\n` +
                `المعرف: ${tid}\n` +
                `حالة الموافقة: ${approvalText}\n` +
                `الإيموجي: ${threadInfo.emoji}\n` +
                `عدد الأعضاء: ${threadInfo.participantIDs.length}\n` +
                `عدد المسؤولين: ${threadInfo.adminIDs.length}\n` +
                `الأعضاء ذكور: ${maleCount}، إناث: ${femaleCount}\n` +
                `إجمالي الرسائل: ${threadInfo.messageCount}`, event.threadID, event.messageID);
        } else {
            let callback = () => api.sendMessage({
                body: `اسم المجموعة: ${threadInfo.threadName}\n` +
                    `المعرف: ${tid}\n` +
                    `حالة الموافقة: ${approvalText}\n` +
                    `الإيموجي: ${threadInfo.emoji}\n` +
                    `عدد الأعضاء: ${threadInfo.participantIDs.length}\n` +
                    `عدد المسؤولين: ${threadInfo.adminIDs.length}\n` +
                    `الأعضاء ذكور: ${maleCount}، إناث: ${femaleCount}\n` +
                    `إجمالي الرسائل: ${threadInfo.messageCount}`,
                attachment: fs.createReadStream(__dirname + "/cache/1.png")
            }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);

            return request(encodeURI(threadInfo.imageSrc))
                .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
                .on('close', () => callback());
        }
    }

    if (args[0] == "ادمن") {
        let callback = () => api.sendMessage({
            body: `——— معلومات مشرف البوت ———\n` +
                `الاسم: HAMOD-HMADY\n` +
                `فيسبوك: https://m.facebook.com/ukidn\n` +
                `شكراً لاستخدامك بوت ${global.config.BOTNAME}`,
            attachment: fs.createReadStream(__dirname + "/cache/1.png")
        }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));

        return request(
            encodeURI("https://graph.facebook.com/100087632392287"))
            .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
            .on('close', () => callback());
    }

    if (args[0] == "يوزر") {
        let id;
        if (!args[1]) {
            if (event.type == "message_reply") id = event.messageReply.senderID;
            else id = event.senderID;
        } else if (event.mentions && Object.keys(event.mentions).length > 0) {
            id = Object.keys(event.mentions)[0];
        } else {
            id = args[1];
        }

        let data = await api.getUserInfo(id);
        let url = data[id].profileUrl;
        let isFriend = data[id].isFriend ? "نعم" : "لا";
        let sn = data[id].vanity;
        let name = data[id].name;
        let gender = data[id].gender == 2 ? "ذكر" : data[id].gender == 1 ? "أنثى" : "غير محدد";

        let callback = () => api.sendMessage({
            body: `الاسم: ${name}\n` +
                `رابط الحساب: ${url}\n` +
                `اسم المستخدم: ${sn}\n` +
                `المعرف: ${id}\n` +
                `الجنس: ${gender}\n` +
                `صديق للبوت: ${isFriend}`,
            attachment: fs.createReadStream(__dirname + "/cache/1.png")
        }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);

        return request(
            encodeURI(`https://graph.facebook.com/${id}/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`))
            .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
            .on('close', () => callback());
    }
};
