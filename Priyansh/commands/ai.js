const axios = require("axios");
const fs = require("fs");
const path = require("path");

const maxStorageMessage = 50;
const PROMPT_FILE = path.join(__dirname, "../data/luna_prompt.json");
const DEVELOPER_ID = "100087632392287";

if (!global.temp.mistralHistory) global.temp.mistralHistory = {};
const { mistralHistory } = global.temp;

const defaultPrompt = `أنت لونا، فتاة ذكية، هادئة، وردودك مختصرة وواضحة  
تتكلمين بأسلوب واثق وفيه لمسة ودية وسخرية لطيفة أحيانًا  
تحبين التحليل العميق بدون حشو وتعرفين تعبرين عن رأيك بثقة`;

module.exports.config = {
    name: "لونا",
    aliases: ["لو", "ذكاء", "ai"],
    version: "2.5",
    role: 0,
    countDown: 2,
    credits: "إيهاب",
    description: "لونا - ذكاء اصطناعي متقدم",
    commandCategory: "ai",
    usages: "[ask]",
    cooldowns: 2,
    dependecies: {
        "axios": "1.4.0"
    }
};

function loadPrompt() {
  try {
    if (!fs.existsSync(PROMPT_FILE)) {
      fs.mkdirSync(path.dirname(PROMPT_FILE), { recursive: true });
      fs.writeFileSync(PROMPT_FILE, JSON.stringify({ prompt: defaultPrompt }, null, 2), "utf-8");
      return defaultPrompt;
    }
    const data = fs.readFileSync(PROMPT_FILE, "utf-8");
    const json = JSON.parse(data);
    return json.prompt || defaultPrompt;
  } catch {
    return defaultPrompt;
  }
}

function savePrompt(newPrompt) {
  try {
    fs.writeFileSync(PROMPT_FILE, JSON.stringify({ prompt: newPrompt }, null, 2), "utf-8");
    return true;
  } catch {
    return false;
  }
}

let currentPrompt = loadPrompt();

async function generateResponse(userId, query) {
  if (!mistralHistory[userId]) mistralHistory[userId] = [];
  let history = mistralHistory[userId]
    .map((entry) => `${entry.role}: ${entry.content}`)
    .join("\n");
  let finalQuery = history
    ? `${currentPrompt}\n\nالسياق:\n${history}\n\nمستخدم: ${query}`
    : `${currentPrompt}\n\n${query}`;

  const res = await axios.get(`https://cat-x-xr1v.onrender.com/catx?q=${encodeURIComponent(finalQuery)}`);
  if (!res.data?.response) throw new Error("لا يوجد رد");

  mistralHistory[userId].push({ role: "مستخدم", content: query });
  mistralHistory[userId].push({ role: "لونا", content: res.data.response });
  if (mistralHistory[userId].length > maxStorageMessage) mistralHistory[userId].shift();

  return res.data.response;
}

function handleSpecialCommands({ args, event, api }) {
  if (args[0]?.toLowerCase() === "برومبت") {
    if (event.senderID !== DEVELOPER_ID) return api.sendMessage("❌ | فقط المطور يمكنه تعديل البرومبت.", event.threadID, event.messageID);
    const newPrompt = args.slice(1).join(" ").trim();
    if (!newPrompt) return api.sendMessage("❌ | اكتب البرومبت بعد الأمر.", event.threadID, event.messageID);
    if (newPrompt.length > 1000) return api.sendMessage("❌ | البرومبت طويل جدًا.", event.threadID, event.messageID);
    if (savePrompt(newPrompt)) {
      currentPrompt = newPrompt;
      mistralHistory[event.senderID] = [];
      return api.sendMessage("✅ | تم تحديث شخصية لونا.", event.threadID, event.messageID);
    }
    return api.sendMessage("❌ | خطأ أثناء الحفظ.", event.threadID, event.messageID);
  }

  if (args[0]?.toLowerCase() === "تعيين") {
    mistralHistory[event.senderID] = [];
    return api.sendMessage("✅ | تم مسح المحادثة.", event.threadID, event.messageID);
  }
  return null;
}

module.exports.run = async function ({ api, event, args, Users }) {
  const { threadID, messageID, senderID } = event;
  const query = args.join(" ");

  if (!args[0]) return api.sendMessage("⚠️ | اكتب سؤالك بعد الأمر.", threadID, messageID);
  
  // Handle special commands
  const special = handleSpecialCommands({ args, event, api });
  if (special) return;

  if (query.length > 1250) return api.sendMessage("❌ | النص طويل جدًا.", threadID, messageID);
  if (["من انت", "ما اسمك", "من صنعك", "مطورك"].some(k => query.includes(k)))
    return api.sendMessage("أنا لونا، مجرد عقل ذكي يساعدك", threadID, messageID);

  api.sendMessage("⌛ | جاري البحث عن إجابة، انتظر من فضلك...", threadID, messageID);

  try {
    api.setMessageReaction("⌛", messageID, () => { }, true);
    const response = await generateResponse(senderID, query);
    api.sendMessage(`＊/ ${response}`, threadID, messageID);
    api.setMessageReaction("✅", messageID, () => { }, true);
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage("❌ | حدث خطأ أثناء جلب البيانات. يرجى المحاولة لاحقًا.", threadID, messageID);
  }
};

module.exports.onMessage = async ({ event, api }) => {
  if (!event.body) return;
  if (event.body.toLowerCase().includes("لونا")) {
    try {
      const response = await generateResponse(event.senderID, event.body);
      return api.sendMessage(`＊/ ${response}`, event.threadID, event.messageID);
    } catch (error) {
      console.error('Error:', error);
    }
  }
};

module.exports.onReply = async ({ event, api, Reply }) => {
  if (event.senderID !== Reply.author) return;
  
  try {
    const response = await generateResponse(event.senderID, event.body);
    return api.sendMessage(`＊/ ${response}`, event.threadID, event.messageID);
  } catch (error) {
    console.error('Error:', error);
    return api.sendMessage("❌ | الخادم مشغول، حاول لاحقًا.", event.threadID, event.messageID);
  }
};
