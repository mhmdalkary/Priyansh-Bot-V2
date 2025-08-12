module.exports.config = {
    name: "animescrape",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭",
    description: "جلب روابط أنمي",
    commandCategory: "anime",
    usages: "<فراغ>عنوان_الأنمي",
    cooldowns: 0
};

module.exports.run = async function({ api, args, message, download, event }) {
    const cheerio = require('cheerio');
    const fs = require('fs');
    const request = require('request');
    const axios = require('axios');
    var text = args.join(" ");
    const url = "https://nyaa.si/?f=0&c=1_2&q=" + text;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const arrayList = $(".table-responsive table tbody tr");
    const res = [];
    arrayList.each((idx, el) => {
        const Data = {};
        Data.name = $(el).children("td").children("a").text().replace(/\t/gi, "").replace(/\n/gi, "");
        Data.torrentLink = $(el).children(".text-center").children("a")[1].attribs.href;
        res.push(Data);
    });
    var name1 = res[0].name;
    var link1 = res[0].torrentLink;
    var name2 = res[1].name;
    var link2 = res[1].torrentLink;
    var name3 = res[2].name;
    var link3 = res[2].torrentLink;
    var name4 = res[3].name;
    var link4 = res[3].torrentLink;
    var name5 = res[4].name;
    var link5 = res[4].torrentLink;

    fs.writeFile(__dirname + "/cache/torrent-links.txt",
        "🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹\n" + name1 + "\n\n" + link1 +
        "\n\n\n🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹\n" + name2 + "\n\n" + link2 +
        "\n\n\n🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹\n" + name3 + "\n\n" + link3 +
        "\n\n\n🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹\n" + name4 + "\n\n" + link4 +
        "\n\n\n🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹\n" + name5 + "\n\n" + link5,
        function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("تم حفظ الملف بنجاح!");
            var message = {
                body: "تمت عملية الجلب بنجاح\nقم بتحميل وفتح الملف النصي المرفق أدناه!\n\nملاحظة: هذه الأداة تستطيع البحث فقط عن مسلسلات وأفلام الأنمي، داخل الملف النصي ستجد 5 روابط تم جلبها.\n\nالمصدر: https://nyaa.si/",
                attachment: fs.createReadStream(__dirname + "/cache/torrent-links.txt")
            };
            api.sendMessage(message, event.threadID, event.messageID);
        });
};  var name4 = res[3].name;
  var link4 = res[3].torrentLink;
  var name5 = res[4].name;
  var link5 = res[4].torrentLink;
fs.writeFile(__dirname + "/cache/torrent-links.txt","🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹\n"+name1+"\n\n"+link1+"\n\n\n🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹\n"+name2+"\n\n"+link2+"\n\n\n🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹\n"+name3+"\n\n"+link3+"\n\n\n🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹\n"+name4+"\n\n"+link4+"\n\n\n🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹🔸🔹\n"+name5+"\n\n"+link5, function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
var message = {
          body: "Scraping Success\nDownload and Check the text file below!\n\nNote: that this api can only search for anime series/movies, Inside the text file there are 5 links that the api scraped.\n\nSource: https://nyaa.si/",
         attachment: fs.createReadStream(__dirname + "/cache/torrent-links.txt")}
  api.sendMessage(message, event.threadID,event.messageID);
})
}
  


