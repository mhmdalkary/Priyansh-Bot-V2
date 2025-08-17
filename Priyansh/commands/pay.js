module.exports.config = {
    name: "تحويل",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Mirai Team (ترجمه للعربي بواسطة ChatGPT)",
    description: "تحويل رصيد لشخص ثاني",
    commandCategory: "الاقتصاد",
    usages: "تحويل [منشن المستخدم] [المبلغ]",
    cooldowns: 5
};

module.exports.languages = {
    "ar": {
        "missingTag": "[ تحويل ] لازم تعمل منشن للشخص اللي تبي تحول له",
        "overTagLength": "[ تحويل ] تقدر تعمل منشن لشخص واحد فقط",
        "userNotExist": "[ تحويل ] الشخص اللي حاولت تحول له مو موجود بالنظام",
        "invalidInput": "[ تحويل ] المبلغ اللي دخلته غير صالح",
        "payerNotExist": "[ تحويل ] انت مو مسجل بالنظام بعد، انتظر 5 ثواني وجرب مرة ثانية",
        "notEnoughMoney": "[ تحويل ] رصيدك غير كافي للتحويل",
        "paySuccess": "[ تحويل ] تم تحويل %1$ (مع خصم 15٪ ضريبة) للمستخدم: %2",
        "error": "[ تحويل ] صار خطأ غير متوقع وقت العملية"
    }
}

module.exports.run = async function ({ api, event, Currencies, Users, args, getText }) {
    const { increaseMoney, decreaseMoney, getData } = Currencies;
    const { threadID, messageID, senderID } = event;
	var targetID = String(args[1]);
	var moneyPay = (args.slice(2, args.length)).join(" ") || null;

	if (isNaN(targetID)) {
		const mention = Object.keys(event.mentions);
        if (mention.length == 0) return api.sendMessage(getText("missingTag"), threadID, messageID);
        if (mention.length > 1) return api.sendMessage(getText("overTagLength"), threadID, messageID);
		args = args.join(" ");
		targetID = String(mention[0]);
		moneyPay = (args.slice(args.indexOf(event.mentions[mention[0]]) + (event.mentions[mention[0]] || "").length + 1, args.length)) || null;
	}

    if (!global.data.allCurrenciesID.includes(targetID)) return api.sendMessage(getText("userNotExist"), threadID, messageID);

    if (isNaN(moneyPay) && moneyPay < 1) return api.sendMessage(getText("invalidInput"), threadID, messageID);
    const taxed = (parseInt(moneyPay) * 15) / 100;
    
    try {
        const moneyPayer = (await getData(senderID)).money;
        if (!moneyPayer) return api.sendMessage(getText("payerNotExist"), threadID, messageID);
        if (moneyPayer < moneyPay) return api.sendMessage(getText("notEnoughMoney"), threadID, messageID);
        const nameTarget = global.data.userName.get(targetID) || await Users.getNameUser(targetID);
        await decreaseMoney(senderID, parseInt(moneyPay));
        await increaseMoney(targetID, parseInt(moneyPay) - taxed);
        return api.sendMessage(getText("paySuccess", (parseInt(moneyPay) - taxed), `${targetID} - ${nameTarget}`), threadID, messageID);
    } catch { return api.sendMessage(getText("error"), threadID, messageID) }
}
