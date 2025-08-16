module.exports.config = {

  name: "ألبوم",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
  description: "Search an Image",
  commandCategory: "image",
  usages: "ألبوم [text]",
  cooldowns: 5,
  dependencies: {

     "axios":"",
     "fs-extra":"",
    "googlethis":"",
        "cloudscraper":""
  }
};




module.exports.run = async ({matches, event, api, extra, args}) => {

    const axios = global.nodemodule['axios'];
    const google = global.nodemodule["googlethis"];
const cloudscraper = global.nodemodule["cloudscraper"];
const fs = global.nodemodule["fs"];
try{
var query = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
  //let query = args.join(" ");
  api.sendMessage(`🔎 البحث عن  ${query}...`, event.threadID, event.messageID);

  let result = await google.image(query, {safe: false});
  if(result.length === 0) {
    api.sendMessage(`⚠️ لم يتم العثور على أية نتيجة من خلال بحثك عن الصور. `, event.threadID, event.messageID)
    return;
  }

  let streams = [];
  let counter = 0;

  console.log(result)

  for(let image of result) {
    // Only show 6 images
    if(counter >= 10)
      break;

    console.log(`${counter}: ${image.url}`);

    // Ignore urls that does not ends with .jpg or .png
    let url = image.url;
    if(!url.endsWith(".jpg") && !url.endsWith(".png"))
      continue;

   let path = __dirname + `/cache/search-image-${counter}.jpg`;
    let hasError = false;
    await cloudscraper.get({uri: url, encoding: null})
      .then((buffer) => fs.writeFileSync(path, buffer))
      .catch((error) => {
        console.log(error)
        hasError = true;
      });

    if(hasError)
      continue;

    console.log(`Pushed to streams: ${path}`) ;
    streams.push(fs.createReadStream(path).on("end", async () => {
      if(fs.existsSync(path)) {
        fs.unlink(path, (err) => {
          if(err) return console.log(err);

          console.log(`Deleted file: ${path}`);
        });
      }
    }));

    counter += 1;
  }

  api.sendMessage("⏳ إرسال نتيجة البحث ...", event.threadID, event.messageID)

  let msg = {
    body: `--------------------\nنتيجة بحث الصورة \n"${query}"\n\لقيته:: ${result.length} صورة${result.length > 1 ? 's' : ''}\nعرض فقط: 10 صور \n\n--------------------`,
    attachment: streams
  };

  api.sendMessage(msg, event.threadID, event.messageID);
}catch(e){
  console.log("ERR: "+e)
  api.sendMessage("⚠️ERR: "+e, event.threadID, event.messageID);
}
};
