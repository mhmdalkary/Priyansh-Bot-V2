module.exports.config = {
	name: "قول",
	version: "1.1.1",
	hasPermssion: 0,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	description: "Bot Saying",
	commandCategory: "ai",
	usages: "[text/message/chat]",
	cooldowns: 5
};

module.exports.run = async ({ api, event,args }) => {
var say = args.join(" ")
	if (!say) api.sendMessage("اكتب رسالتك", event.threadID, event.messageID)
	else api.sendMessage(`${say}`, event.threadID, event.messageID);
}
