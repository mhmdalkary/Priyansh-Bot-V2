module.exports.config = {
    name: "قفل",
    version: "1.0.0",
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    hasPermssion: 1,
    description: "تشغيل أو ايقاف خاصية منع الخروج",
    usages: "antiout on/off",
    commandCategory: "النظام",
    cooldowns: 0
};

module.exports.run = async({ api, event, Threads}) => {
    let data = (await Threads.getData(event.threadID)).data || {};
    if (typeof data["antiout"] == "undefined" || data["antiout"] == false) {
        data["antiout"] = true;
    } else {
        data["antiout"] = false;
    }
    
    await Threads.setData(event.threadID, { data });
    global.data.threadData.set(parseInt(event.threadID), data);
    
    return api.sendMessage(`✅ تم ${(data["antiout"] == true) ? "تشغيل" : "ايقاف"} خاصية منع الخروج بنجاح!`, event.threadID);
        }
