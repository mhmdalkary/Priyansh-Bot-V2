module.exports.config = {
    name: "اوتنيم",
    version: "1.0.1",
    hasPermssion: 1,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "تعيين الاسم تلقائي للأعضاء الجدد",
    commandCategory: "مجموعات الدردشة",
    usages: "[تعيين <الاسم> /حذف] ",
    cooldowns: 5
}

module.exports.onLoad = () => {
    const { existsSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const pathData = join(__dirname, "cache", "autosetname.json");
    if (!existsSync(pathData)) return writeFileSync(pathData, "[]", "utf-8"); 
}

module.exports.run = async function  ({ event, api, args, permssionm, Users })  {
    const { threadID, messageID } = event;
    const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

    const pathData = join(__dirname, "cache", "autosetname.json");
    const content = (args.slice(1, args.length)).join(" ");
    var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));
    var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, nameUser: [] };
    switch (args[0]) {
        case "تعيين": {
            if (content.length == 0) return api.sendMessage("يجب ألا يكون اسم العضو الجديد فارغًا!", threadID, messageID);
            if (thisThread.nameUser.length > 0) return api.sendMessage("يرجى حذف اسم العضو القديم قبل تعيين اسم جديد!!!", threadID, messageID); 
            thisThread.nameUser.push(content);
            const name = (await Users.getData(event.senderID)).name;
            if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);
            writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
            api.sendMessage(`تم تعيين اسم جديد للعضو بنجاح\nالمعاينة: ${content} ${name}`, threadID, messageID);
            break;
        }
        case "rm":
        case "remove":
        case "حذف": {
            if (thisThread.nameUser.length == 0) return api.sendMessage("لم تقم بتعيين اسم لأعضاء المجموعة بعد!!", threadID, messageID);
            thisThread.nameUser = [];
            if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);
            writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
            api.sendMessage(`تم حذف تعيين اسم العضو الجديد بنجاح`, threadID, messageID);
            break;
        }
        default: {
            api.sendMessage(`الاستخدام: autosetname add لتعيين اسم جديد للعضو\nأو autosetname remove لحذف تعيين الاسم`, threadID, messageID);
        }
    }
}
