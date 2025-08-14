var limit = 20; // عدد الأعضاء لكل تحقق
module.exports.config = {
	name: "رتبة",
	version: "1.8.0",
	hasPermssion: 0,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	description: "تحقق من تفاعل الأعضاء في المجموعة",
	commandCategory: "المجموعة",
	usages: "[all/tag]",
	cooldowns: 5
};

module.exports.run = async function ({ args,Users,Threads, api, event, Currencies, getText }) {
    var mention = Object.keys(event.mentions);
    if (args[0] == "all") {
        var { participantIDs } =(await Threads.getData(event.threadID)).threadInfo;
        const listUserID = event.participantIDs;
        var exp = [];

        for(const idUser of listUserID) {
            const countMess = await Currencies.getData(idUser);
            exp.push({"name" : (typeof ((await Users.getData(idUser)).name) == "undefined") ? 0 : (await Users.getData(idUser)).name, "exp": (typeof countMess.exp == "undefined") ? 0 : countMess.exp, "uid": idUser});
        }
        exp.sort(function (a, b) { return b.exp - a.exp });

        var page = parseInt(args[1]) || 1;
        if(page < 1) page = 1;
        var msg = "\n\n";
        var numPage = Math.ceil(exp.length/limit);

        for(var i = limit*(page - 1); i < limit*(page-1) + limit; i++){
            if(i >= exp.length) break;
            let dataInfo = exp[i];
            msg += `${i+1}.${dataInfo.name}: ${dataInfo.exp} رسالة\n`
        }

        msg += `\nالصفحة ${page}/${numPage}\nاستخدم ${global.config.PREFIX}count all رقم الصفحة`
        return api.sendMessage(msg, event.threadID);
    }        
    else if(event.type == "message_reply") { 
        mention[0] = event.messageReply.senderID 
    }

    if (mention[0]) {
        const listUserID = event.participantIDs;
        exp = [];
        for(const idUser of listUserID) {
            const countMess = await Currencies.getData(idUser);
            exp.push({"name" : idUser.name, "exp": (typeof countMess.exp == "undefined") ? 0 : countMess.exp, "uid": idUser});
        }
        exp.sort(function (a, b) { return b.exp - a.exp });
        const rank = exp.findIndex(info => parseInt(info.uid) == parseInt(mention[0])) + 1;
        const infoUser = exp[rank - 1];
        return api.sendMessage(`${(await Users.getData(mention[0])).name} حالياً في المرتبة ${rank} بعدد ${infoUser.exp} رسالة`, event.threadID, event.messageID);
    }
    else {
        const listUserID = event.participantIDs;
        exp = [];
        for(const idUser of listUserID) {
            const countMess = await Currencies.getData(idUser);
            exp.push({"name" : idUser.name, "exp": (typeof countMess.exp == "undefined") ? 0 : countMess.exp, "uid": idUser});
        }
        exp.sort(function (a, b) { return b.exp - a.exp });
        const rank = exp.findIndex(info => parseInt(info.uid) == parseInt(event.senderID)) + 1;
        const infoUser = exp[rank - 1];
      
        return api.sendMessage(`أنت حالياً في المرتبة ${rank} بعدد ${infoUser.exp} رسالة`, event.threadID, event.messageID);
    }
}
