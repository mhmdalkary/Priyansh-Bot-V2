module.exports.config = {
    name: "عمل",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭", 
    description: "مركز وظائف لكسب العملات",
    commandCategory: "Economy",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 5000
    }
};

module.exports.languages = {
    "en": {
        "cooldown": "»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹\n\nانتهى الوقت، تعال بعد: %1 دقيقة و %2 ثانية.\n»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹"
    }
}

module.exports.handleReply = async ({ event, api, handleReply, Currencies, getText }) => {
    const { threadID, messageID, senderID } = event;
    let data = (await Currencies.getData(senderID)).data || {};

    var coinscn = Math.floor(Math.random() * 401) + 200;
    var coinsdv = Math.floor(Math.random() * 801) + 200;
    var coinsmd = Math.floor(Math.random() * 401) + 200;
    var coinsq = Math.floor(Math.random() * 601) + 200;
    var coinsdd = Math.floor(Math.random() * 201) + 200;
    var coinsdd1 = Math.floor(Math.random() * 801) + 200;

    var rdcn = ['موظف توظيف', 'مدير فندق', 'في محطة الكهرباء', 'طباخ مطعم', 'عامل مصنع'];
    var work1 = rdcn[Math.floor(Math.random() * rdcn.length)];

    var rddv = ['سباك', 'تصليح مكيفات الجيران', 'مندوب مبيعات', 'توزيع منشورات', 'شاحن', 'تصليح كمبيوتر', 'مرشد سياحي', 'مربية أطفال'];
    var work2 = rddv[Math.floor(Math.random() * rddv.length)];

    var rdmd = ['جمع 13 برميل نفط', 'جمع 8 براميل نفط', 'سرقة النفط', 'مزج الماء بالنفط وبيعه'];
    var work3 = rdmd[Math.floor(Math.random() * rdmd.length)];

    var rdq = ['تعدين خام الحديد', 'تعدين خام الذهب', 'تعدين الفحم', 'تعدين خام الرصاص', 'تعدين النحاس', 'تعدين النفط'];
    var work4 = rdq[Math.floor(Math.random() * rdq.length)];

    var rddd = ['حفر الماس', 'حفر الذهب', 'حفر الفحم', 'حفر الزمرد', 'حفر الحديد', 'حفر الحجر العادي', 'كسول', 'حفر حجر أزرق'];
    var work5 = rddd[Math.floor(Math.random() * rddd.length)];

    var rddd1 = ['ضيف VIP', 'براءة اختراع', 'غريب', 'شاب عمره 23 سنة', 'راعي', 'رجل أعمال عمره 92 سنة', 'ولد عمره 12 سنة'];
    var work6 = rddd1[Math.floor(Math.random() * rddd1.length)];

    var msg = "";

    switch(handleReply.type) {
        case "choosee": {
            switch(event.body) {
                case "1": 
                    msg = `»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹\n⚡️ تعمل كـ ${work1} في المنطقة الصناعية وربحت ${coinscn}$\n»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹`; 
                    Currencies.increaseMoney(senderID, coinscn); 
                    break;             
                case "2": 
                    msg = `»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹\n⚡️ تعمل كـ ${work2} في منطقة الخدمات وربحت ${coinsdv}$\n»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹`; 
                    Currencies.increaseMoney(senderID, coinsdv); 
                    break;
                case "3": 
                    msg = `»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹\n⚡️ أنت ${work3} في حقول النفط وبعت بـ ${coinsmd}$\n»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹`; 
                    Currencies.increaseMoney(senderID, coinsmd); 
                    break;
                case "4": 
                    msg = `»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹\n⚡️ تقوم بتعدين ${work4} وربحت ${coinsq}$\n»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹`; 
                    Currencies.increaseMoney(senderID, coinsq); 
                    break;
                case "5": 
                    msg = `»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹\n⚡️ تقوم بحفر ${work5} وربحت ${coinsdd}$\n»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹`; 
                    Currencies.increaseMoney(senderID, coinsdd); 
                    break;
                case "6": 
                    msg = `»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹\n⚡️ اخترت ${work6} وربحت ${coinsdd1}$ بعد ليلة واحدة، هل وافقت؟ :)\n»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹`; 
                    Currencies.increaseMoney(senderID, coinsdd1); 
                    break;
                case "7": 
                    msg = "»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹\n⚡️ قريباً...\n»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹"; 
                    break;
                default: break;
            };

            const choose = parseInt(event.body);
            if (isNaN(choose)) return api.sendMessage("»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹\n⚡️ الرجاء إدخال رقم صحيح\n»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹", threadID, messageID);
            if (choose > 7 || choose < 1) return api.sendMessage("»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹\n⚡️ الخيار غير موجود في القائمة\n»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹", threadID, messageID);

            api.unsendMessage(handleReply.messageID);

            return api.sendMessage(msg, threadID, async () => {
                data.work2Time = Date.now();
                await Currencies.setData(senderID, { data });
            });
        };
    }
}

module.exports.run = async ({ event, api, handleReply, Currencies, getText }) => {
    const { threadID, messageID, senderID } = event;
    const cooldown = global.configModule[this.config.name].cooldownTime;
    let data = (await Currencies.getData(senderID)).data || {};

    if (typeof data !== "undefined" && cooldown - (Date.now() - data.work2Time) > 0) {
        let time = cooldown - (Date.now() - data.work2Time),
            minutes = Math.floor(time / 60000),
            seconds = ((time % 60000) / 1000).toFixed(0);
        return api.sendMessage(getText("cooldown", minutes, (seconds < 10 ? "0" + seconds : seconds)), threadID, messageID);
    } else {    
        return api.sendMessage("»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹\nمركز وظائف كسب العملات:\n\n" +
            "1. الوظائف في المنطقة الصناعية\n" +
            "2. وظائف الخدمات\n" +
            "3. العمل في حقول النفط\n" +
            "4. تعدين المعادن\n" +
            "5. حفر الصخور\n" +
            "6. وظائف خاصة\n" +
            "7. قريباً...\n\n" +
            "⚡️ الرجاء الرد على هذه الرسالة واختيار رقم الوظيفة\n»\n‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹",
            threadID, (error, info) => {
                data.work2Time = Date.now();
                global.client.handleReply.push({
                    type: "choosee",
                    name: this.config.name,
                    author: senderID,
                    messageID: info.messageID
                });
            });
    }
}

/*
@credit P-SeverTeam
@Vui lòng không đổi credit!
*/
