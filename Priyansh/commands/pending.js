module.exports.config = {
	name: "قبول", // اسم الأمر
	version: "1.0.5",
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	hasPermssion: 2, // صلاحيات الأدمن
	description: "إدارة رسائل الانتظار للبوت",
	commandCategory: "النظام",
	cooldowns: 5
};

module.exports.languages = {
    "ar": {
        "invaildNumber": "%1 رقم غير صالح",
        "cancelSuccess": "تم رفض %1 مجموعة بنجاح!",
        "notiBox": "✅ تم قبول مجموعتك من الأدمن وتقدر تستخدم البوت",
        "approveSuccess": "✅ تم قبول %1 مجموعة بنجاح!",

        "cantGetPendingList": "ما قدرت أجيب قائمة المجموعات المعلقة!",
        "returnListPending": "「قيد الانتظار」 ❮ عدد المجموعات اللي تحتاج موافقة: %1 مجموعة ❯\n\n%2",
        "returnListClean": "「قيد الانتظار」 مافي أي مجموعة معلقة حاليا"
    }
}

module.exports.handleReply = async function({ api, event, handleReply, getText }) {
    if (String(event.senderID) !== String(handleReply.author)) return;
    const { body, threadID, messageID } = event;
    var count = 0;

    if (isNaN(body) && body.indexOf("c") == 0 || body.indexOf("cancel") == 0) {
        const index = (body.slice(1, body.length)).split(/\s+/);
        for (const singleIndex of index) {
            if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > handleReply.pending.length) 
                return api.sendMessage(getText("invaildNumber", singleIndex), threadID, messageID);

            api.removeUserFromGroup(api.getCurrentUserID(), handleReply.pending[singleIndex - 1].threadID);
            count+=1;
        }
        return api.sendMessage(getText("cancelSuccess", count), threadID, messageID);
    }
    else {
        const index = body.split(/\s+/);
        for (const singleIndex of index) {
            if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > handleReply.pending.length) 
                return api.sendMessage(getText("invaildNumber", singleIndex), threadID, messageID);

            api.sendMessage(getText("notiBox"), handleReply.pending[singleIndex - 1].threadID);
            count+=1;
        }
        return api.sendMessage(getText("approveSuccess", count), threadID, messageID);
    }
}

module.exports.run = async function({ api, event, getText }) {
	const { threadID, messageID } = event;
    const commandName = this.config.name;
    var msg = "", index = 1;

    try {
		var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
		var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
	} catch (e) { 
        return api.sendMessage(getText("cantGetPendingList"), threadID, messageID) 
    }

	const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);

    for (const single of list) 
        msg += `${index++}/ ${single.name} (${single.threadID})\n`;

    if (list.length != 0) 
        return api.sendMessage(getText("returnListPending", list.length, msg), threadID, (error, info) => {
            global.client.handleReply.push({
                name: commandName,
                messageID: info.messageID,
                author: event.senderID,
                pending: list
            })
        }, messageID);
    else 
        return api.sendMessage(getText("returnListClean"), threadID, messageID);
}
