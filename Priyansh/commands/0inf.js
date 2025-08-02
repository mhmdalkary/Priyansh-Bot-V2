module.exports.config = {
	name: "معلومات",
	version: "1.0.1", 
	hasPermssion: 0,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	description: "Admin and Bot info.",
	commandCategory: "...",
	cooldowns: 1,
	dependencies: 
	{
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};
module.exports.run = async function({ api,event,args,client,Users,Threads,__GLOBAL,Currencies }) {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
const time = process.uptime(),
		hours = Math.floor(time / (60 * 60)),
		minutes = Math.floor((time % (60 * 60)) / 60),
		seconds = Math.floor(time % 60);
const moment = require("moment-timezone");
var juswa = moment.tz("Asia/Dhaka").format("『D/MM/YYYY』 【HH:mm:ss】");
var link =                                     
["https://i.imgur.com/eDbdlvd.jpg"];
var callback = () => api.sendMessage({body:` ╾━╤デ╦︻(▀̿Ĺ̯▀̿ ̿)🇱🇾 معلومات البوت والمطور 🇱🇾 
(⌐▀͡ ̯ʖ▀)︻̷┻̿═━一-

☄️أسم البوت☄️  ${global.config.BOTNAME}

🔥مطور البوت🔥☞︎︎︎☜︎︎︎✰ HMOD'😾🤍

🙈رابط المطور عالف 🙈➪ www.facebook.com/ukidn

👋 يوزر المطور تلي 👉 @it0c

✧══════•❁❀❁•══════✧

🌸بادئة البوت🌸☞︎︎︎☜︎︎︎✰ ${global.config.PREFIX}

♥️مطور البوت♥️ ☞︎︎︎☜︎︎︎✰ HMOD'

🥳وقت التشغيل🥳

🌪️اليوم هو🌪️ ☞︎︎︎☜︎︎︎✰ ${juswa} 

⚡البوت شغال⚡ ${hours}:${minutes}:${seconds}.

✅شكرا لأستخدام ${global.config.BOTNAME} Bot🖤


🦢🍒•••ꞪɛᏒɛ ɪʂ ɮ❍┼ ❍ωɳɜɽ ɳaʍɜ•••🌷💞
┏━🕊️━━°❀•°:🎀🧸💙🧸🎀:°•❀°━━💞━┓
🌸✦✧✧✧✧✰🍒MEKO*BOT🌿✰✧✧✧✧✦🌸
┗━🕊️━━°❀•°:🎀🧸💙🧸🎀:°•❀°━━💞━┛


`,attachment: fs.createReadStream(__dirname + "/cache/juswa.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/juswa.jpg")); 
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/juswa.jpg")).on("close",() => callback());
   };
