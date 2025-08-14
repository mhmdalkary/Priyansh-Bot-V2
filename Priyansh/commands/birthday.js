module.exports.config = {
	name: "بيرذي",
	version: "1.0.0",
	hasPermssion: 0,
  	credits: "حمادي",
	description: "See admin's birthday",
  	usePrefix: false,
	commandCategory: "bday",
	cooldowns: 5
}

module.exports.run =  ({ api, event, args, client, Users, Threads, __GLOBAL, Currencies }) => {
	const axios = global.nodemodule["axios"];
	const request = global.nodemodule["request"];
	const fs = global.nodemodule["fs-extra"];
    const t = Date.parse("2026") - Date.parse(new Date());
    const seconds = Math.floor( (t/1000) % 60 );
    const minutes = Math.floor( (t/1000/60) % 60 );
    const hours = Math.floor( (t/(1000*60*60)) % 24 );
    const days = Math.floor( t/(1000*60*60*24) );
    var callback = () => api.sendMessage(
	  {body:`الوقت المتبقي - حمادي birthday\n» ${days} أيام \n ${hours} ساعات \n ${minutes} دقائق \n ${seconds} ثواني . «`, 
      attachment: fs.createReadStream(__dirname + "/cache/1.png")}, 
      event.threadID, 
      () => fs.unlinkSync(__dirname + "/cache/1.png")
    );  
    return request(encodeURI(`https://graph.facebook.com/100087632392287/picture?height=720&width=720&access_token=66262`))
        .pipe(fs.createWriteStream(__dirname+'/cache/1.png'))
        .on('close',() => callback());
};
