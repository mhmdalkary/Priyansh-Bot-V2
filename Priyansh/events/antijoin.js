module.exports.config = {
    name: "antijoin",
    eventType: ["log:subscribe"],
    version: "1.0.0",
    credits: "Priyansh Rajput",
    description: "منع الانضمام التلقائي للأعضاء الجدد"
};

module.exports.run = async function ({ event, api, Threads }) {
    let data = (await Threads.getData(event.threadID)).data;
    if (data.newMember === false) return;
    if (event.logMessageData.addedParticipants.some(i => i.userFbId === api.getCurrentUserID())) return;

    if (data.newMember === true) {
        const memJoin = event.logMessageData.addedParticipants.map(info => info.userFbId);

        for (let idUser of memJoin) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            api.removeUserFromGroup(idUser, event.threadID, async function (err) {
                if (err) {
                    data["newMember"] = false;
                    await Threads.setData(event.threadID, { data });
                    global.data.threadData.set(event.threadID, data);
                }
            });
        }

        return api.sendMessage(
`✧✦ 『 وضع منع الانضمام مفعّل 』 ✦✧
➤⊹ يرجى تعطيل الوضع قبل إضافة أعضاء جدد.`,
            event.threadID
        );
    }
};
