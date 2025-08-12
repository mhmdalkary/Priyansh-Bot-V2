module.exports.config = {
    name: "antibd",
    eventType: ["log:user-nickname"],
    version: "0.0.1",
    credits: "Priyansh Rajput",
    description: "منع تغيير لقب البوت"
};

module.exports.run = async function({ api, event, Users, Threads }) {
    const { logMessageData, threadID, author } = event;
    const botID = api.getCurrentUserID();
    const { BOTNAME, ADMINBOT } = global.config;
    let { nickname } = await Threads.getData(threadID, botID);
    nickname = nickname || BOTNAME;

    if (logMessageData.participant_id === botID &&
        author !== botID &&
        !ADMINBOT.includes(author) &&
        logMessageData.nickname !== nickname) {

        api.changeNickname(nickname, threadID, botID);

        const info = await Users.getData(author);
        return api.sendMessage(
            `✧✦ تحذير ✦✧\n『 ${info.name} 』\n➤⊹ لا يمكنك تغيير لقب البوت!`,
            threadID
        );
    }
};
