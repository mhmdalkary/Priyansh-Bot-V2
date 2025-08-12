module.exports.config = {
  name: "بايو",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Priyansh Rajput",
  description: "تغيير نبذة البوت",
  commandCategory: "admin",
  usages: "bio [النص]",
  cooldowns: 5
}

module.exports.run = async ({ api, event, args }) => {
  api.changeBio(args.join(" "), (error) => {
    if(error) 
      return api.sendMessage("❌ حدث خطأ: " + error, event.threadID);
    return api.sendMessage("✔️ تم تغيير النبذة إلى:\n" + args.join(" "), event.threadID, event.messageID);
  });
	}
