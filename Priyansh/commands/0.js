const fs = require("fs");
module.exports.config = {
	name: "مم",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭", 
	description: "Don't Change Credits",
	commandCategory: "no prefix",
	usages: "xxx",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("xxxx")==0 || event.body.indexOf("x")==0 || event.body.indexOf("xx")==0 || event.body.indexOf("xxx")==0) {
		var msg = {
				body: "🥵 ahh Fuck 🥵",
				attachment: fs.createReadStream(__dirname + `/noprefix/xf.mp3`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("💦", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

  }
