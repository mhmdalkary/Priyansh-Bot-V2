module.exports.config = {
    name: "بحث",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "البحث في جوجل",
    commandCategory: "info",
    usages: "search [نص]",
    cooldowns: 5,
    dependencies: {
        "request":"",
        "fs":""
    }
};

module.exports.run = function({ api, event, args }) {
    let textNeedSearch = "";
    const regex = /(https?:\/\/.*?\.(?:png|jpe?g|gif)(?:\?(?:[\w_-]+=[\w_-]+)(?:&[\w_-]+=[\w_-]+)*)?(.*))($)/;

    // لو الرسالة رد على صورة ناخذ رابطها، وإلا ناخذ النص المكتوب
    (event.type == "message_reply") ? textNeedSearch = event.messageReply.attachments[0].url : textNeedSearch = args.join(" ");

    if (!textNeedSearch) return api.sendMessage("❌  الرجاء ارسال نص او الرد على صورة للبحث 🔍", event.threadID, event.messageID);

    if (regex.test(textNeedSearch)) {
        api.sendMessage(`🔎  هذا رابط البحث عن الصورة: \nhttps://www.google.com/searchbyimage?&image_url=${textNeedSearch}`, event.threadID, event.messageID);
    } else {
        api.sendMessage(`🔎  نتائج البحث عن: « ${textNeedSearch} » \nhttps://www.google.com.vn/search?q=${encodeURIComponent(textNeedSearch)}`, event.threadID, event.messageID);
    }
}
