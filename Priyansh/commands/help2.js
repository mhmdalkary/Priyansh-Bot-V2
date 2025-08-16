module.exports.config = {
  name: "اوامر2",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
  description: "دليل المبتدئين",
  commandCategory: "نظام",
  usages: "[اسم المودول]",
  cooldowns: 1,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 300
  }
};

module.exports.languages = {
  "ar": {    
    "moduleInfo": "「 %1 」\n%2\n\n❯ الاستخدام: %3\n❯ الفئة: %4\n❯ وقت الانتظار: %5 ثانية\n❯ الصلاحية: %6\n\n» كود المودول بواسطة %7 «",    
    "helpList": '[ يوجد %1 أوامر في هذا البوت، استخدم: "%2help اسم الأمر" لمعرفة طريقة الاستخدام! ]',    
    "user": "مستخدم",    
    "adminGroup": "أدمن المجموعة",    
    "adminBot": "أدمن البوت"    
  }
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;

  if (!body || typeof body == "undefined" || body.indexOf("help") != 0) return;    
  const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);    
  if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;    
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};    
  const command = commands.get(splitBody[1].toLowerCase());    
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;    
  return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
}

module.exports.run = function({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

  if (!command) {    
    const arrayInfo = [];    
    const page = parseInt(args[0]) || 1;    
    const numberOfOnePage = 9999;    
    let i = 0;    
    let msg = "";    
    
    for (var [name, value] of (commands)) {    
      name += ``;    
      arrayInfo.push(name);    
    }    

    arrayInfo.sort((a, b) => a.data - b.data);    
    
    const startSlice = numberOfOnePage*page - numberOfOnePage;    
    i = startSlice;    
    const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);    
    
    for (let item of returnArray) msg += `「 ${++i} 」${prefix}${item}\n`;    
    
    const siu = `📄 قائمة الأوامر\nصنع بواسطة حمود 🥀\nلمزيد من المعلومات اكتب /help (اسم الأمر) ✨`;
    const text = `\nالصفحة (${page}/${Math.ceil(arrayInfo.length/numberOfOnePage)})`;

    return api.sendMessage(siu + "\n\n" + msg + text, threadID, async (error, info) => {    
      if (autoUnsend) {    
        await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));    
        return api.unsendMessage(info.messageID);    
      } else return;    
    }, event.messageID);    
  }    

  return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}`, command.config.commandCategory, command.config.cooldowns, ((command.config.hasPermssion == 0) ? getText("user") : (command.config.hasPermssion == 1) ? getText("adminGroup") : getText("adminBot")), command.config.credits), threadID, messageID);
};
