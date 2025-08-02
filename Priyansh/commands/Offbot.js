module.exports.config = {
	name: "انتحر",
	version: "1.0.0",
	hasPermssion: 2,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	description: "turn the bot off",
	commandCategory: "system",
	cooldowns: 0
        };
module.exports.run = ({event, api}) =>{
    const permission = ["100087632392287", "100087632392287"];
  	if (!permission.includes(event.senderID)) return api.sendMessage("[ خطأ ] لا تحاول معندك صلاحيات ، فقط حمود يقدر يطفي البوت", event.threadID, event.messageID);
  api.sendMessage(`[ تم ] ${global.config.BOTNAME} البوت مات من الزعل مش هيرد ع حد 💔💔💔.`,event.threadID, () =>process.exit(0))
}
