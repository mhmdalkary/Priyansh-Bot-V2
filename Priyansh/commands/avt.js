module.exports.config = {
  name: "بروفايل",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
  description: "الحصول على صورة الملف الشخصي للناس باستخدامها",
  commandCategory: "أدوات",
  cooldowns: 0
};

module.exports.run = async function({ api, event, args, Threads }) {
  const request = require("request");
  const fs = require("fs")
  const axios = require("axios")
  const threadSetting = (await Threads.getData(String(event.threadID))).data || {};
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
  const mn = this.config.name
  if (!args[0]) return api.sendMessage(`[⚜️]=== صورة الملف الشخصي على فيسبوك ===[⚜️]\n\n[⚜️]→ ${prefix}${mn} box للحصول على صورة المجموعة\n\n[⚜️]→ ${prefix}${mn} id [اكتب المعرف] <للحصول على صورة المستخدم بالمعرف>\n\n[⚜️]→ ${prefix}${mn} link [الرابط] <للحصول على صورة مستخدم من الرابط>\n\n[⚜️]→ ${prefix}${mn} user <الأمر بدون وسيط للحصول على صورة ملفك الشخصي>\n\n[⚜️]→ ${prefix}${mn} user [@المذكورين] <للحصول على صورة المستخدَم المعلن عنه>`,event.threadID,event.messageID);
  
  if (args[0] == "box") {
    if(args[1]){ 
      let threadInfo = await api.getThreadInfo(args[1]);
      let imgg = threadInfo.imageSrc;
      if(!imgg) api.sendMessage(`[⚜️]→ صورة مجموعة ${threadInfo.threadName} غير موجودة`,event.threadID,event.messageID);
      else {
        var callback = () => api.sendMessage({body:`[⚜️]→ صورة مجموعة ${threadInfo.threadName} هنا`,attachment: fs.createReadStream(__dirname + "/cache/1.png")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID); 
        return request(encodeURI(`${threadInfo.imageSrc}`)).pipe(fs.createWriteStream(__dirname+'/cache/1.png')).on('close',() => callback());
      }
    }
    let threadInfo = await api.getThreadInfo(event.threadID);
    let img = threadInfo.imageSrc;
    if(!img) api.sendMessage(`[⚜️]→ صورة مجموعتك ${threadInfo.threadName} غير موجودة`,event.threadID,event.messageID)
    else {
      var callback = () => api.sendMessage({body:`[⚜️]→ صورة مجموعتك ${threadInfo.threadName} هنا`,attachment: fs.createReadStream(__dirname + "/cache/1.png")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);   
      return request(encodeURI(`${threadInfo.imageSrc}`)).pipe(fs
