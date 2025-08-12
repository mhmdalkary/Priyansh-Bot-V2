module.exports.config = {
	name: "رانك",
	version: "2.0.0",
	hasPermssion: 0,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	description: "عرض ترتيب الأعضاء",
	commandCategory: "Group",
	usages: " [user] أو [tag]",
	cooldowns: 5,
	dependencies: {
		"fs-extra": "",
		"path": "",
		"jimp": "",
		"node-superfetch": "",
		"canvas": ""
	}
};

// باقي الكود مثل ما هو بدون تغيير

module.exports.run = async ({ event, api, args, Currencies, Users }) => {
	const fs = global.nodemodule["fs-extra"];
	
	let dataAll = (await Currencies.getAll(["userID", "exp"]));
	const mention = Object.keys(event.mentions);

	dataAll.sort((a, b) => {
		if (a.exp > b.exp) return -1;
		if (a.exp < b.exp) return 1;
	});

	if (args.length == 0) {
		const rank = dataAll.findIndex(item => parseInt(item.userID) == parseInt(event.senderID)) + 1;
		const name = global.data.userName.get(event.senderID) || await Users.getNameUser(event.senderID);
		if (rank == 0) return api.sendMessage("❌ خطأ  ⇣ حاول مرة ثانية بعد 5 ثواني", event.threadID, event.messageID);
		const point = await this.getInfo(event.senderID, Currencies);
		const timeStart = Date.now();
		let pathRankCard = await this.makeRankCard({ id: event.senderID, name, rank, ...point })
		return api.sendMessage({body: `⏳ استغرق : ${Date.now() - timeStart} مللي ثانية`, attachment: fs.createReadStream(pathRankCard, {'highWaterMark': 128 * 1024}) }, event.threadID, () => fs.unlinkSync(pathRankCard), event.messageID);
	}

	if (mention.length == 1) {
		const rank = dataAll.findIndex(item => parseInt(item.userID) == parseInt(mention[0])) + 1;
		const name = global.data.userName.get(mention[0]) || await Users.getNameUser(mention[0]);
		if (rank == 0) return api.sendMessage("❌ خطأ  ⇣ حاول مرة ثانية بعد 5 ثواني", event.threadID, event.messageID);
		let point = await this.getInfo(mention[0], Currencies);
		let pathRankCard = await this.makeRankCard({ id: mention[0], name, rank, ...point })
		return api.sendMessage({ attachment: fs.createReadStream(pathRankCard) }, event.threadID, () => fs.unlinkSync(pathRankCard), event.messageID);
	}

	if (mention.length > 1) {
		for (const userID of mention) {
			const rank = dataAll.findIndex(item => parseInt(item.userID) == parseInt(userID)) + 1;
			const name = global.data.userName.get(userID) || await Users.getNameUser(userID);
			if (rank == 0) return api.sendMessage("❌ خطأ  ⇣ حاول مرة ثانية بعد 5 ثواني", event.threadID, event.messageID);
			let point = await this.getInfo(userID, Currencies);
			let pathRankCard = await this.makeRankCard({ id: userID, name, rank, ...point })
			return api.sendMessage({ attachment: fs.createReadStream(pathRankCard) }, event.threadID, () => fs.unlinkSync(pathRankCard), event.messageID);
		}
	}
}
