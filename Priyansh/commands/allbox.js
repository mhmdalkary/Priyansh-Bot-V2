module.exports.config = {
  name: 'المجموعات',
  version: '1.0.0',
  credits: '𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭',
  hasPermssion: 2,
  description: '『 حظر/إلغاء حظر/حذف/خروج 』 قائمة المجموعات التي انضم إليها البوت.',
  commandCategory: 'Admin',
  usages: '[رقم الصفحة/الكل]',
  cooldowns: 5
};

module.exports.handleReply = async function ({ api, event, args, Threads, handleReply }) {
  const { threadID, messageID } = event;
  if (parseInt(event.senderID) !== parseInt(handleReply.author)) return;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Kolkata").format("HH:MM:ss L");
  var arg = event.body.split(" ");
  var idgr = handleReply.groupid[arg[1] - 1];
  var groupName = handleReply.groupName[arg[1] - 1];
  switch (handleReply.type) {
    case "reply":
      {
        if (arg[0].toLowerCase() == "ban") {
          const data = (await Threads.getData(idgr)).data || {};
          data.banned = 1;
          data.dateAdded = time;
          await Threads.setData(idgr, { data });
          global.data.threadBanned.set(idgr, { dateAdded: data.dateAdded });
          return api.sendMessage(`✿✿ » إشعار من المالك 𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 « ✿✿\n\n『 تم حظر مجموعة الأصدقاء من استخدام البوت 』`, idgr, () =>
            api.sendMessage(`${api.getCurrentUserID()}`, () =>
              api.sendMessage(`•• تم الحظر بنجاح ••\n\n『 ${groupName} 』\n『 رقم المحادثة: ${idgr} 』`, threadID, () =>
                api.unsendMessage(handleReply.messageID))));
        }

        if (["unban", "ub"].includes(arg[0].toLowerCase())) {
          const data = (await Threads.getData(idgr)).data || {};
          data.banned = 0;
          data.dateAdded = null;
          await Threads.setData(idgr, { data });
          global.data.threadBanned.delete(idgr, 1);
          return api.sendMessage(`✿✿ » إشعار من المالك 𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 « ✿✿\n\n『 تم رفع الحظر عن مجموعة الأصدقاء 』`, idgr, () =>
            api.sendMessage(`${api.getCurrentUserID()}`, () =>
              api.sendMessage(`•• تم إلغاء الحظر بنجاح ••\n\n『 ${groupName} 』\n『 رقم المحادثة: ${idgr} 』`, threadID, () =>
                api.unsendMessage(handleReply.messageID))));
        }

        if (arg[0].toLowerCase() == "del") {
          const data = (await Threads.getData(idgr)).data || {};
          await Threads.delData(idgr, { data });
          api.sendMessage(`•• تم حذف البيانات بنجاح ••\n\n『 ${groupName} 』\n『 رقم المحادثة: ${idgr} 』\n『 تم حذف البيانات بنجاح! 』`, event.threadID, event.messageID);
          break;
        }

        if (arg[0].toLowerCase() == "out") {
          api.sendMessage(`✿✿ » إشعار من المالك 𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 « ✿✿\n\n『 تم الحذف من المجموعة 』`, idgr, () =>
            api.sendMessage(`${api.getCurrentUserID()}`, () =>
              api.sendMessage(`•• تم الخروج بنجاح ••\n\n『 ${groupName} 』\n『 رقم المحادثة: ${idgr} 』`, threadID, () =>
                api.unsendMessage(handleReply.messageID, () =>
                  api.removeUserFromGroup(`${api.getCurrentUserID()}`, idgr)))));
          break;
        }
      }
  }
};

module.exports.run = async function ({ api, event, args }) {
  switch (args[0]) {
    case "all":
      {
        var threadList = [];
        var data, msg = "";
        try {
          data = await api.getThreadList(100, null, ["INBOX"]);
        } catch (e) {
          console.log(e);
        }
        for (const thread of data) {
          if (thread.isGroup == true) threadList.push({ threadName: thread.name, threadID: thread.threadID, messageCount: thread.messageCount });
        }
        threadList.sort((a, b) => {
          if (a.messageCount > b.messageCount) return -1;
          if (a.messageCount < b.messageCount) return 1;
        })

        var groupid = [];
        var groupName = [];
        var page = parseInt(args[1]) || 1;
        if (page < 1) page = 1;
        var limit = 100;
        var msg = "『 قائمة مجموعات البيانات 』\n\n";
        var numPage = Math.ceil(threadList.length / limit);

        for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
          if (i >= threadList.length) break;
          let group = threadList[i];
          msg += `${i + 1}. 『 ${group.threadName} 』\n『 رقم المحادثة: ${group.threadID} 』\n『 عدد الرسائل: ${group.messageCount} 』\n`;
          groupid.push(group.threadID);
          groupName.push(group.threadName);
        }
        msg += `•• الصفحة ${page} من ${numPage} ••\n『 استخدم ${global.config.PREFIX}allbox رقم الصفحة أو all 』\n\n`

        api.sendMessage(msg + '『 رد بـ Out, Ban, Unban, Del[data] مع رقم الترتيب لتنفيذ الأمر على المجموعة 』', event.threadID, (e, data) =>
          global.client.handleReply.push({
            name: this.config.name,
            author: event.senderID,
            messageID: data.messageID,
            groupid,
            groupName,
            type: 'reply'
          })
        )
      }
      break;

    default:
      const { threadID, messageID } = event;
      var threadList = [];
      var data;
      try {
        data = global.data.allThreadID;
      } catch (e) {
        console.log(e);
      }
      let i = 1;
      for (const thread of data) {
        var nameThread = await global.data.threadInfo.get(thread).threadName || "『 لا يوجد اسم 』";
        threadList.push(`${i++}. 『 ${nameThread} 』\n『 رقم المحادثة: ${thread} 』`);
      }
      return api.sendMessage(threadList.length != 0 ? `『 يوجد حالياً ${threadList.length} مجموعة 』\n\n${threadList.join("\n")}` : "『 لا توجد مجموعات حالياً 』", threadID, messageID);
  }
};
