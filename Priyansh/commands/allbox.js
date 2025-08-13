module.exports.config = {
  name: 'الجروبات',
  version: '1.0.0',
  credits: '𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭',
  hasPermssion: 2,
  description: '[حظر/إلغاء حظر/حذف/إزالة] قائمة [البيانات] للمحادثات التي انضم إليها البوت.',
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
        if (arg[0] == "ban" || arg[0] == "حظر") {
          const data = (await Threads.getData(idgr)).data || {};
          data.banned = 1;
          data.dateAdded = time;
          await Threads.setData(idgr, { data });
          global.data.threadBanned.set(idgr, { dateAdded: data.dateAdded });
          return api.sendMessage(`»إشعارات من المالك HMADY«\n\n تم حظر مجموعة الأصدقاء من استخدام البوت بسبب الحظر.`, idgr, () =>
            api.sendMessage(`${api.getCurrentUserID()}`, () =>
              api.sendMessage(`تم الحظر بنجاح\n\n${groupName} \nمعرف المجموعة:${idgr}`, threadID, () =>
                api.unsendMessage(handleReply.messageID))));
        }

        if (arg[0] == "unban" || arg[0] == "Unban" || arg[0] == "ub" || arg[0] == "فك") {
          const data = (await Threads.getData(idgr)).data || {};
          data.banned = 0;
          data.dateAdded = null;
          await Threads.setData(idgr, { data });
          global.data.threadBanned.delete(idgr, 1);
          return api.sendMessage(`»إشعارات من المالك 𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭«\n\n تم إلغاء حظر مجموعة الأصدقاء.`, idgr, () =>
            api.sendMessage(`${api.getCurrentUserID()}`, () =>
              api.sendMessage(`تم إلغاء الحظر بنجاح\n\n${groupName} \nمعرف المجموعة:${idgr} `, threadID, () =>
                api.unsendMessage(handleReply.messageID))));
        }

        if (arg[0] == "del" || arg[0] == "حذف") {
          const data = (await Threads.getData(idgr)).data || {};
          await Threads.delData(idgr, { data });
          console.log(groupName)
          api.sendMessage(`تم الحذف بنجاح\n\n${groupName} \nمعرف المجموعة: ${idgr} \n تم حذف البيانات بنجاح!`, event.threadID, event.messageID);
          break;
        }

        if (arg[0] == "out" || arg[0] == "غادري") {
          api.sendMessage(`»إشعارات من المالك 𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭«\n\n تم الحذف من مجموعة الدردشة`, idgr, () =>
            api.sendMessage(`${api.getCurrentUserID()}`, () =>
              api.sendMessage(`تم الخروج بنجاح\n\n${groupName} \nمعرف المجموعة:${idgr} `, threadID, () =>
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
        /////////
        try {
          data = await api.getThreadList(100, null, ["INBOX"]);
        } catch (e) {
          console.log(e);
        }
        for (const thread of data) {
          if (thread.isGroup == true) threadList.push({ threadName: thread.name, threadID: thread.threadID, messageCount: thread.messageCount });
        }
        /////////////////////////////////////////////////////
        //===== ترتيب من الأعلى إلى الأدنى لكل مجموعة =====//
        threadList.sort((a, b) => {
          if (a.messageCount > b.messageCount) return -1;
          if (a.messageCount < b.messageCount) return 1;
        })

        var groupid = [];
        var groupName = [];
        var page = 1;
        page = parseInt(args[0]) || 1;
        page < -1 ? page = 1 : "";
        var limit = 100;
        var msg = "قائمة المجموعات [البيانات]\n\n";
        var numPage = Math.ceil(threadList.length / limit);

        for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
          if (i >= threadList.length) break;
          let group = threadList[i];
          msg += `${i + 1}. ${group.threadName}\nمعرف المجموعة: ${group.threadID}\nعدد الرسائل: ${group.messageCount}\n`;
          groupid.push(group.threadID);
          groupName.push(group.threadName);
        }
        msg += `--صفحة ${page}/${numPage}--\nاستخدم ${global.config.PREFIX}allbox رقم الصفحة/الكل\n\n`

        api.sendMessage(msg + 'رد على out, ban, unban, del[data] رقم الطلب للخروج, الحظر, إلغاء الحظر, أو حذف[البيانات] لهذه المحادثة!', event.threadID, (e, data) =>
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
      /*
          var threadList = [];
          var data, msg = "";
          /////////
          try {
              data = await api.getThreadList(1000, null, ["INBOX"]);
          } catch (e) {
              console.log(e);
          }
          for (const thread of data) {
              if (thread.isGroup == true) threadList.push({ threadName: thread.name, threadID: thread.threadID, messageCount: thread.messageCount });
          }
          /////////////////////////////////////////////////////
          //===== ترتيب من الأعلى إلى الأدنى لكل مجموعة =====//
          threadList.sort((a, b) => {
              if (a.messageCount > b.messageCount) return -1;
              if (a.messageCount < b.messageCount) return 1;
          })

          var groupid = [];
          var groupName = [];
          var page = 1;
          page = parseInt(args[0]) || 1;
          page < -1 ? page = 1 : "";
          var limit = 10;
          var msg = "DS NHÓM [Data]\n\n";
          var numPage = Math.ceil(threadList.length / limit);

          for (var i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
              if (i >= threadList.length) break;
              let group = threadList[i];
              msg += `${i+1}. ${group.threadName}\nمعرف المجموعة: ${group.threadID}\nعدد الرسائل: ${group.messageCount}\n\n`;
              groupid.push(group.threadID);
              groupName.push(group.threadName);
          }
          msg += `--صفحة ${page}/${numPage}--\nاستخدم ${global.config.PREFIX}allbox + رقم الصفحة/الكل\n\n`

          api.sendMessage(msg + 'رد على Out, Ban, Unban, Del[data]+ رقم الطلب للخروج, الحظر, إلغاء الحظر, أو حذف[البيانات] لهذه المحادثة!', event.threadID, (e, data) =>
              global.client.handleReply.push({
                  name: this.config.name,
                  author: event.senderID,
                  messageID: data.messageID,
                  groupid,
                  groupName,
                  type: 'reply'
              })
          );
          break;
  }*/

      const { threadID, messageID } = event;
      var threadList = [];
      var data, msg = "";
      i = 1;
      /////////
      try {
        //var listUserID = event.participantIDs.filter(ID => ID);
        data = global.data.allThreadID;

      } catch (e) {
        console.log(e);
      }
      for (const thread of data) {
        var nameThread = await global.data.threadInfo.get(thread).threadName || "الاسم غير موجود.";
        threadList.push(`${i++}. ${nameThread} \nمعرف المجموعة: ${thread}`);
        //console.log(`${nameThread}`);
      }

      return api.sendMessage(threadList.length != 0 ? api.sendMessage(`يوجد حالياً ${threadList.length} مجموعة\n\n${threadList.join("\n")}`,
        threadID,
        messageID
      ) : "لا توجد مجموعة حالياً!", threadID, messageID);

  }
};
