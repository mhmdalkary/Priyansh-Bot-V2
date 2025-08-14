module.exports.config = {
name: "استطلاع",
version: "1.0.0",
hasPermssion: 0,
credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
description: "عرض معلومات المجموعة فقط",
commandCategory: "box",
usages: "/استطلاع",
cooldowns: 1,
dependencies: {
"request":"",
"fs-extra":""
}
};

module.exports.run = async({api, event, args}) => {
const fs = global.nodemodule["fs-extra"];
const request = global.nodemodule["request"];

var threadInfo = await api.getThreadInfo(event.threadID);
let threadMem = threadInfo.participantIDs.length;
var gendernam = [];
var gendernu = [];
var nope = [];
for (let z in threadInfo.userInfo) {
var gioitinhone = threadInfo.userInfo[z].gender;
var nName = threadInfo.userInfo[z].name;  

	if (gioitinhone == 'MALE') {  
		gendernam.push(z + gioitinhone);  
	} else if (gioitinhone == 'FEMALE') {  
		gendernu.push(gioitinhone);  
	} else {  
		nope.push(nName);  
	}  
}  

var nam = gendernam.length;  
var nu = gendernu.length;  
let qtv = threadInfo.adminIDs.length;  
let sl = threadInfo.messageCount;  
let icon = threadInfo.emoji;  
let threadName = threadInfo.threadName;  
let id = threadInfo.threadID;  
var listad = '';  
var qtv2 = threadInfo.adminIDs;  
for (let i = 0; i < qtv2.length; i++) {
const infu = (await api.getUserInfo(qtv2[i].id));
const name = infu[qtv2[i].id].name;
listad += '•' + name + '\n';
}

let sex = threadInfo.approvalMode;
var pd = sex == false ? '❌ إيقاف' : sex == true ? '✅ تشغيل' : '⭕ غير معروف';

var callback = () =>
api.sendMessage(
{
body: `➤⊹ 『اسم المجموعة』: ${threadName}\n➤⊹ 『معرف المجموعة』: ${id}\n➤⊹ ${pd}\n➤⊹ 『رمز تعبيري』: ${icon}\n➤⊹ -المعلومات:\n➤⊹ إجمالي الأعضاء: ${threadMem}\n➤⊹ الذكور: ${nam}\n➤⊹ الإناث: ${nu}\n➤⊹ عدد المسؤولين: ${qtv} يشمل:\n${listad}\n➤⊹ إجمالي الرسائل: ${sl} رسالة`,
attachment: fs.createReadStream(__dirname + '/cache/1.png')
},
event.threadID,
() => fs.unlinkSync(__dirname + '/cache/1.png'),
event.messageID
);

return request(encodeURI(`${threadInfo.imageSrc}`))
.pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
.on('close', () => callback());
}
