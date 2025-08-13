module.exports.config = {
	name: "معلومات",
	version: "1.0.1", 
	hasPermssion: 0,
	credits: "Priyansh Rajput",
	description: "معلومات عن الأدمن والبوت",
	commandCategory: "معلومات",
	cooldowns: 1,
	dependencies: {
		"request": "",
		"fs-extra": "",
		"axios": ""
	}
};

module.exports.run = async function({ api,event,args,client,Users,Threads,__GLOBAL,Currencies }) {
	const axios = global.nodemodule["axios"];
	const request = global.nodemodule["request"];
	const fs = global.nodemodule["fs-extra"];
	const time = process.uptime(),
		hours = Math.floor(time / (60 * 60)),
		minutes = Math.floor((time % (60 * 60)) / 60),
		seconds = Math.floor(time % 60);
	const moment = require("moment-timezone");
	var currentTime = moment.tz("Asia/Dhaka").format("『D/MM/YYYY』 【HH:mm:ss】");

	// صورة حساب المطور من الفيس
	var images = [`https://graph.facebook.com/100087632392287/picture?width=512&height=512`];

	var sendMessage = () => api.sendMessage({
		body: `
✿❀ 『 معلومات الأدمن والبوت 』 ❀✿

➤ اسم البوت: 『 ${global.config.BOTNAME} 』

➤ صاحب البوت: 『M. Al-alakari』

➤ رابط فيسبوك الأدمن: 『 https://www.facebook.com/share/1633Xx7F7k/ 』

➤ للتواصل عبر إنستجرام: 『 @it0c_ 』

•••••••••••••••••••••••••••••••••

✧ بادئة البوت ✧ 『 ${global.config.PREFIX} 』

✧ صاحب البوت ✧ 『 M. Al-alakari 』

✧ مدة تشغيل البوت ✧
『 ${hours} ساعة : ${minutes} دقيقة : ${seconds} ثانية 』

✧ التاريخ والوقت الحالي ✧
『 ${currentTime} 』

✧ شكراً لاستخدامك بوت 『 ${global.config.BOTNAME} 』

➤⊹
		`,
		attachment: fs.createReadStream(__dirname + "/cache/juswa.jpg")
	}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/juswa.jpg"));

	return request(encodeURI(images[0])).pipe(fs.createWriteStream(__dirname+"/cache/juswa.jpg")).on("close", () => sendMessage());
};