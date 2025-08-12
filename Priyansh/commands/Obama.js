module.exports.config = {
  name: "اوباما",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
  description: "تغريدة أوباما مزخرفة",
  commandCategory: "edit-img",
  usages: "[نص]",
  cooldowns: 10,
  dependencies: {
    "canvas":"",
    "axios":"",
    "fs-extra":""
  }
};

module.exports.wrapText = (ctx, text, maxWidth) => {
  return new Promise(resolve => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text]);
    if (ctx.measureText('W').width > maxWidth) return resolve(null);
    const words = text.split(' ');
    const lines = [];
    let line = '';
    while (words.length > 0) {
      let split = false;
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0];
        words[0] = temp.slice(0, -1);
        if (split) words[1] = `»${temp.slice(-1)}${words[1]}`;
        else {
          split = true;
          words.splice(1, 0, `»${temp.slice(-1)}`);
        }
      }
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) line += `»${words.shift()} `;
      else {
        lines.push(line.trim());
        line = '';
      }
      if (words.length === 0) lines.push(line.trim());
    }
    return resolve(lines);
  });
}

module.exports.run = async function({ api, event, args }) {
  let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  let pathImg = __dirname + '/cache/trump.png';
  var text = args.join(" ");
  if (!text) return api.sendMessage("‏​‏​​ ••  ••\n⇣    ⇣    ⇣\n⇣    ⇣\n⇣\n➤⊹\nادخل نص التعليق المزخرف", threadID, messageID);

  let imageBuffer = (await axios.get(`https://i.imgur.com/6fOxdex.png`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(pathImg, Buffer.from(imageBuffer));

  let baseImage = await loadImage(pathImg);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

  let fontSize = 45;
  ctx.font = `400 ${fontSize}px Arial`;
  ctx.fillStyle = "#000000";
  ctx.textAlign = "start";

  while (ctx.measureText(text).width > 1160 && fontSize > 10) {
    fontSize--;
    ctx.font = `400 ${fontSize}px Arial`;
  }

  const lines = await this.wrapText(ctx, text, 1160);

  let startX = 60;
  let startY = 165;
  let lineHeight = fontSize + 10;

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], startX, startY + (i * lineHeight));
  }

  const imageBufferFinal = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBufferFinal);

  return api.sendMessage({ attachment: fs.createReadStream(pathImg) }, threadID, () => fs.unlinkSync(pathImg), messageID);
}
