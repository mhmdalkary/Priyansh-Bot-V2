module.exports.config = {
	name: "جيفواي",
	version: "0.0.1",
	hasPermssion: 0,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	description: "",
	commandCategory: "اخرى",
	usages: "[انشاء/تفاصيل/انضم/سحب/انهاء] [ID السحب]",
	cooldowns: 5
};

module.exports.handleReaction = async ({ api, event, Users, handleReaction }) => {
	let data = global.data.GiveAway.get(handleReaction.ID);
	if (data.status == "close" || data.status == "ended") return;
	if (event.reaction == undefined) {
		data.joined.splice(data.joined.indexOf(event.userID), 1);
		global.data.GiveAway.set(handleReaction.ID, data);
		var value = await api.getThreadInfo(event.threadID);
		if (!(value.nicknames)[event.userID]) value = (await Users.getInfo(event.userID)).name;
		else value = (value.nicknames)[event.userID];
		return api.sendMessage(`➤ ${value} 『غادر』 السحب ذو المعرف: #${handleReaction.ID}`, event.userID);
	}
	data.joined.push(event.userID);
	global.data.GiveAway.set(handleReaction.ID, data);
	var value = await api.getThreadInfo(event.threadID);
	if (!(value.nicknames)[event.userID]) value = (await Users.getInfo(event.userID)).name;
	else value = (value.nicknames)[event.userID];
	return api.sendMessage(`➤ ${value} 『انضم بنجاح』 الى السحب ذو المعرف: #${handleReaction.ID}`, event.userID);
}

module.exports.run = async ({ api, event, args, Users }) => {
	if (!global.data.GiveAway) global.data.GiveAway = new Map();
	if (args[0] == "انشاء") {
		let reward = args.slice(1).join(" ");
		let randomNumber = (Math.floor(Math.random() * 100000) + 100000).toString().substring(1);
		var value = await api.getThreadInfo(event.threadID);
		if (!(value.nicknames)[event.senderID]) value = (await Users.getInfo(event.senderID)).name;
		else value = (value.nicknames)[event.senderID];
		api.sendMessage(
			"»======『السحب』======«" +
			"\n➤ انشأه: " + value +
			"\n➤ الجائزة: " + reward +
			"\n➤ معرف السحب: #" + randomNumber +
			"\n⊹ تفاعل مع هذه الرسالة للانضمام للسحب"
			, event.threadID, (err, info) => {
				let dataGA = {
					"ID": randomNumber,
					"author": value,
					"authorID": event.senderID,
					"messageID": info.messageID,
					"reward": reward,
					"joined": [],
					"status": "open"
				}
				global.data.GiveAway.set(randomNumber, dataGA);
				client.handleReaction.push({
					name: this.config.name,
					messageID: info.messageID,
					author: event.senderID,
					ID: randomNumber
				})
			}
		)
	}
	else if (args[0] == "تفاصيل") {
		let ID = args[1].replace("#", "");
		if (!ID) return api.sendMessage("➤ يجب ان تكتب معرف السحب لعرض التفاصيل ⊹", event.threadID, event.messageID);
		let data = global.data.GiveAway.get(ID);
		if (!data) return api.sendMessage("➤ معرف السحب الذي ادخلته غير موجود ⊹", event.threadID, event.messageID);
		return api.sendMessage(
			"»======『السحب』======«" +
			"\n➤ انشأه: " + data.author + "(" + data.authorID + ")" +
			"\n➤ الجائزة: " + data.reward +
			"\n➤ معرف السحب: #" + data.ID +
			"\n➤ عدد الاعضاء المشاركين: " + data.joined.length + " شخص" +
			"\n➤ الحالة: " + data.status
			, event.threadID, data.messageID
		);
	}
	else if (args[0] == "انضم") {
		let ID = args[1].replace("#", "");
		if (!ID) return api.sendMessage("➤ يجب ان تكتب معرف السحب للانضمام ⊹", event.threadID, event.messageID);
		let data = global.data.GiveAway.get(ID);
		if (!data) return api.sendMessage("➤ معرف السحب الذي ادخلته غير موجود ⊹", event.threadID, event.messageID);
		if (data.joined.includes(event.senderID)) return api.sendMessage("➤ لقد انضممت مسبقًا لهذا السحب ⊹", event.threadID);
		data.joined.push(event.senderID);
		global.data.GiveAway.set(ID, data);
		var value = await api.getThreadInfo(event.threadID);
		if (!(value.nicknames)[event.userID]) value = (await Users.getInfo(event.senderID)).name;
		else value = (value.nicknames)[event.userID];
		return api.sendMessage(`➤ ${value} 『انضم بنجاح』 الى السحب ذو المعرف: #${ID}`, event.senderID);
	}
	else if (args[0] == "سحب") {
		let ID = args[1].replace("#", "");
		if (!ID) return api.sendMessage("➤ يجب ان تكتب معرف السحب ⊹", event.threadID, event.messageID);
		let data = global.data.GiveAway.get(ID);
		if (!data) return api.sendMessage("➤ معرف السحب الذي ادخلته غير موجود ⊹", event.threadID, event.messageID);
		if (data.authorID !== event.senderID) return api.sendMessage("➤ انت لست منشئ هذا السحب ⊹", event.threadID, event.messageID);
		let winner = data.joined[Math.floor(Math.random() * data.joined.length)];
		let userInfo = await Users.getInfo(winner);
		var name = userInfo.name;
		return api.sendMessage({
			body: `『مبروك』 ${name}, لقد فزت بالسحب ذو المعرف: #${data.ID}\n➤ تواصل مع: ${data.author}(https://fb.me/${data.authorID})`,
			mentions: [{
				tag: name,
				id: winner
			}]
		}, event.threadID, event.messageID);
	}
	else if (args[0] == "انهاء") {
		let ID = args[1].replace("#", "");
		if (!ID) return api.sendMessage("➤ يجب ان تكتب معرف السحب ⊹", event.threadID, event.messageID);
		let data = global.data.GiveAway.get(ID);
		if (!data) return api.sendMessage("➤ معرف السحب الذي ادخلته غير موجود ⊹", event.threadID, event.messageID);
		if (data.authorID !== event.senderID) return api.sendMessage("➤ انت لست منشئ هذا السحب ⊹", event.threadID, event.messageID);
		data["status"] = "ended";
		global.data.GiveAway.set(ID, data);
		api.unsendMessage(data.messageID);
		return api.sendMessage(`➤ تم انهاء السحب ذو المعرف: #${data.ID} بواسطة 『${data.author}』`, event.threadID, event.messageID);
	}
	else return global.utils.throwError(this.config.name, event.threadID, event.messageID);
}
