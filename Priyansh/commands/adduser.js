module.exports.config = {
	name: "اضف",
	version: "2.4.3",
	hasPermssion: 1,
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	description: "إضافة مستخدم للمجموعة عبر الرابط أو المعرف",
	commandCategory: "group",
	usages: "[args]",
	cooldowns: 5
};

async function getUID(url, api) {
	// دالة مشفرة هنا، ما فيها نصوص تحتاج ترجمة
}

module.exports.run = async function ({ api, event, args }) {
	const { threadID, messageID } = event;
	const botID = api.getCurrentUserID();
	const out = msg => api.sendMessage(msg, threadID, messageID);
	var { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
	var participantIDs = participantIDs.map(e => parseInt(e));
	if (!args[0]) return out("من فضلك أدخل معرف أو رابط الملف الشخصي للمستخدم الذي تريد إضافته.");
	if (!isNaN(args[0])) return adduser(args[0], undefined);
	else {
		try {
			var [id, name, fail] = await getUID(args[0], api);
			if (fail == true && id != null) return out(id);
			else if (fail == true && id == null) return out("لم يتم العثور على معرف المستخدم.");
			else {
				await adduser(id, name || "مستخدم فيسبوك");
			}
		} catch (e) {
			return out(`${e.name}: ${e.message}.`);
		}
	}

	async function adduser(id, name) {
		id = parseInt(id);
		if (participantIDs.includes(id)) return out(`${name ? name : "العضو"} موجود بالفعل في المجموعة.`);
		else {
			var admins = adminIDs.map(e => parseInt(e.id));
			try {
				await api.addUserToGroup(id, threadID);
			}
			catch {
				return out(`لا يمكن إضافة ${name ? name : "المستخدم"} إلى المجموعة.`);
			}
			if (approvalMode === true && !admins.includes(botID)) return out(`تمت إضافة ${name ? name : "العضو"} لقائمة الموافقة!`);
			else return out(`تمت إضافة ${name ? name : "العضو"} إلى المجموعة!`);
		}
	}
}
