module.exports.config = {
    name: "قبول",
    version: "1.0.2",
    hasPermssion: 2,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "الموافقة على المجموعات لاستخدام البوت",
    commandCategory: "admin",
    cooldowns: 5
};

const dataPath = __dirname + "/Priyanshu/approvedThreads.json";
const dataPending = __dirname + "/Priyanshu/pendingdThreads.json";
const fs = require("fs");

module.exports.onLoad = () => {
    if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify([]));
    if (!fs.existsSync(dataPending)) fs.writeFileSync(dataPending, JSON.stringify([]));
};

module.exports.handleReply = async function ({ event, api, handleReply, args }) {
    if (handleReply.author != event.senderID) return;
    const { body, threadID, messageID } = event;
    const { type } = handleReply;
    let data = JSON.parse(fs.readFileSync(dataPath));
    let dataP = JSON.parse(fs.readFileSync(dataPending));
    let idBox = (args[0]) ? args[0] : threadID;

    switch (type) {
        case "pending": {
            if (body === `A`) {
                data.push(idBox);
                fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
                api.sendMessage(`✅ تمت الموافقة على المجموعة:\n${idBox}`, threadID, () => {
                    dataP.splice(dataP.indexOf(idBox), 1);
                    fs.writeFileSync(dataPending, JSON.stringify(dataP, null, 2));
                }, messageID);
            }
        }
    }
};

module.exports.run = async ({ event, api, args, Threads, Users }) => {
    const { threadID, messageID } = event;
    let data = JSON.parse(fs.readFileSync(dataPath));
    let dataP = JSON.parse(fs.readFileSync(dataPending));
    let msg = "";
    let lydo = args.splice(2).join(" ");
    let idBox = (args[0]) ? args[0] : threadID;

    if (args[0] === "list" || args[0] === "l") {
        msg = `📋 قائمة المجموعات الموافق عليها: ${data.length}`;
        let count = 0;
        for (let e of data) {
            let threadInfo = await api.getThreadInfo(e);
            let threadName = threadInfo.threadName ? threadInfo.threadName : await Users.getNameUser(e);
            msg += `\n${++count}. ${threadName}\n${e}`;
        }
        api.sendMessage(msg, threadID, messageID);

    } else if (args[0] === "pending" || args[0] === "p") {
        msg = `⌛ المجموعات بانتظار الموافقة: ${dataP.length}`;
        let count = 0;
        for (let e of dataP) {
            let threadInfo = await api.getThreadInfo(e);
            let threadName = threadInfo.threadName ? threadInfo.threadName : await Users.getNameUser(e);
            msg += `\n${++count}. ${threadName}\n${e}`;
        }
        api.sendMessage(msg, threadID, (error, info) => {
            global.client.handleReply.push({
                name: this.config.name,
                messageID: info.messageID,
                author: event.senderID,
                type: "pending",
            });
        }, messageID);

    } else if (args[0] === "help" || args[0] === "h") {
        const tst = (await Threads.getData(String(event.threadID))).data || {};
        const pb = (tst.hasOwnProperty("PREFIX")) ? tst.PREFIX : global.config.PREFIX;
        return api.sendMessage(
            `📌 أوامر الموافقة:\n\n${pb}approve list/l → عرض المجموعات الموافق عليها\n${pb}approve pending/p → عرض المجموعات التي تنتظر الموافقة\n${pb}approve del/d <ID> → إزالة مجموعة من القائمة\n${pb}approve <ID> → الموافقة على مجموعة معينة`,
            threadID, messageID
        );

    } else if (args[0] === "del" || args[0] === "d") {
        idBox = (args[1]) ? args[1] : event.threadID;
        if (isNaN(parseInt(idBox))) return api.sendMessage("❌ الرقم غير صحيح", threadID, messageID);
        if (!data.includes(idBox)) return api.sendMessage("❌ هذه المجموعة ليست في القائمة", threadID, messageID);
        api.sendMessage(`🚫 تم إزالة مجموعتك من القائمة. السبب: ${lydo}`, idBox);
        data.splice(data.indexOf(idBox), 1);
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        api.sendMessage("✅ تمت الإزالة من القائمة بنجاح", threadID, messageID);

    } else if (isNaN(parseInt(idBox))) {
        api.sendMessage("❌ المعرف الذي أدخلته غير صالح", threadID, messageID);

    } else if (data.includes(idBox)) {
        api.sendMessage(`ℹ️ المعرف ${idBox} موجود مسبقًا بالقائمة`, threadID, messageID);

    } else {
        api.sendMessage(`✅ تم الموافقة على مجموعتك بنجاح!`, idBox, () => {
            data.push(idBox
