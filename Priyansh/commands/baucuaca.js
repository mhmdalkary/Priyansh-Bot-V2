module.exports.config = {
	name: "رهان",
	version: "0.0.1",
	hasPermssion: 0,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	description: "ألعاب",
	commandCategory: "الألعاب",
	usages: "baucuaca 500",
	cooldowns: 5,
};

module.exports.run = async function({ api, event, args, Currencies }) {
            let { threadID, messageID, senderID } = event;
            const slotItems = ["تصويت","سلطعون","سمكة"];
			let money = (await Currencies.getData(event.senderID)).money;
			var coin = args.join(" ");
			if (!coin) return api.sendMessage(`لم تدخل مبلغ الرهان!`, threadID, messageID);
			let win = false;
			if (isNaN(coin)|| coin.indexOf("-") !== -1) return api.sendMessage(`مبلغ الرهان ليس رقماً، يرجى مراجعة الاستخدام على ${prefix}help baucuaca`, threadID, messageID);
			if (!coin) return api.sendMessage("لم يتم إدخال مبلغ الرهان!", threadID, messageID);
			if (coin > money) return api.sendMessage(`المبلغ لديك غير كافي`, threadID, messageID);
			if (coin < 50) return api.sendMessage(`مبلغ الرهان صغير جداً، الحد الأدنى هو 50$!`, threadID, messageID);
			let number = [];
			for (i = 0; i < 3; i++) number[i] = Math.floor(Math.random() * slotItems.length);
			if (number[0] == number[1] && number[1] == number[2]) {
				money *= 9;
				win = true;
			}
				else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) {
					money *= 2;
					win = true;
				}
				(win) ? api.sendMessage(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\nلقد فزت\nستستلم ${coin} دولار.`, threadID, () => Currencies.increaseMoney(senderID, parseInt(coin)), messageID) : api.sendMessage(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\nلقد خسرت\nالمبلغ الذي رهنته يذهب للبيت`, threadID, () => Currencies.decreaseMoney(senderID, parseInt(coin)), messageID);
}
