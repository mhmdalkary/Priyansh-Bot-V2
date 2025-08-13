module.exports.config = {
    name: "عمل",
    version: "1.0.3",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "وظيفة عشوائية لكسب العملات",
    commandCategory: "Economy",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 43200000 // 12 ساعة بالمللي ثانية
    }
};

module.exports.languages = {
    "ar": {
        "cooldown": "انتظر %1 دقيقة و %2 ثانية قبل ما تشتغل مرة تانية"
    }
};

module.exports.run = async ({ event, api, Currencies, getText }) => {
    const { threadID, messageID, senderID } = event;
    const cooldown = global.configModule[this.config.name].cooldownTime;
    let data = (await Currencies.getData(senderID)).data || {};

    if (typeof data !== "undefined" && cooldown - (Date.now() - data.workTime) > 0) {
        let time = cooldown - (Date.now() - data.workTime),
            minutes = Math.floor(time / 60000),
            seconds = ((time % 60000) / 1000).toFixed(0);
        return api.sendMessage(getText("cooldown", minutes, (seconds < 10 ? "0" + seconds : seconds)), threadID, messageID);
    }

    const jobs = [
        { desc: 'موظف توظيف', min: 200, max: 600 },
        { desc: 'مدير فندق', min: 300, max: 800 },
        { desc: 'عامل محطة كهرباء', min: 250, max: 650 },
        { desc: 'طباخ مطعم', min: 150, max: 500 },
        { desc: 'عامل مصنع', min: 200, max: 700 },
        { desc: 'سباك', min: 200, max: 600 },
        { desc: 'مندوب مبيعات', min: 300, max: 900 },
        { desc: 'تعدين ذهب', min: 400, max: 1000 },
        { desc: 'تعدين فحم', min: 200, max: 600 },
        { desc: 'حفر الماس', min: 500, max: 1200 },
        { desc: 'حفر الزمرد', min: 400, max: 1000 }
    ];

    const job = jobs[Math.floor(Math.random() * jobs.length)];
    const reward = Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;

    await Currencies.increaseMoney(senderID, reward);
    data.workTime = Date.now();
    await Currencies.setData(senderID, { data });

    return api.sendMessage(`اشتغلت كـ ${job.desc} وربحت ${reward}$`, threadID, messageID);
};
