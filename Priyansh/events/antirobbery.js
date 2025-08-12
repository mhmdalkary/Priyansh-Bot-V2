module.exports.config = {
    name: "guard",
    eventType: ["log:thread-admins"],
    version: "1.0.0",
    credits: "Priyansh Rajput",
    description: "منع تغييرات المشرفين غير المصرح بها"
};

module.exports.run = async function ({ event, api, Threads }) {
    const { logMessageType, logMessageData, author } = event;
    const data = (await Threads.getData(event.threadID)).data;
    if (data.guard === false) return;

    if (data.guard === true) {
        if (logMessageType === "log:thread-admins") {
            if (logMessageData.ADMIN_EVENT === "add_admin") {
                if (author === api.getCurrentUserID()) return;
                if (logMessageData.TARGET_ID === api.getCurrentUserID()) return;

                api.changeAdminStatus(event.threadID, author, false, (err) => {
                    if (err) return api.sendMessage("حدث خطأ أثناء التعديل.", event.threadID, event.messageID);
                    api.changeAdminStatus(event.threadID, logMessageData.TARGET_ID, false);
                    return api.sendMessage("تم تفعيل وضع الحماية من التعديلات غير المصرح بها.", event.threadID, event.messageID);
                });
            } 
            else if (logMessageData.ADMIN_EVENT === "remove_admin") {
                if (author === api.getCurrentUserID()) return;
                if (logMessageData.TARGET_ID === api.getCurrentUserID()) return;

                api.changeAdminStatus(event.threadID, author, false, (err) => {
                    if (err) return api.sendMessage("حدث خطأ أثناء التعديل.", event.threadID, event.messageID);
                    api.changeAdminStatus(event.threadID, logMessageData.TARGET_ID, true);
                    return api.sendMessage("تم تفعيل وضع الحماية من التعديلات غير المصرح بها.", event.threadID, event.messageID);
                });
            }
        }
    }
};
