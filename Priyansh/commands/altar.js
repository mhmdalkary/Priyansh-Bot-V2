module.exports.config = {  
	name: "ذبح",  
	version: "1.0.2",  
	hasPermssion: 0,  
	credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",  
	description: "المذبح [مذكور]",  
	commandCategory: "edit-img",  
	usages: "[@وسم]",  
	cooldowns: 5,  
	dependencies: {  
	  "fs-extra": "",  
	  "axios": "",  
	  "canvas" :"",  
	  "jimp": "",  
	  "node-superfetch": ""  
	}  
};  
// ...
 api.sendMessage({attachment: fs.createReadStream(path_toilet, {'highWaterMark': 128 * 1024}), body: "هاي، كيف حالك؟ :))"}, event.threadID, () => fs.unlinkSync(path_toilet), event.messageID);  
// ...  
	var avatar = await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
	avatar = await this.circle(avatar.body);
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
	ctx.drawImage(await Canvas.loadImage(avatar), 353, 158, 205, 205);
	const imageBuffer = canvas.toBuffer();
	fs.writeFileSync(path_toilet,imageBuffer);
	 api.sendMessage({attachment: fs.createReadStream(path_toilet, {'highWaterMark': 128 * 1024}), body: "Hey, how are you? :))"}, event.threadID, () => fs.unlinkSync(path_toilet), event.messageID);
}
catch(e) {api.sendMessage(e.stack, event.threadID )}
}
