var request = require("request");
const { readdirSync, readFileSync, writeFileSync, existsSync, copySync, createWriteStream, createReadStream } = require("fs-extra");
module.exports.config = {
	name: "المشرفين",
	version: "1.0.5",
	hasPermssion: 0,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	description: "إعدادات المسؤول",
	commandCategory: "admin",
	usages: "المسؤول",
    cooldowns: 2,
    dependencies: {
        "fs-extra": ""
    }
};

module.exports.languages = {
    "en": {
        "listAdmin": `===「 قائمة مشرفين البوت 」===\n━━━━━━━━━━━━━━━\n%1\n\n==「 𝗡𝗚𝗨̛𝗢̛̀𝗜 𝗛𝗢̂̃ 𝗧𝗥𝗢̛̣ 𝗕𝗢𝗧 」==\n━━━━━━━━━━━━━━━\n%2`,
        "notHavePermssion": '𝗠𝗢𝗗𝗘 - ليس لديك الصلاحية لاستخدام وظيفة "%1"',
        "addedNewAdmin": '𝗠𝗢𝗗𝗘 - تم إضافة %1 مستخدم كمسؤول للبوت\n\n%2',
        "addedNewNDH": '𝗠𝗢𝗗𝗘 - تم إضافة %1 مستخدم كمساعد\n\n%2',
        "removedAdmin": '𝗠𝗢𝗗𝗘 - تم إزالة صلاحية المسؤول عن %1 مستخدم وأصبحوا أعضاء\n\n%2',
        "removedNDH": '𝗠𝗢𝗗𝗘 - تم إزالة صلاحية المساعد عن %1 مستخدم وأصبحوا أعضاء\n\n%2'
    },
    "ar": {
        "listAdmin": '[المسؤول] قائمة المسؤولين: \n\n%1',
        "notHavePermssion": '[المسؤول] ليس لديك صلاحية لاستخدام "%1"',
        "addedNewAdmin": '[المسؤول] تم إضافة %1 مسؤول :\n\n%2',
        "removedAdmin": '[المسؤول] تم إزالة %1 مسؤول:\n\n%2'
    }
}
module.exports.onLoad = function() {
    const { writeFileSync, existsSync } = require('fs-extra');
    const { resolve } = require("path");
    const path = resolve(__dirname, 'cache', 'data.json');
    if (!existsSync(path)) {
        const obj = {
            adminbox: {}
        };
        writeFileSync(path, JSON.stringify(obj, null, 4));
    } else {
        const data = require(path);
        if (!data.hasOwnProperty('adminbox')) data.adminbox = {};
        writeFileSync(path, JSON.stringify(data, null, 4));
    }
}
module.exports.run = async function ({ api, event, args, Users, permssion, getText }) {  
    const content = args.slice(1, args.length);
    if (args.length == 0) return api.sendMessage({body:`=== [ إعدادات المسؤول ] ===\n━━━━━━━━━━━━━━━\n𝗠𝗢𝗗𝗘 - قائمة المسؤولين => عرض قائمة المسؤولين والمساعدين\n𝗠𝗢𝗗𝗘 - إضافة مسؤول => إضافة مستخدم كمسؤول\n𝗠𝗢𝗗𝗘 - إزالة مسؤول => إزالة صلاحية مسؤول\n𝗠𝗢𝗗𝗘 - إضافة مساعد => إضافة مستخدم كمساعد\n𝗠𝗢𝗗𝗘 - إزالة مساعد => إزالة صلاحية مساعد\n𝗠𝗢𝗗𝗘 - تفعيل وضع المسؤولين فقط => تفعيل وضع يسمح للمسؤولين فقط باستخدام البوت\n𝗠𝗢𝗗𝗘 - تفعيل وضع المساعدين فقط => تفعيل وضع يسمح للمساعدين فقط باستخدام البوت\n𝗠𝗢𝗗𝗘 - تفعيل وضع المسؤولين فقط في المحادثة الخاصة => تفعيل وضع يسمح للمسؤولين فقط باستخدام البوت في الرسائل الخاصة منفصلة عن البوتات\n━━━━━━━━━━━━━━━\n𝗛𝗗𝗦𝗗 => ${global.config.PREFIX}𝗮𝗱𝗺𝗶𝗻 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𝗹𝗶𝘀𝘁`}, event.threadID, event.messageID); 
    const { threadID, messageID, mentions } = event;
    const { configPath } = global.client;
    const { ADMINBOT } = global.config;
    const { NDH } = global.config;
    const { userName } = global.data;
    const { writeFileSync } = global.nodemodule["fs-extra"];
    const mention = Object.keys(mentions);

    delete require.cache[require.resolve(configPath)];
    var config = require(configPath);
    switch (args[0]) {
        case "list":
        case "all":
        case "-a": { 
          listAdmin = ADMINBOT || config.ADMINBOT ||  [];
            var msg = [];
            for (const idAdmin of listAdmin) {
                if (parseInt(idAdmin)) {
                  const name = (await Users.getData(idAdmin)).name
                    msg.push(`الاسم: ${name}\n» رابط فيسبوك: https://www.facebook.com/${idAdmin} 💌`);
                }
            }
          listNDH = NDH || config.NDH ||  [];
            var msg1 = [];
            for (const idNDH of listNDH) {
                if (parseInt(idNDH)) {
                  const name1 = (await Users.getData(idNDH)).name
                    msg1.push(`الاسم: ${name1}\n» رابط فيسبوك: https://www.facebook.com/${idNDH} 🤖`);
                }
            }

            return api.sendMessage(getText("listAdmin", msg.join("\n\n"), msg1.join("\n\n")), threadID, messageID);
        }

        case "add": { 
            if (event.senderID != 100087632392287) return api.sendMessage(`𝗠𝗢𝗗𝗘 - ليس لديك صلاحيات كافية`, event.threadID, event.messageID)
            if (permssion != 3) return api.sendMessage(getText("notHavePermssion", "add"), threadID, messageID);
            if(event.type == "message_reply") { content[0] = event.messageReply.senderID }
            if (mention.length != 0 && isNaN(content[0])) {
                var listAdd = [];

                for (const id of mention) {
                    ADMINBOT.push(id);
                    config.ADMINBOT.push(id);
                    listAdd.push(`${id} - ${event.mentions[id]}`);
                };

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("addedNewAdmin", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
            }
            else if (content.length != 0 && !isNa
