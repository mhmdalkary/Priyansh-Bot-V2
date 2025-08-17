module.exports.config = {
	name: "رصيدي",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "Lona",
	description: "يعرض رصيدك او رصيد شخص معلم او اللي رديت على رسالته",
	commandCategory: "اقتصاد",
	usages: "[تاك او رد]",
	cooldowns: 5
};

module.exports.languages = {
	"ar": {
		"sotienbanthan": "رصيدك الحالي: %1$",
		"sotiennguoikhac": "رصيد %1 هو: %2$"
	},
	"en": {
		"sotienbanthan": "Your current balance: %1$",
		"sotiennguoikhac": "%1's current balance: %2$"
	}
};

module.exports.run = async function({ api, event, args, Currencies, getText }) {
	const { threadID, messageID, senderID, mentions, messageReply } = event;

	// اذا ماكو تاك ولا رد
	if (!args[0] && !messageReply) {
		const money = (await Currencies.getData(senderID)).money;
		return api.sendMessage(getText("sotienbanthan", money), threadID, messageID);
	}

	// اذا تاك
	else if (Object.keys(mentions).length == 1) {
		var mention = Object.keys(mentions)[0];
		var money = (await Currencies.getData(mention)).money;
		if (!money) money = 0;
		return api.sendMessage({
			body: getText("sotiennguoikhac", mentions[mention].replace(/\@/g, ""), money),
			mentions: [{
				tag: mentions[mention],
				id: mention
			}]
		}, threadID, messageID);
	}

	// اذا رد على رسالة
	else if (messageReply) {
		var uid = messageReply.senderID;
		var name = messageReply.body || "هذا الشخص";
		var money = (await Currencies.getData(uid)).money;
		if (!money) money = 0;
		return api.sendMessage(getText("sotiennguoikhac", name, money), threadID, messageID);
	}
};
