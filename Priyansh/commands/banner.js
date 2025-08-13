module.exports.config = {
  name: "بنر",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 (تعديل وتحسين: محمد)",
  description: "يولد صورة بنر فيها شخصيات وخيارات كثيرة",
  commandCategory: "العاب",
  usages: "{رقم}|{كلمة1}|{كلمة2}|{كلمة3}|{لون}",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const fs = require("fs");
  const path = require("path");
  const axios = require("axios");
  const { loadImage, createCanvas, registerFont } = require("canvas");

  try {
    // إنشاء مجلد tad لو مش موجود
    const tadFolder = path.join(__dirname, "tad");
    if (!fs.existsSync(tadFolder)) fs.mkdirSync(tadFolder);

    // تقسيم المدخلات
    const [رقم, كلمة1, كلمة2, كلمة3, اللون] =
      args.join(" ").trim().replace(/\s+/g, " ").split("|").map(x => x?.trim() || "");

    const index = parseInt(رقم) || 1;

    // جلب قائمة الشخصيات
    let قائمة_الشخصيات;
    try {
      const res = await axios.get("https://run.mocky.io/v3/0dcc2ccb-b5bd-45e7-ab57-5dbf9db17864");
      قائمة_الشخصيات = res.data;
    } catch {
      return api.sendMessage("❌ فشل تحميل بيانات الشخصيات، جرب لاحقاً", event.threadID, event.messageID);
    }

    if (!قائمة_الشخصيات[index - 1]) {
      return api.sendMessage("⚠ الرقم اللي اخترته مش موجود في القائمة", event.threadID, event.messageID);
    }

    // تحميل صورة الشخصية
    const pathChar = path.join(tadFolder, "char.png");
    try {
      const img = await axios.get(قائمة_الشخصيات[index - 1].imgAnime, { responseType: "arraybuffer" });
      fs.writeFileSync(pathChar, img.data);
    } catch {
      return api.sendMessage("❌ فشل تحميل صورة الشخصية", event.threadID, event.messageID);
    }

    // تحميل الخلفية
    const pathBg = path.join(tadFolder, "bg.png");
    try {
      const bg = await axios.get("https://i.imgur.com/Ch778s2.png", { responseType: "arraybuffer" });
      fs.writeFileSync(pathBg, bg.data);
    } catch {
      return api.sendMessage("❌ فشل تحميل الخلفية", event.threadID, event.messageID);
    }

    // تحميل الخطوط إذا ناقصة
    const fonts = [
      { file: "PastiOblique.otf", url: "https://github.com/hanakuUwU/font/raw/main/PastiOblique-7B0wK.otf" },
      { file: "gantelline.ttf", url: "https://github.com/hanakuUwU/font/raw/main/gantellinesignature-bw11b.ttf" },
      { file: "bebas.ttf", url: "https://github.com/hanakuUwU/font/blob/main/UTM%20Bebas.ttf?raw=true" }
    ];
    for (let font of fonts) {
      const fontPath = path.join(tadFolder, font.file);
      if (!fs.existsSync(fontPath)) {
        try {
          const f = await axios.get(font.url, { responseType: "arraybuffer" });
          fs.writeFileSync(fontPath, f.data);
        } catch {
          return api.sendMessage(`❌ فشل تحميل الخط ${font.file}`, event.threadID, event.messageID);
        }
      }
    }

    // اختيار اللون
    let لون_خلفية = (!اللون || اللون.toLowerCase() === "no") ? قائمة_الشخصيات[index - 1].colorBg : اللون;

    // الرسم
    const خلفية = await loadImage(pathBg);
    const شخصية = await loadImage(pathChar);
    const canvas = createCanvas(خلفية.width, خلفية.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(خلفية, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(شخصية, 1500, -400, 1980, 1980);

    registerFont(path.join(tadFolder, "PastiOblique.otf"), { family: "Pasti" });
    ctx.fillStyle = لون_خلفية;
    ctx.font = "370px Pasti";
    ctx.fillText(كلمة1 || "", 500, 750);

    registerFont(path.join(tadFolder, "gantelline.ttf"), { family: "Gantelline" });
    ctx.fillStyle = "#fff";
    ctx.font = "350px Gantelline";
    ctx.fillText(كلمة2 || "", 500, 680);

    ctx.fillStyle = "#f56236";
    ctx.font = "145px Pasti";
    ctx.fillText(كلمة3 || "", 2100, 870);

    const outputPath = path.join(tadFolder, "output.png");
    fs.writeFileSync(outputPath, canvas.toBuffer());

    // إرسال الصورة
    api.sendMessage(
      { body: " تم إنشاء البنر", attachment: fs.createReadStream(outputPath) },
      event.threadID,
      () => {
        fs.unlinkSync(pathChar);
        fs.unlinkSync(pathBg);
        fs.unlinkSync(outputPath);
      },
      event.messageID
    );

  } catch (err) {
    api.sendMessage(`❌ حصل خطأ: ${err.message}`, event.threadID, event.messageID);
  }
};
