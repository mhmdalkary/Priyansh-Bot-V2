module.exports.config = {
    name: "قطعة",
    version: "1.0.0",
    hasPermision: 0,
    credit: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "random animal fact by Juswa",
    commandCategory: "random-img",
    cooldowns: 0,
};

module.exports.run = async function({api, event, args, utils, Users, Threads}) {
    try {
        let axios = require('axios');
        let fs = require("fs-extra");
        let request = require("request");
        var juswa = ['كلب', 'قط', 'باندا', 'فوكس', 'كوالا', 'عصفور', 'راكون', 'كنغر ', 'الباندا الحمراء '];
        var juswa1 = juswa[Math.floor(Math.random() * juswa.length)];
        let {threadID, senderID, messageID} = event;
	const res = await axios.get(`https://some-random-api.ml/animal/${juswa1}`);
	console.log(res.data);
	var data = res.data;
	let callback = function() {
            return api.sendMessage({
                body:`Facts about ${juswa1}: ${data.fact}`,
                attachment: fs.createReadStream(__dirname + `/cache/image.png`)
            }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/image.png`), event.messageID);
        };
		return request(encodeURI(data.image)).pipe(fs.createWriteStream(__dirname + `/cache/image.png`)).on("close", callback);
		} catch (err) {
        console.log(err)
        return api.sendMessage(`Error`, event.threadID)
    }
}
