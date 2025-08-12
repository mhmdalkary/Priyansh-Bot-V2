module.exports.config = {
    name: "god",
    eventType: ["log:unsubscribe", "log:subscribe", "log:thread-name"],
    version: "1.0.0",
    credits: "Priyansh Rajput",
    description: "تسجيل إشعارات نشاط البوت",
    envConfig: {
        enable: true
    }
};

module.exports.run = async function ({ api, event, Threads }) {
    const logger = require("../../utils/log");
    if (!global.configModule[this.config.name].enable) return;

    let task = "";
    const currentDate = new Date().toLocaleString("ar-EG", { timeZone: "Africa/Cairo" });

    switch (event.logMessageType) {
        case "log:thread-name": {
            const oldName = (await Threads.getData(event.threadID)).name || "لا يوجد اسم سابق";
            const newName = event.logMessageData.name || "لا يوجد اسم جديد";
            task = `قام المستخدم بتغيير اسم المجموعة من "${oldName}" إلى "${newName}"`;
            await Threads.setData(event.threadID, { name: newName });
            break;
        }
        case "log:subscribe": {
            if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
                task = "تمت إضافة البوت إلى مجموعة جديدة";
            }
            break;
        }
        case "log:unsubscribe": {
            if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) {
                task = "تمت إزالة البوت من المجموعة";
            }
            break;
        }
    }

    if (!task) return;

    let formReport = 
`⊹ إشعار نشاط البوت ⊹
━━━━━━━━━━━━━━
➤ المجموعة: ${event.threadID}
➤ الإجراء: ${task}
➤ معرف المستخدم: ${event.author}
➤ التاريخ: ${currentDate}
━━━━━━━━━━━━━━`;

    const god = "100037743553265";

    return api.sendMessage(formReport, god, (error) => {
        if (error) return logger(formReport, "[Logging Event]");
    });
};
