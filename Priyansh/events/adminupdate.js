module.exports.config = {
    name: "adminUpdate",
    eventType: ["log:thread-admins","log:thread-name", "log:user-nickname","log:thread-icon","log:thread-color"],
    version: "1.0.1",
    credits: "Priyansh Rajput",
    description: "تحديث معلومات المجموعة بسرعة",
    envConfig: {
        sendNoti: true,
    }
};

module.exports.run = async function ({ event, api, Threads, Users }) {
    const fs = require("fs");
    const iconPath = __dirname + "/emoji.json";
    if (!fs.existsSync(iconPath)) fs.writeFileSync(iconPath, JSON.stringify({}));

    const { threadID, logMessageType, logMessageData } = event;
    const { setData, getData } = Threads;

    const thread = global.data.threadData.get(threadID) || {};
    if (typeof thread["adminUpdate"] !== "undefined" && thread["adminUpdate"] === false) return;

    try {
        let dataThread = (await getData(threadID)).threadInfo;

        switch (logMessageType) {
            case "log:thread-admins": {
                if (logMessageData.ADMIN_EVENT === "add_admin") {
                    dataThread.adminIDs.push({ id: logMessageData.TARGET_ID });
                    if (global.configModule[this.config.name].sendNoti) api.sendMessage(
`✧✦ إشعار ✦✧
➤⊹ تم ترقية المستخدم: ${logMessageData.TARGET_ID} إلى مشرف.`, threadID, async (error, info) => {
                        if (global.configModule[this.config.name].autoUnsend) {
                            await new Promise(r => setTimeout(r, global.configModule[this.config.name].timeToUnsend * 1000));
                            return api.unsendMessage(info.messageID);
                        }
                    });
                } else if (logMessageData.ADMIN_EVENT === "remove_admin") {
                    dataThread.adminIDs = dataThread.adminIDs.filter(item => item.id != logMessageData.TARGET_ID);
                    if (global.configModule[this.config.name].sendNoti) api.sendMessage(
`✧✦ إشعار ✦✧
➤⊹ تم إزالة المستخدم: ${logMessageData.TARGET_ID} من المشرفين.`, threadID, async (error, info) => {
                        if (global.configModule[this.config.name].autoUnsend) {
                            await new Promise(r => setTimeout(r, global.configModule[this.config.name].timeToUnsend * 1000));
                            return api.unsendMessage(info.messageID);
                        }
                    });
                }
                break;
            }
            case "log:thread-icon": {
                let preIcon = JSON.parse(fs.readFileSync(iconPath));
                dataThread.threadIcon = event.logMessageData.thread_icon || "👍";
                if (global.configModule[this.config.name].sendNoti) api.sendMessage(
`✧✦ تحديث المجموعة ✦✧
➤⊹ تم تغيير أيقونة المجموعة.
➤⊹ الأيقونة القديمة: ${preIcon[threadID] || "غير معروف"}`, threadID, async (error, info) => {
                    preIcon[threadID] = dataThread.threadIcon;
                    fs.writeFileSync(iconPath, JSON.stringify(preIcon));
                    if (global.configModule[this.config.name].autoUnsend) {
                        await new Promise(r => setTimeout(r, global.configModule[this.config.name].timeToUnsend * 1000));
                        return api.unsendMessage(info.messageID);
                    }
                });
                break;
            }
            case "log:thread-color": {
                dataThread.threadColor = event.logMessageData.thread_color || "🌤";
                if (global.configModule[this.config.name].sendNoti) api.sendMessage(
`✧✦ تحديث المجموعة ✦✧
➤⊹ تم تغيير لون المجموعة إلى: ${event.logMessageBody.replace("Theme", "اللون")}`, threadID, async (error, info) => {
                    if (global.configModule[this.config.name].autoUnsend) {
                        await new Promise(r => setTimeout(r, global.configModule[this.config.name].timeToUnsend * 1000));
                        return api.unsendMessage(info.messageID);
                    }
                });
                break;
            }
            case "log:user-nickname": {
                dataThread.nicknames[logMessageData.participant_id] = logMessageData.nickname;
                if (typeof global.configModule["nickname"] !== "undefined" && 
                    !global.configModule["nickname"].allowChange.includes(threadID) &&
                    !dataThread.adminIDs.some(item => item.id === event.author) || 
                    event.author === api.getCurrentUserID()) return;

                if (global.configModule[this.config.name].sendNoti) api.sendMessage(
`✧✦ إشعار ✦✧
➤⊹ تم تحديث لقب المستخدم: ${logMessageData.participant_id} إلى: ${(logMessageData.nickname.length === 0) ? "الاسم الأصلي" : logMessageData.nickname}`, threadID, async (error, info) => {
                    if (global.configModule[this.config.name].autoUnsend) {
                        await new Promise(r => setTimeout(r, global.configModule[this.config.name].timeToUnsend * 1000));
                        return api.unsendMessage(info.messageID);
                    }
                });
                break;
            }
            case "log:thread-name": {
                dataThread.threadName = event.logMessageData.name || "بدون اسم";
                if (global.configModule[this.config.name].sendNoti) api.sendMessage(
`✧✦ إشعار ✦✧
➤⊹ تم تحديث اسم المجموعة إلى: ${dataThread.threadName}`, threadID, async (error, info) => {
                    if (global.configModule[this.config.name].autoUnsend) {
                        await new Promise(r => setTimeout(r, global.configModule[this.config.name].timeToUnsend * 1000));
                        return api.unsendMessage(info.messageID);
                    }
                });
                break;
            }
        }
        await setData(threadID, { threadInfo: dataThread });
    } catch (e) {
        console.log(e);
    }
};
