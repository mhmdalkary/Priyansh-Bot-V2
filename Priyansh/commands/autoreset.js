module.exports.config = {
    name: "اوتريست",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "إعادة تشغيل تلقائية",
    commandCategory: "النظام",
    cooldowns: 5
}

module.exports.handleEvent = async function({ api, event, args, Users, Threads }) {
    const moment = require("moment-timezone");
    var timeNow = moment.tz("Asia/Riyadh").format("HH:mm:ss"); // توقيت السعودية
    var idad = global.config.ADMINBOT;    
    console.log(timeNow)
    var seconds = moment.tz("Asia/Riyadh").format("ss");

    var times = [
        `12:00:${seconds}`, `11:00:${seconds}`, `10:00:${seconds}`,
        `09:00:${seconds}`, `08:00:${seconds}`, `07:00:${seconds}`,
        `06:00:${seconds}`, `05:00:${seconds}`, `04:00:${seconds}`,
        `03:00:${seconds}`, `02:00:${seconds}`, `01:00:${seconds}`
    ];

    if (times.includes(timeNow) && seconds < 6) {
        for (let ad of idad) {
            setTimeout(() =>
                api.sendMessage(`⚡️الوقت الآن: ${timeNow}\nسيتم إعادة تشغيل البوت`, ad, () => process.exit(1)), 1000
            );
        }
    }
}

module.exports.run = async ({ api, event, args }) => {
    const moment = require("moment-timezone");
    var timeNow = moment.tz("Asia/Riyadh").format("HH:mm:ss"); // توقيت السعودية
    api.sendMessage(`الوقت الآن: ${timeNow}`, event.threadID);
}
