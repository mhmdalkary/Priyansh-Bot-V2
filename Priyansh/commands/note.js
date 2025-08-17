module.exports.config = {  
	name: "ملاحظة",  
	version: "1.0.1",  
	hasPermssion: 0,  
	credits: "Lona",  
	description: "تخصيص ملاحظات لكل مجموعة",  
	commandCategory: "المحادثة",  
	usages: "[اضف/حذف/الكل] [الملاحظة]",  
	cooldowns: 5,  
	dependencies: {  
        "fs-extra": "",  
        "path": ""  
    }  
}  
  
module.exports.onLoad = () => {  
    const { existsSync, writeFileSync } = global.nodemodule["fs-extra"];  
    const { join } = global.nodemodule["path"];  
    const pathData = join(__dirname, "cache", "notes.json");  
    if (!existsSync(pathData)) return writeFileSync(pathData, "[]", "utf-8");   
}  
  
module.exports.run = ({ event, api, args, permssion }) => {  
    const { threadID, messageID } = event;  
    const { readFileSync, writeFileSync } = global.nodemodule["fs-extra"];  
    const { join } = global.nodemodule["path"];  
  
    const pathData = join(__dirname, "cache", "notes.json");  
    const content = (args.slice(1, args.length)).join(" ");  
    var dataJson = JSON.parse(readFileSync(pathData, "utf-8"));  
    var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, listRule: [] };  
  
    // لو كتب الأمر بدون أي شي → يطلع تعليمات
    if (!args[0]) {
        return api.sendMessage(
            "📝 أوامر الملاحظات:\n\n" +
            "• ملاحظة اضف <نص> → لإضافة ملاحظة جديدة (مشرف فقط)\n" +
            "• ملاحظة عرض او الكل → لعرض كل الملاحظات\n" +
            "• ملاحظة حذف <رقم> → لحذف ملاحظة محددة (مشرف فقط)\n" +
            "• ملاحظة حذف الكل → لمسح جميع الملاحظات (مشرف فقط)",
            threadID,
            messageID
        );
    }

    switch (args[0]) {  
        case "اضف": {  
            if (permssion == 0) return api.sendMessage("[ملاحظة] ماعندك صلاحية لإضافة ملاحظات!", threadID, messageID);  
            if (content.length == 0) return api.sendMessage("[ملاحظة] لايمكن ترك المعلومة فارغة", threadID, messageID);  
            if (content.indexOf("\n") != -1) {  
                const contentSplit = content.split("\n");  
                for (const item of contentSplit) thisThread.listRule.push(item);  
            } else {  
                thisThread.listRule.push(content);  
            }  
            writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");  
            api.sendMessage('[ملاحظة] تمت إضافة الملاحظة بنجاح!', threadID, messageID);  
            break;  
        }  
        case "عرض":  
        case "الكل": {  
            var msg = "", index = 0;  
            for (const item of thisThread.listRule) msg += `${index+=1}/ ${item}\n`;  
            if (msg.length == 0) return api.sendMessage("[ملاحظة] مجموعتك ماعندها ملاحظات للعرض!", threadID, messageID);  
            api.sendMessage(`ملاحظات المجموعة:\n\n${msg}`, threadID, messageID);  
            break;  
        }  
        case "حذف": {  
            if (!isNaN(content) && content > 0) {  
                if (permssion == 0) return api.sendMessage("[ملاحظة] ماعندك صلاحية لحذف الملاحظات!", threadID, messageID);  
                if (thisThread.listRule.length == 0) return api.sendMessage("[ملاحظة] ماكو ملاحظات للحذف!", threadID, messageID);  
                thisThread.listRule.splice(content - 1, 1);  
                api.sendMessage(`[ملاحظة] تم حذف الملاحظة رقم ${content} بنجاح`, threadID, messageID);  
                break;  
            } else if (content == "الكل") {  
                if (permssion == 0) return api.sendMessage("[ملاحظة] ماعندك صلاحية لحذف الكل!", threadID, messageID);  
                if (thisThread.listRule.length == 0) return api.sendMessage("[ملاحظة] ماكو ملاحظات للحذف!", threadID, messageID);  
                thisThread.listRule = [];  
                api.sendMessage(`[ملاحظة] تم حذف جميع الملاحظات!`, threadID, messageID);  
                break;  
            }  
        }  
        default: {  
            if (thisThread.listRule.length != 0) {  
                var msg = "", index = 0;  
                for (const item of thisThread.listRule) msg += `${index+=1}/ ${item}\n`;  
                return api.sendMessage(`ملاحظات المجموعة:\n\n${msg}`, threadID, messageID);  
            } else return global.utils.throwError(this.config.name, threadID, messageID);  
        }  
    }  
  
    if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);  
    return writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");  
}
