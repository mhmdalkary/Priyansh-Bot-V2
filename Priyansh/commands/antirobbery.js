module.exports.config = {
    name: "منع",
    version: "1.0.0",
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    hasPermssion: 1,
    description: "منع تغيير مشرفين المجموعة",
    usages: "",
    commandCategory: "إدارة المجموعات",
    cooldowns: 0
};

module.exports.run = async ({ api, event, Threads }) => {
    const info = await api.getThreadInfo(event.threadID);
    if (!info.adminIDs.some(item => item.id == api.getCurrentUserID())) 
        return api.sendMessage('❌ لازم البوت يكون مشرف بالمجموعة، ضيفه كمشرف وحاول مرة ثانية', event.threadID, event.messageID);

    const data = (await Threads.getData(event.threadID)).data || {};
    if (typeof data["guard"] == "undefined" || data["guard"] == false) data["guard"] = true;
    else data["guard"] = false;

    await Threads.setData(event.threadID, { data });
    global.data.threadData.set(parseInt(event.threadID), data);

    return api.sendMessage(`✅ تم ${(data["guard"] == true) ? "تفعيل" : "ايقاف"} حماية المشرفين بنجاح`, event.threadID, event.messageID);
};
