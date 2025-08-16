const chalk = require('chalk');

module.exports.config = {
    name: "ضيفيني",
    version: "1.0.2",
    hasPermssion: 2,
    credits: "✦ 𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 ✦ (تعديل محمد)",
    description: "انضمام للمجموعات اللي فيها البوت",
    commandCategory: "⚙️ نظام",
    usages: "",
    cooldowns: 5
};

module.exports.onLoad = () => {
  console.log(chalk.bold.hex("#00c300").bold("━━━ تم تحميل امر الانضمام بنجاح ━━━"));
}

module.exports.handleReply = async function({ api, event, handleReply, Threads }) {
  var { threadID, messageID, senderID, body } = event;
  var { ID } = handleReply;

  if (!body || !parseInt(body)) 
    return api.sendMessage('اختيارك لازم يكون رقم صحيح', threadID, messageID);

  if ((parseInt(body) - 1) >= ID.length) 
    return api.sendMessage("الرقم اللي اخترته مو موجود بالقائمة", threadID, messageID);

  try {
    var threadInfo = await Threads.getInfo(ID[body - 1]);

    // حماية لو threadInfo فاضي
    var participantIDs = threadInfo?.participantIDs || [];
    var approvalMode = threadInfo?.approvalMode || false;
    var adminIDs = threadInfo?.adminIDs || [];

    if (participantIDs.includes(senderID)) 
      return api.sendMessage("انت داخل القروب هذا بالفعل", threadID, messageID);

    // اضف المستخدم للقروب
    api.addUserToGroup(senderID, ID[body - 1]);

    if (approvalMode === true && !adminIDs.some(item => item.id === api.getCurrentUserID())) {
      return api.sendMessage("انضافت للائحة الانتظار بالمجموعة، استنى موافقة الأدمن", threadID, messageID);
    } else {
      return api.sendMessage(`تمت إضافتك لمجموعة ✦ ${threadInfo.threadName} ✦`, threadID, messageID);
    }
  } catch (error) {
    return api.sendMessage(`صار خطأ وما قدرت اضيفك للقروب\n${error}`, threadID, messageID);
  }
}

module.exports.run = async function({ api, event, Threads }) {
  var { threadID, messageID, senderID } = event;
  var msg = `✦ ━━ قائمة المجموعات ━━ ✦\n\n`, number = 0, ID = [];

  var allThreads = await Threads.getAll();
  for (var i of allThreads) {
    number++;
    msg += `${number}. ${i.threadInfo.threadName}\n`;
    ID.push(i.threadID);
  }

  msg += `\n↯ رد على هذه الرسالة برقم المجموعة اللي تريد تدخلها`;

  return api.sendMessage(msg, threadID, (error, info) => {
    global.client.handleReply.push({
      name: this.config.name,
      author: senderID,
      messageID: info.messageID,
      ID: ID      
    });
  }, messageID);
}
