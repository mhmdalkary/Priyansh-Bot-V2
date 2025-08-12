module.exports.config = {
	name: "leave",
	eventType: ["log:unsubscribe"],
	version: "1.0.0",
	credits: "Priyansh Rajput (تعديل: محمد)",
	description: "إشعار بمغادرة عضو أو إزالته من المجموعة مع صورة/فيديو/GIF عشوائي",
	dependencies: {
		"fs-extra": "",
		"path": ""
	}
};

module.exports.onLoad = function () {
    const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];

	const path = join(__dirname, "cache", "leaveGif", "randomgif");
	if (existsSync(path)) mkdirSync(path, { recursive: true });	

	const path2 = join(__dirname, "cache", "leaveGif", "randomgif");
    if (!existsSync(path2)) mkdirSync(path2, { recursive: true });

    return;
}

module.exports.run = async function({ api, event, Users, Threads }) {
	if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
	const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
	const { join } =  global.nodemodule["path"];
	const { threadID } = event;
  	const moment = require("moment-timezone");
  	const time = moment.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss");
  	const dateOnly = moment.tz("Asia/Kolkata").format("DD/MM/YYYY");
  	const hours = moment.tz("Asia/Kolkata").format("HH");
	const threadData = await Threads.getData(threadID);
	const groupName = threadData.threadInfo.threadName || "المجموعة";
	const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
	const type = (event.author == event.logMessageData.leftParticipantFbId) ? "غادر المجموعة" : "تمت إزالته من المجموعة";
	const path = join(__dirname, "events", "123.mp4");
	const pathGif = join(path, `${threadID}123.mp4`);
	var msg, formPush

	if (existsSync(path)) mkdirSync(path, { recursive: true });

	(typeof threadData.data.customLeave == "undefined") 
		? msg = `✿❀ ──────────── ✿❀
➤⊹ الإشعار: ${type}
➤⊹ الاسم: ${name}
➤⊹ المجموعة: ${groupName}
➤⊹ التاريخ: ${dateOnly}
✧ ✦ ──────────── ✧ ✦
${name} لم يعد ضمن ${groupName}.
★☆ نشكرك على وقتك ونتمنى لك التوفيق.
✿❀ ──────────── ✿❀`
		: msg = threadData.data.customLeave;

	msg = msg
		.replace(/\{name}/g, name)
		.replace(/\{type}/g, type)
		.replace(/\{group}/g, groupName)
		.replace(/\{date}/g, dateOnly)
		.replace(/\{time}/g, time);

	const randomPath = readdirSync(join(__dirname, "cache", "leaveGif", "randomgif"));

	if (existsSync(pathGif)) formPush = { body: msg, attachment: createReadStream(pathGif) }
	else if (randomPath.length != 0) {
		const pathRandom = join(__dirname, "cache", "leaveGif", "randomgif",`${randomPath[Math.floor(Math.random() * randomPath.length)]}`);
		formPush = { body: msg, attachment: createReadStream(pathRandom) }
	}
	else formPush = { body: msg }
	
	return api.sendMessage(formPush, threadID);
}
