module.exports.config = {  
  name: "ألبوم",  
  version: "1.1.0",  
  hasPermssion: 0,  
  credits: "ترجمة وتعديل محمد",  
  description: "بحث صور من جوجل",  
  commandCategory: "صور",  
  usages: "ألبوم [كلمة]",  
  cooldowns: 5,  
  dependencies: {  
     "axios":"",  
     "fs-extra":"",  
     "googlethis":"",  
     "cloudscraper":""  
  }  
};  

let cacheResults = {};  

module.exports.run = async ({ event, api, args }) => {  
  const google = global.nodemodule["googlethis"];  
  const cloudscraper = global.nodemodule["cloudscraper"];  
  const fs = global.nodemodule["fs-extra"];  

  try {  
    let query = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");  
    if(!query) return api.sendMessage("⚠️ اكتب كلمة للبحث عن صور", event.threadID, event.messageID);  

    api.sendMessage(`🔎 جاري البحث عن "${query}" ...`, event.threadID, event.messageID);  

    let result = await google.image(query, { safe: false });  
    if(result.length === 0) return api.sendMessage(`❌ ماكو نتائج للبحث "${query}"`, event.threadID, event.messageID);  

    // خزن النتائج عشان نستخدمها بالدُفعات  
    cacheResults[event.threadID] = { query, result, index: 0 };  

    sendBatch(event.threadID, event.messageID, api);  

  } catch (e) {  
    console.log("ERR: " + e);  
    api.sendMessage("⚠️ خطأ: " + e, event.threadID, event.messageID);  
  }  
};  

async function sendBatch(threadID, messageID, api) {  
  const cloudscraper = global.nodemodule["cloudscraper"];  
  const fs = global.nodemodule["fs-extra"];  

  if(!cacheResults[threadID]) return;  
  let { query, result, index } = cacheResults[threadID];  

  let streams = [];  
  let count = 0;  

  for(let i = index; i < result.length && count < 6; i++) {  
    let url = result[i].url;  
    if(!url.endsWith(".jpg") && !url.endsWith(".png")) continue;  

    let path = __dirname + `/cache/search-${threadID}-${i}.jpg`;  
    try {  
      let buffer = await cloudscraper.get({ uri: url, encoding: null });  
      fs.writeFileSync(path, buffer);  
      streams.push(fs.createReadStream(path).on("end", () => fs.unlinkSync(path)));  
      count++;  
    } catch (e) {  
      console.log("تحميل فشل: " + e);  
    }  
  }  

  if(streams.length == 0) return api.sendMessage("❌ ما قدرت ارسل صور بهذي الدفعة", threadID, messageID);  

  cacheResults[threadID].index += count;  

  let msg = {  
    body: `📸 نتائج بحث: "${query}"\nدفعة جديدة (${cacheResults[threadID].index}/${result.length})\n\nاعمل 👍 لاكمال الدفعة الجاية`,  
    attachment: streams  
  };  

  api.sendMessage(msg, threadID, (err, info) => {  
    if(!err) cacheResults[threadID].lastMsgID = info.messageID;  
  }, messageID);  
}  

module.exports.handleReaction = ({ event, api }) => {  
  if(event.reaction != "👍") return;  
  let data = cacheResults[event.threadID];  
  if(!data) return;  
  if(event.messageID != data.lastMsgID) return;  

  sendBatch(event.threadID, event.messageID, api);  
};
