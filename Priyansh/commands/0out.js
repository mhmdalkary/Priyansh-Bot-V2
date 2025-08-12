module.exports.config = {
    name: "غادري",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Priyansh Rajput",
    description: " أمر خروج البوت من المجموعة",
    commandCategory: "الإدارة",
    usages: "out [معرف_المجموعة]",
    cooldowns: 10,
};

module.exports.run = async function({ api, event, args }) {
    if (!args[0]) {
        return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
    }
    if (!isNaN(args[0])) {
        return api.removeUserFromGroup(api.getCurrentUserID(), args.join(" "));
    }
};
