module.exports.config = {
    name: "autosetname",
    eventType: ["log:subscribe"],
    version: "1.0.3",
    credits: "Priyansh Rajput",
    description: "تعيين تلقائي لألقاب الأعضاء الجدد"
};

module.exports.run = async function ({ api, event, Users }) {
    const { threadID } = event;
    const memJoin = event.logMessageData.addedParticipants.map(info => info.userFbId);

    for (let idUser of memJoin) {
        const { readFileSync } = global.nodemodule["fs-extra"];
        const { join } = global.nodemodule["path"];
        const pathData = join("./modules/commands", "cache", "autosetname.json");

        let dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
        let thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, nameUser: [] };

        if (thisThread.nameUser.length === 0) return;

        const setName = thisThread.nameUser[0];
        await new Promise(resolve => setTimeout(resolve, 1000));
        const nameInfo = await api.getUserInfo(idUser);
        const originalName = nameInfo[idUser].name;

        api.changeNickname(`${setName} ${originalName}`, threadID, idUser);
    }

    const currentDate = new Date().toLocaleString("ar-EG", { timeZone: "Africa/Cairo" });
    const threadInfo = await api.getThreadInfo(threadID);

    return api.sendMessage(
`⊹ إشعار تلقائي ⊹
━━━━━━━━━━━━━━
تم تعيين لقب مؤقت للعضو الجديد في المجموعة: ${threadInfo.threadName}
➤ التاريخ: ${currentDate}
━━━━━━━━━━━━━━`,
        threadID,
        event.messageID
    );
};
