module.exports.config = {
    name: "كوماند",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Priyansh Rajput",
    description: "إدارة/التحكم في كل أوامر البوت",
    commandCategory: "النظام",
    usages: "[load/unload/loadAll/unloadAll/info] [اسم الأمر]",
    cooldowns: 2,
    dependencies: {
        "fs-extra": "",
        "child_process": "",
        "path": ""
    }
};

const loadCommand = function ({ moduleList, threadID, messageID }) {

    const { execSync } = global.nodemodule['child_process'];
    const { writeFileSync, unlinkSync, readFileSync } = global.nodemodule['fs-extra'];
    const { join } = global.nodemodule['path'];
    const { configPath, mainPath, api } = global.client;
    const logger = require(mainPath + '/utils/log');

    var errorList = [];
    delete require['resolve'][require['resolve'](configPath)];
    var configValue = require(configPath);
    writeFileSync(configPath + '.temp', JSON.stringify(configValue, null, 2), 'utf8');
    for (const nameModule of moduleList) {
        try {
            const dirModule = __dirname + '/' + nameModule + '.js';
            delete require['cache'][require['resolve'](dirModule)];
            const command = require(dirModule);
            global.client.commands.delete(nameModule);
            if (!command.config || !command.run || !command.config.commandCategory) 
                throw new Error('[ CMD ] - الأمر غير مُهيأ بشكل صحيح!');
            global.client['eventRegistered'] = global.client['eventRegistered']['filter'](info => info != command.config.name);
            if (command.config.dependencies && typeof command.config.dependencies == 'object') {
                const listPackage = JSON.parse(readFileSync('./package.json')).dependencies,
                    listbuiltinModules = require('module')['builtinModules'];
                for (const packageName in command.config.dependencies) {
                    var tryLoadCount = 0,
                        loadSuccess = false,
                        error;
                    const moduleDir = join(global.client.mainPath, 'nodemodules', 'node_modules', packageName);
                    try {
                        if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName)) global.nodemodule[packageName] = require(packageName);
                        else global.nodemodule[packageName] = require(moduleDir);
                    } catch {
                        logger.loader('[ CMD ] - الحزمة غير موجودة ' + packageName + ' الداعمة للأمر ' + command.config.name + ' جارِ تثبيتها...', 'warn');
                        const insPack = {};
                        insPack.stdio = 'inherit';
                        insPack.env = process.env ;
                        insPack.shell = true;
                        insPack.cwd = join(global.client.mainPath,'nodemodules')
                        execSync('npm --package-lock false --save install ' + packageName + (command.config.dependencies[packageName] == '*' || command.config.dependencies[packageName] == '' ? '' : '@' + command.config.dependencies[packageName]), insPack);
                        for (tryLoadCount = 1; tryLoadCount <= 3; tryLoadCount++) {
                            require['cache'] = {};
                            try {
                                if (listPackage.hasOwnProperty(packageName) || listbuiltinModules.includes(packageName)) global.nodemodule[packageName] = require(packageName);
                                else global.nodemodule[packageName] = require(moduleDir);
                                loadSuccess = true;
                                break;
                            } catch (erorr) {
                                error = erorr;
                            }
                            if (loadSuccess || !error) break;
                        }
                        if (!loadSuccess || error) throw 'تعذر تحميل الحزمة ' + packageName + (' للأمر ') + command.config.name +', الخطأ: ' + error + ' ' + error['stack'];
                    }
                }
                logger.loader('[ CMD ] - تم تحميل جميع الحزم المطلوبة للأمر ' + command.config.name);
            }
            if (command.config.envConfig && typeof command.config.envConfig == 'Object') try {
                for (const [key, value] of Object['entries'](command.config.envConfig)) {
                    if (typeof global.configModule[command.config.name] == undefined) 
                        global.configModule[command.config.name] = {};
                    if (typeof configValue[command.config.name] == undefined) 
                        configValue[command.config.name] = {};
                    if (typeof configValue[command.config.name][key] !== undefined) 
                        global.configModule[command.config.name][key] = configValue[command.config.name][key];
                    else global.configModule[command.config.name][key] = value || '';
                    if (typeof configValue[command.config.name][key] == undefined) 
                        configValue[command.config.name][key] = value || '';
                }
                logger.loader('تم تحميل إعدادات الأمر ' + command.config.name);
            } catch (error) {
                throw new Error('[ CMD ] » لم يتمكن من تحميل إعدادات الأمر، الخطأ: ' + JSON.stringify(error));
            }
            if (command['onLoad']) try {
                const onLoads = {};
                onLoads['configValue'] = configValue;
                command['onLoad'](onLoads);
            } catch (error) {
                throw new Error('[ CMD ] » لم يتمكن من تشغيل onLoad للأمر، الخطأ: ' + JSON.stringify(error), 'error');
            }
            if (command.handleEvent) global.client.eventRegistered.push(command.config.name);
            (global.config.commandDisabled.includes(nameModule + '.js') || configValue.commandDisabled.includes(nameModule + '.js')) 
            && (configValue.commandDisabled.splice(configValue.commandDisabled.indexOf(nameModule + '.js'), 1),
            global.config.commandDisabled.splice(global.config.commandDisabled.indexOf(nameModule + '.js'), 1))
            global.client.commands.set(command.config.name, command)
            logger.loader('تم تحميل الأمر ' + command.config.name + '!');
        } catch (error) {
            errorList.push('- ' + nameModule + ' السبب:' + error + ' في ' + error['stack']);
        };
    }
    if (errorList.length != 0) api.sendMessage('[ CMD ] » الأوامر التي فشلت عند التحميل: ' + errorList.join(' '), threadID, messageID);
    api.sendMessage('[ CMD ] » تم تحميل ' + (moduleList.length - errorList.length) +' أمر بنجاح ♻️\n━━━━━━━━━━━━━━━\n[ تم التحميل ] » الأوامر ('+moduleList.join(', ') + '.js) 💓', threadID, messageID) 
    writeFileSync(configPath, JSON.stringify(configValue, null, 4), 'utf8')
    unlinkSync(configPath + '.temp');
    return;
}

const unloadModule = function ({ moduleList, threadID, messageID }) {
    const { writeFileSync, unlinkSync } = global.nodemodule["fs-extra"];
    const { configPath, mainPath, api } = global.client;
    const logger = require(mainPath + "/utils/log").loader;

    delete require.cache[require.resolve(configPath)];
    var configValue = require(configPath);
    writeFileSync(configPath + ".temp", JSON.stringify(configValue, null, 4), 'utf8');

    for (const nameModule of moduleList) {
        global.client.commands.delete(nameModule);
        global.client.eventRegistered = global.client.eventRegistered.filter(item => item !== nameModule);
        configValue["commandDisabled"].push(`${nameModule}.js`);
        global.config["commandDisabled"].push(`${nameModule}.js`);
        logger(`تم إلغاء تحميل الأمر ${nameModule}!`);
    }

    writeFileSync(configPath, JSON.stringify(configValue, null, 4), 'utf8');
    unlinkSync(configPath + ".temp");

    return api.sendMessage(`[ CMD ] » تم إلغاء ${moduleList.length} أمر ✨`, threadID, messageID);
}

module.exports.run = function ({ event, args, api }) {
  
    if (event.senderID != 100087632392287) return api.sendMessage(`[ CMD ] » ليس لديك صلاحية استخدام هذا الأمر 😏`, event.threadID, event.messageID)
    
    const { readdirSync } = global.nodemodule["fs-extra"];
    const { threadID, messageID } = event;

    var moduleList = args.splice(1, args.length);

    switch (args[0]) {
      case "count": {
      let commands = client.commands.values();
		  let infoCommand = "";
			api.sendMessage("[ CMD ] - يوجد حالياً " + client.commands.size + " أمر قابل للاستخدام 💌"+ infoCommand, event.threadID, event.messageID);
      break;
		}
        case "load": {
            if (moduleList.length == 0) return api.sendMessage("[ CMD ] » اسم الأمر لا يمكن أن يكون فارغ ⚠️", threadID, messageID);
            else return loadCommand({ moduleList, threadID, messageID });
        }
        case "unload": {
            if (moduleList.length == 0) return api.sendMessage("[ CMD ] » اسم الأمر لا يمكن أن يكون فارغ ⚠️", threadID, messageID);
            else return unloadModule({ moduleList, threadID, messageID });
        }
        case "loadAll": {
            moduleList = readdirSync(__dirname).filter((file) => file.endsWith(".js") && !file.includes('example'));
            moduleList = moduleList.map(item => item.replace(/\.js/g, ""));
            return loadCommand({ moduleList, threadID, messageID });
        }
        case "unloadAll": {
            moduleList = readdirSync(__dirname).filter((file) => file.endsWith(".js") && !file.includes('example') && !file.includes("command"));
            moduleList = moduleList.map(item => item.replace(/\.js/g, ""));
            return unloadModule({ moduleList, threadID, messageID });
        }
        case "info": {
            const command = global.client.commands.get(moduleList.join("") || "");

            if (!command) return api.sendMessage("[ CMD ] » الأمر الذي أدخلته غير موجود ⚠️", threadID, messageID);

            const { name, version, hasPermssion, credits, cooldowns, dependencies } = command.config;

            return api.sendMessage(
                "====== " + name.toUpperCase() + " ======\n" +
                "- صانع الأمر: " + credits + "\n" +
                "- الإصدار: " + version + "\n" +
                "- مستوى الصلاحية المطلوب: " + ((hasPermssion == 0) ? "مستخدم" : (hasPermssion == 1) ? "أدمن" : "دعم") + "\n" +
                "- وقت الانتظار: " + cooldowns + " ثانية/ثواني\n" +
                `- الحزم المطلوبة: ${Object.keys(dependencies).join(", ") || "بدون"}`,
                threadID, messageID
            );
        }
        default: {
            return global.utils.throwError(this.config.name, threadID, messageID);
        }
    }
}
