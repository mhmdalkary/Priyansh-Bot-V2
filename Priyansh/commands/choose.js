module.exports.config = {
	name: "اختاري",
	version: "1.0.1",
	hasPermssion: 0,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	description: "Thanks to the bot cho cho helped one of the things you need to do below",
	commandCategory: "Utilities",
	usages: "[خيار 1] | [خيار 2]",
	cooldowns: 5
};

module.exports.languages = {
	
	"ar": {
		"return": "%1 هو الأنسب لك، أعتقد ذلك :😊: "
	}
}

module.exports.run = async ({ api, event, args, getText }) => {
	const { threadID, messageID } = event;

	var input = args.join(" ").trim();
	if (!input) return global.utils.throwError(this.config.name, threadID, messageID);
	var array = input.split(" | ");
	return api.sendMessage(getText("return", array[Math.floor(Math.random() * array.length)]),threadID, messageID);
}
