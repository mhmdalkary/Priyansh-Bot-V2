module.exports.run = async function ({ event, api, args }) {
const fs = global.nodemodule["fs-extra"];
const { threadID, messageID, senderID } = event;
const mention = Object.keys(event.mentions);
if (!mention[0]) return api.sendMessage("سوي تاغ ولا للعشوائيات 💔", threadID, messageID);
else {
const one = senderID, two = mention[0];

// نسبة توافق عشوائية من 0 لـ 100
const compatibility = Math.floor(Math.random() * 101);

// نصوص رومانسية متنوعة
const texts = [
`💍 تم الزواج بينكم بنجاح! نسبة التوافق بينكم هي ${compatibility}% 💖`,
`🎉 ألف مبروك! أنتما الآن زوجين رسميين بنسبة توافق ${compatibility}% 🌹`,
`💑 الحب فاز! نسبة توافقكم الجميلة: ${compatibility}% 💕`,
`✨ تم توحيد القلوب! التوافق بينكم وصل لـ ${compatibility}% 😍`
];

// اختيار نص عشوائي
const finalText = texts[Math.floor(Math.random() * texts.length)];

return makeImage({ one, two }).then(path => 
api.sendMessage({ body: finalText, attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path), messageID)
);
}
}
