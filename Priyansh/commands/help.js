module.exports.config = {  
	name: "اوامر",  
	version: "1.0.4",  
	hasPermssion: 0,  
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 (تعديل: مترجم + زخرفة)",  
	description: "『قائمة اوامر البوت』",  
	commandCategory: "النظام",  
	usages: "[اسم_الأمر / رقم_الصفحة]",  
	cooldowns: 1,  
	envConfig: {  
		autoUnsend: false,  
		delayUnsend: 200  
	}  
};  

module.exports.languages = {  
	"ar": {  
		"moduleInfo": "»======『📜 تفاصيل الأمر 📜』======«\n⊹ 『الاسم』: %1\n⊹ 『الوصف』: %2\n⊹ 『الاستخدام』: %3\n⊹ 『الفئة』: %4\n⊹ 『وقت الانتظار』: %5 ثانية\n⊹ 『الصلاحية』: %6\n⊹ 『الكود بواسطة』: %7\n\n➤ مثال:\n  %3\n»================================«",  
		"helpList": '[ يوجد %1 أوامر في البوت، استخدم: "%2اوامر اسم_الأمر" لمعرفة طريقة الاستعمال! ]',  
		"user": "مستخدم",  
        "adminGroup": "ادمن المجموعة",  
        "adminBot": "ادمن البوت"  
	}  
};  

// شرح الأمر المفصل
module.exports.handleEvent = function ({ api, event, getText }) {  
	const { commands } = global.client;  
	const { threadID, messageID, body } = event;  

	if (!body || typeof body == "undefined" || body.indexOf("اوامر") != 0) return;  
	const splitBody = body.trim().split(/\s+/);  
	if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;  

	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};  
	const command = commands.get(splitBody[1].toLowerCase());  
	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;  

	const message = getText("moduleInfo", command.config.name, command.config.description || "لا يوجد وصف", `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits);

	return api.sendMessage(message, threadID, messageID);  
}  

// عرض قائمة الأوامر مع صفحات 30 أمر
module.exports.run = async function({ api, event, args, getText }) {  
	const { commands } = global.client;  
	const { threadID, messageID } = event;  
	const command = commands.get((args[0] || "").toLowerCase());  
	const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};  
	const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;  

	if (!command) {  
		const arrayInfo = [];  
		const page = parseInt(args[0]) || 1;  
		const numberOfOnePage = 30;  
		let i = 0;  
		let msg = "";  

		for (var [name] of (commands)) arrayInfo.push(name);  
		arrayInfo.sort();  

		const startSlice = numberOfOnePage * page - numberOfOnePage;  
		i = startSlice;  
		const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);  

		for (let item of returnArray) msg += `⊹ 『${++i}』 ${prefix}${item}\n`;  

		const header = `»====『قائمة الاوامر』====«\n➤ عدد الأوامر: ${arrayInfo.length}\n➤ اكتب: ${prefix}اوامر [اسم_الأمر] لعرض التفاصيل ⊹\n\n`;  
		const footer = `\n» الصفحة (${page}/${Math.ceil(arrayInfo.length/numberOfOnePage)}) «`;  

		api.sendMessage(header + msg + footer, threadID, (err, info) => {  
			if (!global.temp) global.temp = {};  
			if (!global.temp.commandPages) global.temp.commandPages = {};  
			global.temp.commandPages[threadID] = { page, messageID: info.messageID, arrayInfo, prefix, numberOfOnePage };  
		}, messageID);  
	}  
};  

// تعديل الرسالة عند تغيير الصفحة
module.exports.handleReply = function({ api, event }) {  
	const { body, threadID } = event;  
	if (!global.temp || !global.temp.commandPages || !global.temp.commandPages[threadID]) return;  

	const data = global.temp.commandPages[threadID];  
	const totalPages = Math.ceil(data.arrayInfo.length / data.numberOfOnePage);  
	let newPage = parseInt(body);  
	if (isNaN(newPage) || newPage < 1 || newPage > totalPages) return;  

	let i = (newPage - 1) * data.numberOfOnePage;  
	let msg = "";  
	const returnArray = data.arrayInfo.slice(i, i + data.numberOfOnePage);  
	for (let item of returnArray) msg += `⊹ 『${++i}』 ${data.prefix}${item}\n`;  

	const header = `»====『قائمة الاوامر』====«\n➤ عدد الأوامر: ${data.arrayInfo.length}\n➤ اكتب: ${data.prefix}اوامر [اسم_الأمر] لعرض التفاصيل ⊹\n\n`;  
	const footer = `\n» الصفحة (${newPage}/${totalPages}) «`;  

	api.editMessage(header + msg + footer, data.messageID, threadID);  
	global.temp.commandPages[threadID].page = newPage;  
};
