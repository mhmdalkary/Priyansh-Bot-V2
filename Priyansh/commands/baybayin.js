module.exports.config = {
	name: "بايباين",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	description: "تحويل النص إلى Baybayin",
	commandCategory: "أدوات",
	usages: "baybayin [النص]",
	cooldowns: 5
};

module.exports.run = async ({ api, event,args }) => {
const axios = global.nodemodule["axios"];
let timkiem = args.join(" ");
const res = await axios.get(`https://api-baybayin-transliterator.vercel.app/?text=${timkiem}`);
var userName = res.data.baybay;
return api.sendMessage(`${userName}`, event.threadID, event.messageID)
}
