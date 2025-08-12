module.exports.config = {
    name: "antiout",
    eventType: ["log:unsubscribe"],
    version: "0.0.1",
    credits: "Priyansh Rajput",
    description: "مراقبة خروج الأعضاء وإعادة إضافتهم تلقائياً"
};

module.exports.run = async ({ event, api, Threads, Users }) => {
    let data = (await Threads.getData(event.threadID)).data || {};
    if (data.antiout === false) return;
    if (event.logMessageData.leftParticipantFbId === api.getCurrentUserID()) return;

    const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
    const type = (event.author === event.logMessageData.leftParticipantFbId) ? "مغادرة ذاتية" : "تم الطرد من قبل شخص ما";

    if (type === "مغادرة ذاتية") {
        api.addUserToGroup(event.logMessageData.leftParticipantFbId, event.threadID, (error) => {
            if (error) {
                api.sendMessage(`﴿ ✧ ✦ ﴾ تعذّر إعادة إضافة العضو ✧✦
『 ${name} 』
➤⊹ إلى المجموعة بنجاح، يرجى المحاولة لاحقًا.`, event.threadID);
            } else {
                api.sendMessage(`﴿ ✧ ✦ ﴾ تمّت إعادة إضافة العضو ✧✦
『 ${name} 』
➤⊹ إلى المجموعة بنجاح، نرحب بعودته!`, event.threadID);
            }
        });
    }
};
