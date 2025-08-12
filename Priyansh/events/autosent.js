module.exports.config = {
    name: "autosend",
    eventType: [],
    version: "0.0.1",
    credits: "Priyansh Rajput",
    description: "متابعة الأحداث وإرسال رسائل تلقائية"
};

module.exports.run = async ({ event, api, Threads, Users, args }) => {
    const moment = require("moment-timezone");
    const time = moment.tz('Asia/Kolkata').format('HH:mm:ss');
    let cantsend = [];
    const allThread = global.data.allThreadID || [];

    if (time === "16:52:00") {
        for (const idThread of allThread) {
            if (!isNaN(parseInt(idThread)) && idThread !== event.threadID) {
                api.sendMessage(`رسالة اختبار ${args ? args.join(" ") : ""}`, idThread, (error) => {
                    if (error) cantsend.push(idThread);
                });
            }
        }

        for (const adminID of global.config.ADMINBOT) {
            if (cantsend.length > 0) {
                api.sendMessage(
                    `خطأ أثناء الإرسال التلقائي للرسائل في المجموعات التالية:\n${cantsend.join("\n")}`,
                    adminID
                );
            }
        }
    }
};
