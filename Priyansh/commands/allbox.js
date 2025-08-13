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
  const arg = event.body.split(" ");
  const command = arg[0].toLowerCase(); // تحويل الأمر إلى حروف صغيرة لتبسيط المقارنة
  const idgr = handleReply.groupid[arg[1] - 1];
  const groupName = handleReply.groupName[arg[1] - 1];

  switch (handleReply.type) {
    case "reply":
      {
        // تم تعريب الشروط هنا
        if (command === "حظر") {
          const data = (await Threads.getData(idgr)).data || {};
          data.banned = 1;
          data.dateAdded = time;
          await Threads.setData(idgr, { data });
          global.data.threadBanned.set(idgr, { dateAdded: data.dateAdded });
          return api.sendMessage(
            `»إشعارات من المالك 𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭«\n\n تم **حظر** مجموعة الأصدقاء من استخدام البوت.`,
            idgr,
            () => api.sendMessage(`${api.getCurrentUserID()}`, () =>
              api.sendMessage(
                `**تم الحظر بنجاح**\n\n${groupName}\nمعرف المجموعة: ${idgr}`,
                threadID,
                () => api.unsendMessage(handleReply.messageID)
              )
            )
          );
        }

        if (command === "إلغاء حظر" || command === "فك حظر") {
          const data = (await Threads.getData(idgr)).data || {};
          data.banned = 0;
          data.dateAdded = null;
          await Threads.setData(idgr, { data });
          global.data.threadBanned.delete(idgr, 1);
          return api.sendMessage(
            `»إشعارات من المالك 𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭«\n\n تم **إلغاء حظر** مجموعة الأصدقاء.`,
            idgr,
            () => api.sendMessage(`${api.getCurrentUserID()}`, () =>
              api.sendMessage(
                `**تم إلغاء الحظر بنجاح**\n\n${groupName}\nمعرف المجموعة: ${idgr}`,
                threadID,
                () => api.unsendMessage(handleReply.messageID)
              )
            )
          );
        }

        if (command === "حذف") {
          const data = (await Threads.getData(idgr)).data || {};
          await Threads.delData(idgr, { data });
          console.log(groupName);
          api.sendMessage(
            `**تم الحذف بنجاح**\n\n${groupName}\nمعرف المجموعة: ${idgr}\nتم حذف البيانات بنجاح!`,
            event.threadID,
            event.messageID
          );
          break;
        }

        if (command === "خروج" || command === "إزالة") {
          api.sendMessage(
            `»إشعارات من المالك 𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭«\n\n **تم الخروج** من مجموعة الدردشة.`,
            idgr,
            () => api.sendMessage(`${api.getCurrentUserID()}`, () =>
              api.sendMessage(
                `**تم الخروج بنجاح**\n\n${groupName}\nمعرف المجموعة: ${idgr}`,
                threadID,
                () => api.unsendMessage(handleReply.messageID, () =>
                  api.removeUserFromGroup(`${api.getCurrentUserID()}`, idgr)
                )
              )
            )
          );
          break;
        }
      }
  }
};

module.exports.run = async function ({ api, event, args }) {
  // هذا الجزء يعتمد على ما إذا كنت تريد تعريب الأوامر الأولية في الـ "run" أيضاً.
  // حالياً، لا تتطلب هذه الشروط تعريباً مباشراً لأنها تتحكم في كيفية عرض القائمة، وليس الأوامر التي يتلقاها البوت.
  // إذا كنت ترغب في تغيير `args[0]` من "all" إلى "الكل" مثلاً، يمكنك تعديلها هنا.
  switch (args[0]) {
    case "all": // يمكن تغييرها إلى "الكل" إذا أردت
      {
        let threadList = [];
        let data, msg = "";
        try {
          data = await api.getThreadList(100, null, ["INBOX"]);
        } catch (e) {
          console.log(e);
        }

        for (const thread of data) {
          if (thread.isGroup === true) {
            threadList.push({ threadName: thread.name, threadID: thread.threadID, messageCount: thread.messageCount });
          }
        }

        threadList.sort((a, b) => b.messageCount - a.messageCount);

        let groupid = [];
        let groupName = [];
        let page = parseInt(args[0]) || 1;
        if (page < 1) page = 1;
        const limit = 100;
        let numPage = Math.ceil(threadList.length / limit);

        msg = "قائمة المجموعات [البيانات]\n\n";

        for (let i = limit * (page - 1); i < limit * (page - 1) + limit; i++) {
          if (i >= threadList.length) break;
          let group = threadList[i];
          msg += `${i + 1}. ${group.threadName}\nمعرف المجموعة: ${group.threadID}\nعدد الرسائل: ${group.messageCount}\n`;
          groupid.push(group.threadID);
          groupName.push(group.threadName);
        }
        msg += `--صفحة ${page}/${numPage}--\nاستخدم ${global.config.PREFIX}allbox رقم الصفحة/الكل\n\n`;

        api.sendMessage(
          msg + 'رد على **حظر** أو **إلغاء حظر** أو **حذف** أو **خروج** [رقم الطلب] لتطبيق الأمر على تلك المحادثة!',
          event.threadID,
          (e, data) =>
            global.client.handleReply.push({
              name: this.config.name,
              author: event.senderID,
              messageID: data.messageID,
              groupid,
              groupName,
              type: 'reply'
            })
        );
      }
      break;

    default:
      const { threadID, messageID } = event;
      let threadListDefault = [];
      let i = 1;
      try {
        const allThreadIDs = global.data.allThreadID;
        for (const thread of allThreadIDs) {
          const nameThread = await global.data.threadInfo.get(thread).threadName || "الاسم غير موجود.";
          threadListDefault.push(`${i++}. ${nameThread}\nمعرف المجموعة: ${thread}`);
        }
      } catch (e) {
        console.log(e);
      }

      return api.sendMessage(
        threadListDefault.length !== 0
          ? `يوجد حالياً ${threadListDefault.length} مجموعة\n\n${threadListDefault.join("\n")}`
          : "لا توجد مجموعة حالياً!",
        threadID,
        messageID
      );
  }
};
