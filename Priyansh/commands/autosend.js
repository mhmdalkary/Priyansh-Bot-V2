const schedule = require('node-schedule');    
const moment = require('moment-timezone');    
const chalk = require('chalk');    
    
module.exports.config = {    
  name: 'اذكار',    
  version: '10.0.0',    
  hasPermssion: 0,    
  credits: '𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭',    
  description: 'Set Karne Ke Bad Automatically Msg Send Karega',    
  commandCategory: 'group messenger',    
  usages: '[]',    
  cooldowns: 3    
};    
    
const messages = [    
  { time: '5:00 AM', message: '──── •🌅• ──── صباح الخير ☀️ استغفر الله العظيم واتوب اليه' },    
  { time: '6:00 AM', message: '──── •🌅• ──── الحمد لله على نعمة الصباح و بداية يوم جديد 🌸' },    
  { time: '7:00 AM', message: '──── •🌅• ──── لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير' },    
    
  { time: '12:00 PM', message: '──── •🌞• ──── استغفر الله ثلاثاً كل يوم و الله يريح القلب ويغفر الذنوب' },    
  { time: '3:00 PM', message: '──── •🌞• ──── سبحان الله وبحمده سبحان الله العظيم، استمر في ذكر الله' },    
    
  { time: '6:00 PM', message: '──── •🌇• ──── أذكار المساء، أعوذ بكلمات الله التامات من شر ما خلق' },    
  { time: '7:00 PM', message: '──── •🌇• ──── اللهم إني أسألك العفو والعافية في الدنيا والآخرة' },    
  { time: '8:00 PM', message: '──── •🌇• ──── اللهم صل وسلم وبارك على نبينا محمد ﷺ' },    
    
  { time: '10:00 PM', message: '──── •🌙• ──── قبل النوم: اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك المصير' },    
  { time: '11:00 PM', message: '──── •🌙• ──── استغفر الله 3 مرات، سبحان الله 33 مرة، الحمد لله 33 مرة' }    
];    
    
module.exports.onLoad = ({ api }) => {    
  console.log(chalk.bold.hex("#00c300")("============ SUCCESFULLY LOADED THE AUTOSENT COMMAND ============"));    
    
  messages.forEach(({ time, message }) => {        
    const [hour, minute, period] = time.split(/[: ]/);        
    let hour24 = parseInt(hour, 10);        
    if (period === 'PM' && hour !== '12') {        
      hour24 += 12;        
    } else if (period === 'AM' && hour === '12') {        
      hour24 = 0;        
    }        
    
    const scheduledTime = moment.tz({ hour: hour24, minute: parseInt(minute, 10) }, 'Asia/Kolkata').toDate();        
    
    schedule.scheduleJob(scheduledTime, () => {        
      global.data.allThreadID.forEach(threadID => {        
        api.sendMessage(message, threadID, (error) => {        
          if (error) {        
            console.error(`Failed to send message to ${threadID}:`, error);        
          }        
        });        
      });        
    });        
  });    
};    
    
module.exports.run = () => {    
  // This function can be left empty as the main logic is handled in onLoad    
};
