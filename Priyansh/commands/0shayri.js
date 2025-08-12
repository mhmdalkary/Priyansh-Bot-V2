const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "اقتباس",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Priyansh Rajput",
  description: "✿ إرسال اقتباس عشوائي ✿",
  commandCategory: "المجموعة",
  usages: "shayri",
  cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  var { threadID, messageID } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Kolkata").format("HH:mm:ss L");
  var name = await Users.getNameUser(event.senderID);

  var shayariList = [
    "✿ عندما يغادر الروح شخص مهم يبقى القلب يناديه دومًا",
    "❀ أحيانًا الكلمات لا تكفي لتعبر عن مشاعرنا العميقة",
    "✿ الصبر مفتاح الفرج مهما طال الانتظار",
    "❀ الحب هو اللغة التي يفهمها القلب وحده",
    "✿ لا تجعل الألم يسرق منك ابتسامتك الجميلة",
    "❀ في كل دمعة حكاية وفي كل ابتسامة أمل جديد",
    "✿ الوفاء هو أجمل صفات المحبين",
    "❀ لا تخف من التغيير فهو بداية جديدة لكل شيء جميل",
    "✿ اجعل كلامك طيبًا، فالكلمات كالزهور تزرع في القلوب",
    "❀ الحياة قصيرة فاستغل كل لحظة فيها بالسعادة والمحبة",
    "✿ كن قويًا، فبعد العاصفة يأتي الهدوء الجميل",
    "❀ لا تنتظر السعادة من أحد، ابتسم واصنعها بنفسك",
    "✿ الذكريات الجميلة تبقى رغم رحيل الأحبة",
    "❀ الحب الحقيقي لا يموت مهما بعدت المسافات",
    "✿ الأمل هو نور القلب في أحلك الظروف",
    "❀ لا تيأس فكل بداية جديدة تحمل فرصًا لا متناهية",
    "✿ في البساطة تكمن أجمل المعاني",
    "❀ اجعل قلبك مليئًا بالحب والخير تنعم بالحياة",
    "✿ من يزرع الحب يحصد السعادة",
    "❀ العطاء بدون انتظار مقابل هو سر السعادة الحقيقية"
  ];

  var randomShayari = shayariList[Math.floor(Math.random() * shayariList.length)];

  if (event.body.toLowerCase().startsWith("shayri")) {
    var msg = {
      body: `❀❀❀ 『 'LONA' 』 ❀❀❀\n\n${randomShayari}\n\n➤⊹`
    };
    return api.sendMessage(msg, threadID, messageID);
  }
};

module.exports.run = function({ api, event, client, __GLOBAL }) { };
