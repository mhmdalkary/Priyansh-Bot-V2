module.exports.config = {
  name: "بنر2",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 (تحسين وتعريب: محمد)",
  description: "مولد بنر مع خيارات متعددة",
  commandCategory: "العاب",
  usages: "",
  cooldowns: 5
};

module.exports.run = async function({ api, args, event }) {
  const fs = require("fs-extra");
  const path = require("path");
  const axios = require("axios");
  const { loadImage, createCanvas, registerFont } = require("canvas");

  try {
    // إنشاء مجلد wall لو مش موجود
    const wallFolder = path.join(__dirname, "wall");
    if (!fs.existsSync(wallFolder)) fs.mkdirSync(wallFolder);

    // جلب قائمة الشخصيات
    let قائمة_الشخصيات;
    try {
      const res = await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864');
      قائمة_الشخصيات = res.data;
    } catch {
      return api.sendMessage("❌ فشل تحميل بيانات الشخصيات، حاول لاحقاً", event.threadID, event.messageID);
    }

    // إذا الأمر list
    if (args[0] === "list") {
      const limit = 20;
      const page = parseInt(args[1]) || 1;
      const data = قائمة_الشخصيات.listAnime || [];
      const count = data.length;
      const numPage = Math.ceil(count / limit);
      let msg = "";
      for (let i = limit * (page - 1); i < Math.min(limit * page, count); i++) {
        msg += `[ ${i+1} ] - ${data[i].ID} | ${data[i].name}\n`;
      }
      msg += `الصفحة (${page}/${numPage})\nاستخدم الأمر ${global.config.PREFIX}${this.config.name} list <رقم الصفحة>`;
      return api.sendMessage(msg, event.threadID, event.messageID);
    }

    // أي أمر ثاني يفتح الرد التفاعلي
    return api.sendMessage("📌 الرجاء الرد على هذه الرسالة لتحديد رقم الشخصية", event.threadID, (err, info) => {
      return global.client.handleReply.push({
        step: 1,
        name: this.config.name,
        author: event.senderID,
        messageID: info.messageID
      });
    }, event.messageID);

  } catch (err) {
    return api.sendMessage(`❌ حصل خطأ: ${err.message}`, event.threadID, event.messageID);
  }
}

module.exports.handleReply = async function({ api, event, handleReply }) {
  const fs = require("fs-extra");
  const path = require("path");
  const axios = require("axios");
  const { loadImage, createCanvas, registerFont } = require("canvas");

  try {
    if (event.senderID != handleReply.author) return;

    const wallFolder = path.join(__dirname, "wall");
    if (!fs.existsSync(wallFolder)) fs.mkdirSync(wallFolder);

    // تحميل الخط إذا مش موجود
    const fontPath = path.join(wallFolder, "MTOJamai.ttf");
    if (!fs.existsSync(fontPath)) {
      const fontData = (await axios.get(`https://github.com/hanakuUwU/font/raw/main/MTOJamai.ttf`, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(fontPath, fontData);
    }

    // خطوات الرد التفاعلي
    if (handleReply.step === 1) {
      api.unsendMessage(handleReply.messageID);
      return api.sendMessage(`لقد اخترت رقم الشخصية: ${event.body}\nقم بالرد على هذه الرسالة لإدخال اسمك`, event.threadID, (err, info) => {
        return global.client.handleReply.push({
          step: 2,
          name: handleReply.name,
          chartid: event.body,
          author: handleReply.author,
          messageID: info.messageID
        });
      }, event.messageID);
    }

    if (handleReply.step === 2) {
      api.unsendMessage(handleReply.messageID);
      return api.sendMessage(`لقد اخترت الاسم: ${event.body}\nقم بالرد على هذه الرسالة لاختيار اللون`, event.threadID, (err, info) => {
        return global.client.handleReply.push({
          step: 3,
          name: handleReply.name,
          chartid: handleReply.chartid,
          ten: event.body,
          author: handleReply.author,
          messageID: info.messageID
        });
      }, event.messageID);
    }

    if (handleReply.step === 3) {
      api.unsendMessage(handleReply.messageID);

      // جلب بيانات الشخصية
      const data = (await axios.get('https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864')).data;
      const id = handleReply.chartid;
      const title = handleReply.ten;
      const color = event.body && event.body.toLowerCase() !== "no" ? event.body : data[id].colorBg;

      // تحميل صورة الشخصية والخلفية
      const pathAva = path.join(wallFolder, "char.png");
      const imgData = (await axios.get(data[id].imgAnime, { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathAva, imgData);

      const pathBg = path.join(wallFolder, "bg.png");
      const bgData = (await axios.get("https://i.imgur.com/Ch778s2.png", { responseType: "arraybuffer" })).data;
      fs.writeFileSync(pathBg, bgData);

      // إنشاء البنر
      const canvas = createCanvas(1080, 1920);
      const ctx = canvas.getContext("2d");
      const bg = await loadImage(pathBg);
      const charImg = await loadImage(pathAva);

      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
      ctx.drawImage(charImg, 200, 200, 700, 700);

      registerFont(fontPath, { family: "MTOJamai" });
      ctx.fillStyle = color;
      ctx.font = "bold 80px MTOJamai";
      ctx.textAlign = "center";
      ctx.fillText(title, canvas.width / 2, 1000);

      const outputPath = path.join(wallFolder, "output.png");
      fs.writeFileSync(outputPath, canvas.toBuffer());

      // إرسال الصورة
      return api.sendMessage({
        body: "📸 تم إنشاء البنر",
        attachment: fs.createReadStream(outputPath)
      }, event.threadID, () => {
        fs.unlinkSync(pathAva);
        fs.unlinkSync(pathBg);
        fs.unlinkSync(outputPath);
      }, event.messageID);
    }

  } catch (err) {
    return api.sendMessage(`❌ حصل خطأ: ${err.message}`, event.threadID, event.messageID);
  }
};
