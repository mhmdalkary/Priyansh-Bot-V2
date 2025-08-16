module.exports.config = {
  name: "اعادة",
  version: "2.0.0",
  hasPermssion: 1,
  credits: "ترجمة وفك لعيونك",
  description: "البوت يفضح اللي يمسح رسالته 😂",
  commandCategory: "الوناسة",
  usages: "",
  cooldowns: 0,
  hide: true,
  dependencies: {
    "request": "",
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.handleEvent = async function({ event: e, api: a, client: t, Users: s }) {
  const request = global.nodemodule.request;
  const axios = global.nodemodule.axios;
  const { writeFileSync, createReadStream } = global.nodemodule["fs-extra"];

  let { messageID, senderID, threadID, body } = e;

  if (!global.logMessage) global.logMessage = new Map();
  if (!global.data.botID) global.data.botID = a.getCurrentUserID();

  const threadSetting = global.data.threadData.get(threadID) || {};

  if ((threadSetting.resend === undefined || threadSetting.resend != 0) && senderID != global.data.botID) {
    
    if (e.type !== "message_unsend") {
      global.logMessage.set(messageID, { msgBody: body, attachment: e.attachments });
    }

    if (e.type === "message_unsend") {
      let msg = global.logMessage.get(messageID);
      if (!msg) return;

      let userName = await s.getNameUser(senderID);

      // لو رسالة بس
      if (msg.attachment[0] == null) {
        return a.sendMessage(`🙈 ${userName} حاول يخفي رسالة\n👉 المحتوى: ${msg.msgBody}`, threadID);
      }

      // لو فيها مرفقات
      let count = 0;
      let resendMsg = {
        body: `🤣 ${userName} مسح ${msg.attachment.length} ملف بس أنا ذكي ورجعتها\n${msg.msgBody != "" ? `\n📩 الرسالة: ${msg.msgBody}` : ""}`,
        attachment: [],
        mentions: { tag: userName, id: senderID }
      };

      for (let f of msg.attachment) {
        count++;
        let ext = (await request.get(f.url)).uri.pathname.split(".").pop();
        let filePath = __dirname + `/cache/${count}.${ext}`;
        let data = (await axios.get(f.url, { responseType: "arraybuffer" })).data;
        writeFileSync(filePath, Buffer.from(data, "utf-8"));
        resendMsg.attachment.push(createReadStream(filePath));
      }

      a.sendMessage(resendMsg, threadID);
    }
  }
};

module.exports.languages = {
  ar: { on: "✅ شغلت الفضيحة", off: "❌ سكّرت الفضيحة", successText: "تم التبديل" },
  en: { on: "on", off: "off", successText: "resend success!" }
};

module.exports.run = async function({ api: e, event: a, Threads: t, getText: s }) {
  const { threadID, messageID } = a;
  let data = (await t.getData(threadID)).data;

  if (data.resend === undefined || data.resend == 0) data.resend = true;
  else data.resend = false;

  await t.setData(threadID, { data });
  global.data.threadData.set(threadID, data);

  e.sendMessage(`${data.resend == 1 ? s("on") : s("off")} 😂 ${s("successText")}`, threadID, messageID);
};
