module.exports.config = {
	name: "رصيد",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "Lona",
	description: "يعرض رصيدك او رصيد شخص معلم عليه",
	commandCategory: "اقتصاد",
	usages: "[تاك]",
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
	const { threadID, messageID, senderID, mentions } = event;

	if (!args[0]) {
		const money = (await Currencies.getData(senderID)).money;
		return api.sendMessage(getText("sotienbanthan", money), threadID, messageID);
	}

	else if (Object.keys(event.mentions).length == 1) {
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
};
