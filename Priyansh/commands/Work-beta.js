module.exports.config = {
    name: "عمل",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭", 
    description: "",
    commandCategory: "Economy",
    cooldowns: 5,
    envConfig: {
        cooldownTime: 5000
    }
};
module.exports.languages = {
    
    "en": {
        "cooldown": "لقد انتهيت، عد لاحقًا: %1 دقيقة/دقائق %2 ثانية/ثواني."
    }
}
module.exports.handleReply = async ({ event, api, handleReply, Currencies, getText }) => {
    const { threadID, messageID, senderID } = event;
    let data = (await Currencies.getData(senderID)).data || {};
//random coins nhận được khi làm việc ít nhất 200
var coinscn = Math.floor(Math.random() * 401) + 200; //random coins khi làm ở khu công nghiệp
var coinsdv = Math.floor(Math.random() * 801) + 200; //random coins khi làm ở khu dịch vụ
var coinsmd = Math.floor(Math.random() * 401) + 200; //random coins khi làm ở mỏ dầu
var coinsq = Math.floor(Math.random() * 601) + 200; //random coins khi khai thác quặng
var coinsdd = Math.floor(Math.random() * 201) + 200; //random coins khi đào đá
var coinsdd1 = Math.floor(Math.random() * 801) + 200; //random coins khi đào đá

//random things to do
var rdcn = ['توظيف موظفين', 'مشرف فندق', 'في محطة الطاقة', 'طباخ في مطعم', 'عامل']; //random job when working in industrial park
var work1 = rdcn[Math.floor(Math.random() * rdcn.length)];   

var rddv = ['سباك', 'تصليح مكيفات الجيران', 'بيع متعدد المستويات', 'توزيع منشورات', 'مُوصل طلبات', 'إصلاح حواسيب', 'مرشد سياحي', 'الرضاعة الطبيعية' ]; //random work when working in the service area
var work2 = rddv[Math.floor(Math.random() * rddv.length)]; 

var rdmd = ['حصلت على 13 برميل نفط', 'حصلت على 8 براميل نفط', 'حصلت على 9 براميل نفط', 'حصلت على 8 براميل نفط', 'سرقة النفط', 'إضافة الماء إلى النفط وبيعه']; //random job while working at an oil field
var work3 = rdmd[Math.floor(Math.random() * rdmd.length)]; 

var rdq = ['خام الحديد', 'خام الذهب', 'خام الفحم', 'خام الرصاص', 'خام النحاس', 'خام النفط']; //random job when mining ore
var work4 = rdq[Math.floor(Math.random() * rdq.length)]; 

var rddd = ['ألماس', 'ذهب', 'فحم', 'زمرد', 'حديد', 'حجر عادي', 'كسول', 'حجر أزرق']; //random job when digging rock
var work5 = rddd[Math.floor(Math.random() * rddd.length)]; 

var rddd1 = ['ضيف VIP', 'براءة اختراع', 'غريب', 'أحمق عمره 23 عامًا', 'غريب', 'راعي', 'رجل أعمال عمره 92 عامًا', 'طفل عمره 12 عامًا']; //random work when digging rock
var work6 = rddd1[Math.floor(Math.random() * rddd1.length)];


var msg = "";
    switch(handleReply.type) {
        case "choosee": {
            
            switch(event.body) {
                case "1": msg = `أنت تعمل كـ ${work1} في المنطقة الصناعية وربحت ${coinscn}$` ; Currencies.increaseMoney(event.senderID, coinscn); break;             
                case "2": msg = `أنت تعمل كـ ${work2} في منطقة الخدمات وربحت ${coinsdv}$`; Currencies.increaseMoney(event.senderID, coinsdv); break;
                case "3": msg = `أنت ${work3} في حقل النفط وربحت ${coinsmd}$`; Currencies.increaseMoney(event.senderID, coinsmd); break;
                case "4": msg = `أنت تقوم بتعدين ${work4} وربحت ${coinsq}$`; Currencies.increaseMoney(event.senderID, coinsq); break;
                case "5": msg = `أنت قمت بحفر ${work5} وربحت ${coinsdd}$` ; Currencies.increaseMoney(event.senderID, coinsdd); break;
                case "6": msg = `أنت اخترت ${work6} وتم إعطاؤك ${coinsdd1}$ مقابل xxx ليلة واحدة، ووافقت مباشرة :)))`; Currencies.increaseMoney(event.senderID, coinsdd1); break;
                case "7": msg = "قريباً..."; break; //add case if you want 
                default: break;
            };
            const choose = parseInt(event.body);            const choose = parseInt(event.body);
            if (isNaN(event.body)) return api.sendMessage("⚡️Please enter 1 con number", event.threadID, event.messageID);
            if (choose > 7 || choose < 1) return api.sendMessage("⚡️Option is not on the list.", event.threadID, event.messageID); //thay số case vào số 7
            api.unsendMessage(handleReply.messageID);
            if (msg == "⚡️Chưa update...") {
                msg = "⚡️Update soon...";
            };
            return api.sendMessage(`${msg}`, threadID, async () => {
            data.work2Time = Date.now();
            await Currencies.setData(senderID, { data });
            
        });

    };
}
}
module.exports.run = async ({  event, api, handleReply, Currencies, getText }) => {
    const { threadID, messageID, senderID } = event;
    const cooldown = global.configModule[this.config.name].cooldownTime;
    let data = (await Currencies.getData(senderID)).data || {};
    //cooldownTime for each receipt 
    if (typeof data !== "undefined" && cooldown - (Date.now() - data.work2Time) > 0) {

        var time = cooldown - (Date.now() - data.work2Time),
            minutes = Math.floor(time / 60000),
            seconds = ((time % 60000) / 1000).toFixed(0); 
        return api.sendMessage(getText("cooldown", minutes, (seconds < 10 ? "0" + seconds : seconds)), event.threadID, event.messageID);
    }
    else {    
    return api.sendMessage("Coin Earn Job Center" +
  /*công nghiệp*/ "\n\n1. work1" +
  /*dịch vụ*/  "\n2. work2." +
  /*Mỏ dầu*/ "\n3. work3." +
  /*Quặng*/ "\n4. work4" +
  /*Đào đá*/ "\n5. work5" +
  /*cave*/    "\n6. work6" +
                "\n7. Update soon..." +
                "\n\n⚡️Please reply to the message and choose by number" //add case display here ||  \n[number]. [Career]" +
            , event.threadID, (error, info) => {
                data.work2Time = Date.now();
        global.client.handleReply.push({
            type: "choosee",
            name: this.config.name,
            author: event.senderID,
            messageID: info.messageID
          })  
        })
    }
}
/*
@credit P-SeverTeam
@Vui lòng không đổi credit!
*/
