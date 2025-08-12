module.exports.config = {
  name: "اوفبوت",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
  description: "‏‏إيقاف البوت",
  commandCategory: "system",
  cooldowns: 0
};

module.exports.run = ({ event, api }) => {
  const permission = ["100087632392287", "100087632392287"];
  if (!permission.includes(event.senderID)) 
    return api.sendMessage("✖️ عذرًا، ما عندك صلاحية تستخدم هالأمر، بس لحمود", event.threadID, event.messageID);

  api.sendMessage(`✔️ تم إيقاف البوت بنجاح » ${global.config.BOTNAME}`, event.threadID, () => process.exit(0));
};
