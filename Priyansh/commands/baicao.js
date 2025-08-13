module.exports.config = {
	name: "كاردس",
	version: "1.0.4",
	hasPermssion: 0, // 0 تعني أن الأمر متاح للجميع (ليس فقط للمسؤولين)
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
	description: "لعبة مراهنات مخصصة للمجموعات التي تراهن.",
	commandCategory: "game-mp", // تصنيف الأمر: لعبة جماعية (multiplayer)
	usages: "[بدء/انضمام/معلومات/مغادرة]", // طريقة الاستخدام
	cooldowns: 1 // فترة انتظار 1 ثانية قبل استخدام الأمر مرة أخرى
};

module.exports.handleEvent = async ({ event, api, Users }) => {
	const { senderID, threadID, body, messageID } = event;

	if (typeof body == "undefined") return;
	// إذا لم تكن 'baicao' موجودة في البيانات العامة للوحدات، قم بإنشائها كخريطة جديدة
	if (!global.moduleData.baicao) global.moduleData.baicao = new Map();
	// إذا لم تكن هناك لعبة 'baicao' جارية في هذه المحادثة، لا تفعل شيئًا
	if (!global.moduleData.baicao.has(threadID)) return;
	// احصل على قيم اللعبة الحالية في هذه المحادثة
	var values = global.moduleData.baicao.get(threadID);
	// إذا لم تكن اللعبة قد بدأت بعد (start != 1)، لا تفعل شيئًا
	if (values.start != 1) return;

	// إذا كانت رسالة المستخدم تبدأ بـ "chia bài" (توزيع الأوراق)
	if (body.indexOf("chia bài") == 0) {
		// إذا كانت الأوراق قد تم توزيعها بالفعل (chiabai == 1)، لا تفعل شيئًا
		if (values.chiabai == 1) return;
		// لكل لاعب في اللعبة
		for(const key in values.player) {
			// توزيع 3 أوراق عشوائية بين 1 و 9
			const card1 = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
			const card2 = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
			const card3 = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
			var tong = (card1 + card2 + card3); // حساب مجموع الأوراق
			if (tong >= 20) tong -= 20; // إذا كان المجموع 20 أو أكثر، اطرح 20
			if (tong >= 10) tong -= 10; // إذا كان المجموع 10 أو أكثر، اطرح 10 (للحصول على الرقم الأخير)
			// تخزين الأوراق والمجموع للاعب
			values.player[key].card1 = card1;
			values.player[key].card2 = card2;
			values.player[key].card3 = card3;
			values.player[key].tong = tong;
			// إرسال الأوراق ومجموعها للاعب بشكل خاص
			api.sendMessage(`أوراقك: ${card1} | ${card2} | ${card3} \n\nمجموع أوراقك: ${tong}`, values.player[key].id, (error, info) => {
				// في حالة وجود خطأ في إرسال الرسالة الخاصة للاعب
				if (error) api.sendMessage(`لا يمكن مشاركة الرسائل مع المستخدم الآخر: ${values.player[key].id}`, threadID)
			});
				
		}
		values.chiabai = 1; // تعيين علامة توزيع الأوراق إلى 1 (تم التوزيع)
		global.moduleData.baicao.set(threadID, values); // تحديث بيانات اللعبة
		return api.sendMessage("تم توزيع الأوراق بنجاح! على جميع الأشخاص الذين لم يغيروا ورقتهم الثانية، يرجى التحقق وانتظار الرسالة.", threadID);
	}

	// إذا كانت رسالة المستخدم تبدأ بـ "đổi bài" (تغيير الأوراق)
	if (body.indexOf("đổi bài") == 0) {
		// إذا لم تكن الأوراق قد تم توزيعها بعد (chiabai != 1)، لا تفعل شيئًا
		if (values.chiabai != 1) return;
		// البحث عن اللاعب الحالي
		var player = values.player.find(item => item.id == senderID);
		// إذا لم يكن لدى اللاعب محاولات تغيير (doibai == 0)، أرسل رسالة خطأ
		if (player.doibai == 0) return api.sendMessage("لقد استنفدت جميع محاولات التبديل.", threadID, messageID);
		// إذا كان اللاعب قد أصبح "جاهزًا" بالفعل، لا يمكنه تغيير الورقة
		if (player.ready == true) return api.sendMessage("أنت جاهز، لا يمكنك تغيير الورقة!", threadID, messageID);
		const card = ["card1","card2","card3"];
		// تغيير ورقة عشوائية من أوراق اللاعب بورقة جديدة
		player[card[(Math.floor(Math.random() * card.length))]] = Math.floor(Math.random() * (9 - 1 + 1)) + 1;
		// إعادة حساب مجموع الأوراق بعد التغيير
		player.tong = (player.card1 + player.card2 + player.card3);
		if (player.tong >= 20) player.tong -= 20;
		if (player.tong >= 10) player.tong -= 10;
		player.doibai -= 1; // تقليل عدد محاولات التغيير المتبقية للاعب
		global.moduleData.baicao.set(values); // تحديث بيانات اللعبة
		// إرسال الأوراق الجديدة ومجموعها للاعب بشكل خاص
		return api.sendMessage(`تم تغيير أوراقك: ${player.card1} | ${player.card2} | ${player.card3} \n\nمجموع أوراقك الجديد: ${player.tong}`, player.id, (error, info) => {
			if (error) api.sendMessage(`لا يمكن تغيير الورقة للمستخدم: ${player.id}`, threadID)
		});
	}

	// إذا كانت رسالة المستخدم تبدأ بـ "ready" (جاهز)
	if (body.indexOf("ready") == 0) {
		// إذا لم تكن الأوراق قد تم توزيعها بعد (chiabai != 1)، لا تفعل شيئًا
		if (values.chiabai != 1) return;
		// البحث عن اللاعب الحالي
		var player = values.player.find(item => item.id == senderID);
		// إذا كان اللاعب قد أصبح "جاهزًا" بالفعل، لا تفعل شيئًا
		if (player.ready == true) return;
		const name = await Users.getNameUser(player.id); // جلب اسم اللاعب
		values.ready += 1; // زيادة عدد اللاعبين الجاهزين
		player.ready = true; // تعيين حالة اللاعب إلى جاهز
		// إذا كان عدد اللاعبين الجاهزين يساوي العدد الإجمالي للاعبين
		if (values.player.length == values.ready) {
			const player = values.player;
			player.sort(function (a, b) { return b.tong - a.tong }); // ترتيب اللاعبين بناءً على مجموع أوراقهم تنازليًا

			var ranking = [], num = 1;

			// بناء قائمة الترتيب
			for (const info of player) {
				const name = await Users.getNameUser(info.id);
				ranking.push(`${num++} • ${name} بأوراقه: ${info.card1} | ${info.card2} | ${info.card3} => ${info.tong} نقطة\n`);
			}

			global.moduleData.baicao.delete(threadID); // حذف بيانات اللعبة بعد انتهائها
			return api.sendMessage(`النتائج:\n\n ${ranking.join("\n")}`, threadID); // إرسال النتائج
		}
		// إذا لم يكن جميع اللاعبين جاهزين بعد
		else return api.sendMessage(`اللاعب: ${name} أصبح جاهزًا، يتبقى: ${values.player.length - values.ready} أشخاص لم يصبحوا جاهزين بعد.`, event.threadID);
	}
	
	// إذا كانت رسالة المستخدم تبدأ بـ "nonready" (غير جاهز)
	if (body.indexOf("nonready") == 0) {
		// تصفية اللاعبين الذين لم يصبحوا جاهزين بعد
		const data = values.player.filter(item => item.ready == false);
		var msg = [];

		// جلب أسماء اللاعبين غير الجاهزين
		for (const info of data) {
			const name = global.data.userName.get(info.id) || await Users.getNameUser(info.id);
			msg.push(name);
		}
		// إذا كان هناك لاعبون غير جاهزين، أرسل رسالة بقوائمهم
		if (msg.length != 0) return api.sendMessage("الذين لم يصبحوا جاهزين بعد: " + msg.join(", "), threadID);
		else return; // إذا كان الجميع جاهزًا، لا تفعل شيئًا
	}
}

module.exports.run = async ({ api, event, args }) => {
	var { senderID, threadID, messageID } = event;

	threadID = String(threadID);
	senderID = String(senderID);
	
	// إذا لم تكن 'baicao' موجودة في البيانات العامة للوحدات، قم بإنشائها كخريطة جديدة
	if (!global.moduleData.baicao) global.moduleData.baicao = new Map();
	// احصل على قيم اللعبة الحالية في هذه المحادثة، أو كائن فارغ إذا لم تكن موجودة
	var values = global.moduleData.baicao.get(threadID) || {};

	switch (args[0]) {
		case "انشاء": // إنشاء لعبة جديدة
		case "-c": {
			// إذا كانت هناك لعبة 'baicao' مفتوحة بالفعل في هذه المجموعة
			if (global.moduleData.baicao.has(threadID)) return api.sendMessage("يوجد حالياً لعبة مفتوحة في هذه المجموعة.", threadID, messageID);
			// إنشاء لعبة جديدة وتعيين المنشئ، الحالة الأولية، واللاعب الأول
			global.moduleData.baicao.set(event.threadID, { "author": senderID, "start": 0, "chiabai": 0, "ready": 0, player: [ { "id": senderID, "card1": 0, "card2": 0, "card3": 0, "doibai": 2, "ready": false } ] });
			return api.sendMessage("تم إنشاء لعبة الأوراق بنجاح! للانضمام إلى اللعبة، أدخل 'baicao join'.", threadID, messageID);
		}
		
		case "انضمام": // الانضمام إلى لعبة
		case "-j": {
			// إذا لم تكن هناك لعبة 'baicao' قد تم إنشاؤها
			if (!values) return api.sendMessage("لا توجد لعبة 'baicao' منشأة حالياً، يمكنك إنشاء واحدة باستخدام 'baicao create'.", threadID, messageID);
			// إذا كانت اللعبة قد بدأت بالفعل
			if (values.start == 1) return api.sendMessage("لقد بدأت الطاولة بالفعل.", threadID, messageID);
			// إذا كان اللاعب قد انضم بالفعل إلى اللعبة
			if (values.player.find(item => item.id == senderID)) return api.sendMessage("لقد انضممت بالفعل إلى هذه اللعبة!", threadID, messageID);
			// إضافة اللاعب إلى قائمة اللاعبين
			values.player.push({ "id": senderID, "card1": 0, "card2": 0, "card3": 0, "tong": 0, "doibai": 2, "ready": false });
			global.moduleData.baicao.set(threadID, values); // تحديث بيانات اللعبة
			return api.sendMessage("لقد انضممت بنجاح!", threadID, messageID);
		}

		case "مغادرة": // مغادرة اللعبة
		case "-l": {
			// إذا لم تكن هناك لعبة 'baicao' قد تم إنشاؤها
			if (typeof values.player == "undefined") return api.sendMessage("لا توجد لعبة 'baicao' منشأة حالياً، يمكنك إنشاء واحدة باستخدام 'baicao create'.", threadID, messageID);
			// إذا لم يكن اللاعب قد شارك في اللعبة في هذه المجموعة
			if (!values.player.some(item => item.id == senderID)) return api.sendMessage("لم تشارك بعد في اللعبة في هذه المجموعة!", threadID, messageID);
			// إذا كانت اللعبة قد بدأت بالفعل
			if (values.start == 1) return api.sendMessage("لقد بدأت الطاولة بالفعل.", threadID, messageID);
			// إذا كان اللاعب هو منشئ اللعبة
			if (values.author == senderID) {
				global.moduleData.baicao.delete(threadID); // حذف اللعبة بالكامل
				api.sendMessage("لقد غادر المنشئ الطاولة، مما يعني أن اللعبة قد انتهت!", threadID, messageID);
			}
			else {
				// إزالة اللاعب من قائمة اللاعبين
				values.player.splice(values.player.findIndex(item => item.id === senderID), 1);
				api.sendMessage("لقد غادرت هذه الطاولة!", threadID, messageID);
				global.moduleData.baicao.set(threadID, values); // تحديث بيانات اللعبة
			}
			return;
		}

		case "بدء": // بدء اللعبة
		case "-s": {
			// إذا لم تكن هناك لعبة 'baicao' قد تم إنشاؤها
			if (!values) return api.sendMessage("لا توجد لعبة 'baicao' منشأة حالياً، يمكنك إنشاء واحدة باستخدام 'baicao create'.", threadID, messageID);
			// إذا لم يكن اللاعب هو منشئ اللعبة
			if (values.author !== senderID) return api.sendMessage("لا يجب أن تكون المالك لتبدأ اللعبة.", threadID, messageID);
			// إذا كان عدد اللاعبين أقل من أو يساوي 1
			if (values.player.length <= 1) return api.sendMessage("لا يوجد حالياً أي لاعبين منضمين، يمكنك دعوة أشخاص للانضمام بطلب من اللاعبين الآخرين الانضمام.", threadID, messageID);
			// إذا كانت اللعبة قد بدأت بالفعل
			if (values.start == 1) return api.sendMessage("لقد بدأت الطاولة حالياً من قبل مالك الطاولة.", threadID, messageID);
			values.start = 1; // تعيين حالة اللعبة إلى "بدأت"
			return api.sendMessage("لقد بدأت اللعبة.", threadID, messageID);
		}

		case "معلومات": // عرض معلومات اللعبة
		case "-i": {
			// إذا لم تكن هناك لعبة 'baicao' قد تم إنشاؤها
			if (typeof values.player == "undefined") return api.sendMessage("لا توجد لعبة 'baicao' منشأة حالياً، يمكنك إنشاء واحدة باستخدام 'baicao create'.", threadID, messageID);
			return api.sendMessage(
				"=== معلومات لعبة Bai Cao ===" +
				"\n- منشئ اللعبة: " + values.author +
				"\n- العدد الإجمالي للاعبين: " + values.player.length + " شخص"
			, threadID, messageID);
		}

		default: {
			return global.utils.throwError(this.config.name, threadID, messageID);
		}
	}
}
