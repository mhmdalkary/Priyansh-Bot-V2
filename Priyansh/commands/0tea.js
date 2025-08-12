const fs = require("fs");
module.exports.config = {
  name: "شاي",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Priyansh Rajput", 
  description: "رسالة تلقائية عند قول شاي",
  commandCategory: "no prefix",
  usages: "tea",
  cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
  var { threadID, messageID } = event;
  const triggers = ["شاي", "قهوة"];
  const text = event.body.toLowerCase();

  if (triggers.some(t => text.startsWith(t))) {
    var msg = {
      body: "『☕ شاي دافي لك » » استمتع بلحظتك ✿』",
      attachment: fs.createReadStream(__dirname + `/noprefix/tea.mp4`)
    }
    api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🍵", event.messageID, () => {}, true);
  }
}

module.exports.run = function({ api, event, client, __GLOBAL }) { };
