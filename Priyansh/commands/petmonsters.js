module.exports.config = {
    name: "وحوشي",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Lona",
    description: "لعبة تربية وحوش: تسجيل، متجر، حقيبة، إطعام، قتال",
    commandCategory: "العاب",
    usages: "-تسجيل / -اختيار / -ملفي / -متجر / -حقيبة / -اطعم <غذاء> / -قتال / -قائمة",
    cooldowns: 2,
    dependencies: {
        "fs-extra": "",
        "path": ""
    }
};

/* =============== تهيئة البيانات =============== */
module.exports.onLoad = () => {
    const { existsSync, writeFileSync, mkdirsSync } = global.nodemodule["fs-extra"];
    const { join } = global.nodemodule["path"];
    const dir = join(__dirname, "cache");
    const pathData = join(dir, "petmonsters.json");
    if (!existsSync(dir)) mkdirsSync(dir);
    if (!existsSync(pathData)) writeFileSync(pathData, "[]", "utf-8");
};

/* =============== كتالوج ثابت =============== */
const STARTERS = [
    { id: "firedog",  name: "الكلب الناري",   type: "نار",   maxHp: 120, atk: 18, def: 8,  skill: "نفث النار" },
    { id: "watercroc",name: "التمساح المائي", type: "ماء",   maxHp: 130, atk: 15, def: 10, skill: "رش الماء" },
    { id: "earthbear",name: "الدب الترابي",   type: "أرض",   maxHp: 140, atk: 14, def: 12, skill: "زلزال" }
];

const SHOP = {
    food: [
        { key: "سمكة",  price: 100, hp: 20, exp: 6 },
        { key: "خبز",   price: 80,  hp: 12, exp: 4 },
        { key: "فاكهة", price: 120, hp: 24, exp: 7 }
    ],
    weapons: [
        { key: "سيف خشبي", price: 200, atk: 4 },
        { key: "سيف حديد", price: 500, atk: 9 }
    ],
    armors: [
        { key: "درع جلدي", price: 180, def: 4 },
        { key: "درع حديد", price: 480, def: 8 }
    ]
};

/* =============== أدوات مساعدة =============== */
const { readFileSync, writeFileSync } = (global.nodemodule || require)("fs-extra");
const { join } = (global.nodemodule || require)("path");
const PATH = join(__dirname, "cache", "petmonsters.json");

function loadDB() {
    try { return JSON.parse(readFileSync(PATH, "utf-8")); } catch { return []; }
}
function saveDB(db) { writeFileSync(PATH, JSON.stringify(db, null, 2), "utf-8"); }
function findPlayer(db, uid) { return db.find(u => u.uid === uid); }
function createPlayer(uid, name) {
    return {
        uid, name,
        monster: null, // يعين عند الاختيار
        level: 1,
        exp: 0,
        wallet: 0, // يُستخدم فقط إذا Currencies غير موجود
        inventory: { food: {}, weapon: null, armor: null }
    };
}
function neededExp(level) { return 50 + (level - 1) * 25; }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

async function getCoins(Currencies, uid, fallback) {
    if (Currencies && Currencies.getData) {
        try { return (await Currencies.getData(uid)).money || 0; } catch { return fallback; }
    }
    return fallback;
}
async function addCoins(Currencies, uid, amount, player, db) {
    if (amount <= 0) return;
    if (Currencies && Currencies.increaseMoney) {
        await Currencies.increaseMoney(uid, amount);
    } else {
        player.wallet += amount; saveDB(db);
    }
}
async function subCoins(Currencies, uid, amount, player, db) {
    if (amount <= 0) return true;
    if (Currencies && Currencies.decreaseMoney) {
        const have = await getCoins(Currencies, uid, player.wallet);
        if (have < amount) return false;
        await Currencies.decreaseMoney(uid, amount);
        return true;
    } else {
        if (player.wallet < amount) return false;
        player.wallet -= amount; saveDB(db);
        return true;
    }
}

/* =============== رسالة تعليمات =============== */
function helpText(prefix = "وحوشي") {
return `🧩 طريقة الاستخدام:

${prefix} -تسجيل
↳ تسجيلك كلاعب جديد (لو كنت مسجل راح يقولك).

${prefix} -اختيار
↳ اختيار وحش البداية (يظهر لك 3 خيارات).

${prefix} -ملفي
↳ يعرض ملفك: المستوى/الخبرة/الوحش/العتاد/الرصيد.

${prefix} -متجر
↳ متجر فيه: طعام / أسلحة / دروع. الشراء بالرد برقم.

${prefix} -حقيبة
↳ يعرض محتويات حقيبتك (الأطعمة والعتاد).

${prefix} -اطعم <سمكة|خبز|فاكهة>
↳ يطعم وحشك ويرفع HP+EXP (يستهلك من حقيبتك).

${prefix} -قتال
↳ قتال ضد وحش بري عشوائي. تربح عملات وخبرة عند الفوز.

${prefix} -قائمة
↳ عرض أنواع الوحوش ومهاراتها.`;
}

/* =============== المنطق الرئيسي =============== */
module.exports.run = async function({ api, event, args, Currencies, Users }) {
    const { threadID, messageID, senderID } = event;
    const db = loadDB();
    let player = findPlayer(db, senderID);
    const username = (global.data?.userName?.get(senderID)) || (Users && await Users.getNameUser?.(senderID)) || "لاعب";

    // تعليمات عند الاستخدام الخاطئ أو بدون وسيطات
    const sendHelp = () => api.sendMessage(helpText("وحوشي"), threadID, messageID);

    if (!args[0]) return sendHelp();

    switch (args[0]) {
        /* --- التسجيل --- */
        case "-تسجيل": {
            if (player) return api.sendMessage("✅ أنت مسجّل مسبقًا! استخدم: وحوشي -اختيار لاختيار وحش البداية (لو ما اخترت بعد).", threadID, messageID);
            player = createPlayer(senderID, username);
            db.push(player); saveDB(db);
            return api.sendMessage("🎉 تم تسجيلك! الآن استخدم: وحوشي -اختيار لاختيار وحش البداية.", threadID, messageID);
        }

        /* --- اختيار وحش البداية --- */
        case "-اختيار": {
            if (!player) return api.sendMessage("⚠️ سجّل أولًا: وحوشي -تسجيل", threadID, messageID);
            if (player.monster) return api.sendMessage("✅ لديك وحش بالفعل. استخدم: وحوشي -ملفي لعرض معلوماتك.", threadID, messageID);

            let list = "اختر وحش البداية بالرد على الرسالة برقم:\n";
            STARTERS.forEach((m, i) => {
                list += `\n${i+1}. ${m.name} • النوع: ${m.type}\nHP: ${m.maxHp} | ATK: ${m.atk} | DEF: ${m.def}\nمهارة: ${m.skill}\n`;
            });
            return api.sendMessage(list, threadID, (e, info) => {
                if (e) return;
                global.client.handleReply.push({
                    name: module.exports.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    type: "chooseStarter"
                });
            }, messageID);
        }

        /* --- ملف اللاعب --- */
        case "-ملفي": {
            if (!player) return api.sendMessage("⚠️ غير مسجل. استخدم: وحوشي -تسجيل", threadID, messageID);
            const coins = await getCoins(Currencies, senderID, player.wallet);
            const mon = player.monster ? player.monster : { name: "—", type: "—", hp: 0, maxHp: 0, atk: 0, def: 0, skill: "—" };
            const weapon = player.inventory.weapon ? `🗡 ${player.inventory.weapon.key} (+${player.inventory.weapon.atk} ATK)` : "لا يوجد";
            const armor  = player.inventory.armor  ? `🛡 ${player.inventory.armor.key} (+${player.inventory.armor.def} DEF)` : "لا يوجد";
            const bagFoods = Object.keys(player.inventory.food).length
                ? Object.entries(player.inventory.food).map(([k,v]) => `${k} ×${v}`).join(", ")
                : "لا يوجد";

            const prof =
`👤 اللاعب: ${player.name}
💰 الرصيد: ${coins}
⭐ المستوى: ${player.level} | 🔸 الخبرة: ${player.exp}/${neededExp(player.level)}

🐲 الوحش: ${mon.name} (${mon.type})
❤️ HP: ${mon.hp || 0}/${mon.maxHp} | ⚔ ATK: ${mon.atk} | 🛡 DEF: ${mon.def}
✨ المهارة: ${mon.skill}

🎒 الحقيبة:
• أطعمة: ${bagFoods}
• سلاح: ${weapon}
• درع: ${armor}`;

            return api.sendMessage(prof, threadID, messageID);
        }

        /* --- قائمة الوحوش التعريفية --- */
        case "-قائمة": {
            let txt = "📜 أنواع الوحوش:\n";
            txt += "1) نار: هجوم عالي، دفاع أقل.\n";
            txt += "2) ماء: توازن جيد.\n";
            txt += "3) أرض: نقاط حياة ودفاع أعلى.\n";
            txt += "\nاستخدم: وحوشي -اختيار لاختيار وحشك الأول.";
            return api.sendMessage(txt, threadID, messageID);
        }

        /* --- متجر --- */
        case "-متجر": {
            if (!player) return api.sendMessage("⚠️ سجّل أولًا: وحوشي -تسجيل", threadID, messageID);
            const txt =
`🛒 متجر الوحوش - اختر القسم بالرد برقم:
1) طعام
2) أسلحة
3) دروع`;
            return api.sendMessage(txt, threadID, (e, info) => {
                if (e) return;
                global.client.handleReply.push({
                    name: module.exports.config.name,
                    messageID: info.messageID,
                    author: senderID,
                    type: "shopRoot"
                });
            }, messageID);
        }

        /* --- حقيبة --- */
        case "-حقيبة": {
            if (!player) return api.sendMessage("⚠️ سجّل أولًا: وحوشي -تسجيل", threadID, messageID);
            const foods = Object.keys(player.inventory.food).length
                ? Object.entries(player.inventory.food).map(([k,v]) => `• ${k}: ×${v}`).join("\n")
                : "لا توجد أطعمة";
            const weapon = player.inventory.weapon ? `🗡 ${player.inventory.weapon.key} (+${player.inventory.weapon.atk} ATK)` : "لا يوجد";
            const armor  = player.inventory.armor  ? `🛡 ${player.inventory.armor.key} (+${player.inventory.armor.def} DEF)` : "لا يوجد";
            return api.sendMessage(`🎒 حقيبتك:\n${foods}\n\nسلاحك: ${weapon}\nدرعك: ${armor}`, threadID, messageID);
        }

        /* --- إطعام --- */
        case "-اطعم": {
            if (!player) return api.sendMessage("⚠️ سجّل أولًا: وحوشي -تسجيل", threadID, messageID);
            if (!player.monster) return api.sendMessage("⚠️ اختر وحشًا أولًا: وحوشي -اختيار", threadID, messageID);
            const foodName = (args[1] || "").trim();
            if (!foodName) return api.sendMessage("استخدم: وحوشي -اطعم <سمكة|خبز|فاكهة>", threadID, messageID);
            const have = player.inventory.food[foodName] || 0;
            if (!have) return api.sendMessage(`❌ ما عندك ${foodName} في الحقيبة. اشترِ من: وحوشي -متجر`, threadID, messageID);
            const foodDef = SHOP.food.find(f => f.key === foodName);
            if (!foodDef) return api.sendMessage("❌ نوع الطعام غير معروف.", threadID, messageID);

            player.inventory.food[foodName] = have - 1;
            player.monster.hp = clamp((player.monster.hp || player.monster.maxHp) + foodDef.hp, 0, player.monster.maxHp);
            player.exp += foodDef.exp;

            // لفلات
            while (player.exp >= neededExp(player.level)) {
                player.exp -= neededExp(player.level);
                player.level += 1;
                // تحسينات بسيطة مع كل لفل
                player.monster.maxHp += 6; player.monster.hp = player.monster.maxHp;
                player.monster.atk += 2; player.monster.def += 1;
            }
            saveDB(db);
            return api.sendMessage(`🍽️ تم إطعام ${foodName}.\nHP الحالي: ${player.monster.hp}/${player.monster.maxHp}\nالخبرة: ${player.exp}/${neededExp(player.level)} (المستوى ${player.level})`, threadID, messageID);
        }

        /* --- قتال --- */
        case "-قتال": {
            if (!player) return api.sendMessage("⚠️ سجّل أولًا: وحوشي -تسجيل", threadID, messageID);
            if (!player.monster) return api.sendMessage("⚠️ اختر وحشًا أولًا: وحوشي -اختيار", threadID, messageID);

            // توليد وحش بري بسيط حسب مستوى اللاعب
            const wildLvl = Math.max(1, player.level + (Math.random() < 0.5 ? 0 : 1));
            const wild = {
                name: "وحش بري",
                maxHp: 90 + 8 * wildLvl,
                hp: 90 + 8 * wildLvl,
                atk: 12 + 3 * wildLvl,
                def: 6 + 2 * wildLvl
            };

            // قوة اللاعب مع العتاد
            const wAtk = player.inventory.weapon?.atk || 0;
            const aDef = player.inventory.armor?.def || 0;
            const p = {
                hp: player.monster.hp || player.monster.maxHp,
                atk: player.monster.atk + wAtk,
                def: player.monster.def + aDef
            };

            // جولات مبسطة
            let log = "⚔️ بدأ القتال!\n";
            let rounds = 0;
            while (p.hp > 0 && wild.hp > 0 && rounds < 30) {
                rounds++;
                const pDmg = Math.max(1, Math.floor(p.atk * (0.8 + Math.random()*0.4)) - Math.floor(wild.def * (0.5 + Math.random()*0.3)));
                wild.hp = Math.max(0, wild.hp - pDmg);
                log += `\n🫵 وحشك ضرب العدو: -${pDmg} (HP الوحش البري: ${wild.hp})`;
                if (wild.hp <= 0) break;

                const wDmg = Math.max(1, Math.floor(wild.atk * (0.8 + Math.random()*0.4)) - Math.floor(p.def * (0.5 + Math.random()*0.3)));
                p.hp = Math.max(0, p.hp - wDmg);
                log += `\n👾 العدو ضرب وحشك: -${wDmg} (HP وحشك: ${p.hp})`;
            }

            let resultText = "";
            if (p.hp > 0 && wild.hp <= 0) {
                const rewardCoins = 100 + 20 * player.level;
                const rewardExp = 15 + 5 * player.level;
                await addCoins(Currencies, senderID, rewardCoins, player, db);
                player.exp += rewardExp;
                // لفل أب؟
                let ups = 0;
                while (player.exp >= neededExp(player.level)) {
                    player.exp -= neededExp(player.level);
                    player.level += 1; ups++;
                    player.monster.maxHp += 6; player.monster.atk += 2; player.monster.def += 1;
                }
                player.monster.hp = p.hp; // حفظ HP بعد القتال
                saveDB(db);
                resultText = `\n\n🏆 فزت!\n+${rewardCoins} عملة | +${rewardExp} خبرة` + (ups ? `\n⬆️ ارتفعت للمستوى ${player.level}!` : "");
            } else if (wild.hp > 0 && p.hp <= 0) {
                // هزيمة
                player.monster.hp = Math.max(1, Math.floor(player.monster.maxHp * 0.25)); // يفيق بربع HP
                saveDB(db);
                resultText = `\n\n💀 خسرت القتال. تم إنعاش وحشك بـ ${player.monster.hp}/${player.monster.maxHp} HP.`;
            } else {
                player.monster.hp = p.hp;
                saveDB(db);
                resultText = `\n\n⏳ انتهت الجولات بدون حسم.`;
            }

            return api.sendMessage(`${log}${resultText}`, threadID, messageID);
        }

        default:
            return sendHelp();
    }
};

/* =============== الردود التفاعلية =============== */
module.exports.handleReply = async function({ api, event, handleReply, Currencies, Users }) {
    const { threadID, messageID, senderID, body } = event;
    if (String(handleReply.author) !== String(senderID)) return;

    const db = loadDB();
    const player = findPlayer(db, senderID);
    if (!player) return api.sendMessage("⚠️ غير مسجل. استخدم: وحوشي -تسجيل", threadID, messageID);

    switch (handleReply.type) {
        // اختيار وحش البداية
        case "chooseStarter": {
            const idx = parseInt(body);
            if (isNaN(idx) || idx < 1 || idx > STARTERS.length)
                return api.sendMessage("❌ اختر رقم صحيح من القائمة.", threadID, messageID);
            const base = STARTERS[idx-1];
            player.monster = {
                id: base.id, name: base.name, type: base.type,
                maxHp: base.maxHp, hp: base.maxHp,
                atk: base.atk, def: base.def, skill: base.skill
            };
            saveDB(db);
            api.unsendMessage(handleReply.messageID);
            return api.sendMessage(`✅ تم اختيار: ${base.name} • المهارة: ${base.skill}\nاستخدم: وحوشي -ملفي`, threadID, messageID);
        }

        // جذع المتجر
        case "shopRoot": {
            if (body === "1" || body === "٢" || body.toLowerCase() === "طعام") {
                let t = "🍖 الأطعمة (رد برقم للشراء):\n";
                SHOP.food.forEach((f,i)=> t += `${i+1}) ${f.key} - ${f.price}$ (HP+${f.hp}, EXP+${f.exp})\n`);
                return api.sendMessage(t, threadID, (e, info)=>{
                    if (e) return;
                    global.client.handleReply.push({
                        name: module.exports.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "shopFood"
                    });
                }, messageID);
            }
            if (body === "2" || body === "٢" || body.toLowerCase() === "أسلحة") {
                let t = "⚔️ الأسلحة (رد برقم للشراء):\n";
                SHOP.weapons.forEach((w,i)=> t += `${i+1}) ${w.key} - ${w.price}$ (ATK+${w.atk})\n`);
                return api.sendMessage(t, threadID, (e, info)=>{
                    if (e) return;
                    global.client.handleReply.push({
                        name: module.exports.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "shopWeapons"
                    });
                }, messageID);
            }
            if (body === "3" || body === "٣" || body.toLowerCase() === "دروع") {
                let t = "🛡️ الدروع (رد برقم للشراء):\n";
                SHOP.armors.forEach((a,i)=> t += `${i+1}) ${a.key} - ${a.price}$ (DEF+${a.def})\n`);
                return api.sendMessage(t, threadID, (e, info)=>{
                    if (e) return;
                    global.client.handleReply.push({
                        name: module.exports.config.name,
                        messageID: info.messageID,
                        author: senderID,
                        type: "shopArmors"
                    });
                }, messageID);
            }
            return api.sendMessage("❌ اختيار غير صحيح. اكتب: وحوشي -متجر من جديد.", threadID, messageID);
        }

        // شراء طعام
        case "shopFood": {
            const idx = parseInt(body);
            if (isNaN(idx) || idx < 1 || idx > SHOP.food.length)
                return api.sendMessage("❌ رقم غير صحيح.", threadID, messageID);
            const item = SHOP.food[idx-1];
            const ok = await subCoins(Currencies, senderID, item.price, player, db);
            if (!ok) return api.sendMessage("💸 رصيدك غير كافٍ.", threadID, messageID);
            player.inventory.food[item.key] = (player.inventory.food[item.key] || 0) + 1;
            saveDB(db);
            return api.sendMessage(`✅ تم شراء ${item.key}. (HP+${item.hp}, EXP+${item.exp})`, threadID, messageID);
        }

        // شراء سلاح
        case "shopWeapons": {
            const idx = parseInt(body);
            if (isNaN(idx) || idx < 1 || idx > SHOP.weapons.length)
                return api.sendMessage("❌ رقم غير صحيح.", threadID, messageID);
            const item = SHOP.weapons[idx-1];
            const ok = await subCoins(Currencies, senderID, item.price, player, db);
            if (!ok) return api.sendMessage("💸 رصيدك غير كافٍ.", threadID, messageID);
            player.inventory.weapon = { key: item.key, atk: item.atk };
            saveDB(db);
            return api.sendMessage(`✅ تم شراء السلاح: ${item.key} (+${item.atk} ATK)`, threadID, messageID);
        }

        // شراء درع
        case "shopArmors": {
            const idx = parseInt(body);
            if (isNaN(idx) || idx < 1 || idx > SHOP.armors.length)
                return api.sendMessage("❌ رقم غير صحيح.", threadID, messageID);
            const item = SHOP.armors[idx-1];
            const ok = await subCoins(Currencies, senderID, item.price, player, db);
            if (!ok) return api.sendMessage("💸 رصيدك غير كافٍ.", threadID, messageID);
            player.inventory.armor = { key: item.key, def: item.def };
            saveDB(db);
            return api.sendMessage(`✅ تم شراء الدرع: ${item.key} (+${item.def} DEF)`, threadID, messageID);
        }
    }
};
