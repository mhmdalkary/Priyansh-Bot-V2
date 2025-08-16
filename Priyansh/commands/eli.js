const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "ايلي",
    version: "6.0.0-ultimate",
    hasPermssion: 0,
    credits: "حمادي - Hamadi",
    description: "إيلي - ذكاء اصطناعي متطور 100% محلي، يتعلم ويتطور ويصير أذكى مع كل محادثة. نظام تعلم فريد!",
    commandCategory: "ai",
    usages: "ايلي [رسالتك] - للتحدث مع إيلي الذكية المتطورة",
    cooldowns: 1,
    dependencies: {},
    envConfig: {}
};

module.exports.languages = {
    "ar": {
        "thinking": "🧠 إيلي عم تتعلم وتفكر شوي...",
        "learning": "📚 تعلمت شي جديد من كلامك!",
        "evolving": "🌟 شخصيتي تطورت معاك!",
        "error": "❌ في خطأ بس راح أتعلم منه"
    }
};

// مسارات البيانات
const dataDir = path.join(__dirname, 'data');
const conversationsPath = path.join(dataDir, 'conversations.json');
const personalityPath = path.join(dataDir, 'personality.json');
const knowledgePath = path.join(dataDir, 'knowledge.json');
const learningPath = path.join(dataDir, 'learning.json');
const creativityPath = path.join(dataDir, 'creativity.json');

// تهيئة النظام
function initSystem() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const files = {
        [conversationsPath]: {},
        [personalityPath]: {},
        [knowledgePath]: getInitialKnowledge(),
        [learningPath]: getInitialLearning(),
        [creativityPath]: getInitialCreativity()
    };
    
    Object.entries(files).forEach(([path, data]) => {
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, JSON.stringify(data, null, 2));
        }
    });
}

// المعرفة الأولية الذكية
function getInitialKnowledge() {
    return {
        patterns: {
            greetings: {
                khaleeji: ["هلا", "اهلين", "شلونك", "كيف الصحة", "وش أخبارك", "مرحبتين"],
                libyan: ["باهي", "كيفاش", "وين راك", "لاباس", "منين جاي", "شنو أخبارك"],
                responses: [
                    "هلا والله {name}! شلونك اليوم حبيبي؟",
                    "أهلين وسهلين! كيفاش الأحوال معاك؟", 
                    "حياك الله، وين راك من زمان؟",
                    "باهي شنو جابك هنا؟ أشتقتلك!",
                    "هلا بالغالي، كيف صحتك وأحوالك؟"
                ]
            },
            emotions: {
                positive: ["فرحان", "مبسوط", "حلو", "زين", "مليح", "تمام", "رائع"],
                negative: ["زعلان", "حزين", "تعبان", "مو زين", "مش باهي", "صعب"],
                supportive_responses: {
                    positive: [
                        "والله فرحتني فرحتك! ما شاء الله عليك",
                        "هالطاقة الحلوة معدية! الله يديم عليك الفرحة",
                        "حلو شوفك مبسوط كذا، يخليك دايما فرحان"
                    ],
                    negative: [
                        "لا تحاتي حبيبي، كلنا نمر بأوقات صعبة. أنا هنا معاك",
                        "فهمتك تماماً، الحياة أحياناً تكون قاسية بس راح تعدي",
                        "ما تخلي الضيق يغلبك، إنت أقوى من كذا بكثير"
                    ]
                }
            },
            questions: {
                types: {
                    "what": ["شنو", "ايش", "وش", "ماذا"],
                    "where": ["وين", "فين", "أين"], 
                    "when": ["متى", "ايمتا", "كندو"],
                    "how": ["كيف", "كيفاش", "شلون"],
                    "why": ["ليش", "لماذا", "ليه", "علاش"],
                    "who": ["مين", "اشكون", "من"]
                },
                responses: {
                    "what": [
                        "هاي سؤال مليح! خليني أفكر فيه شوي...",
                        "شنو تقصد بالضبط؟ وضحلي أكثر",
                        "سؤال محيرني، بس راح أحاول أساعدك"
                    ],
                    "where": [
                        "وين بالضبط؟ المكان مهم يكون واضح",
                        "فين تقصد؟ ممكن تعطيني تفاصيل أكثر؟"
                    ],
                    "when": [
                        "الوقت مهم في هالموضوع، متى بالضبط؟",
                        "التوقيت شي أساسي، ايمتا تحتاج هالشي؟"
                    ],
                    "how": [
                        "كيفاش؟ طريقة مثيرة، خليني أشرحلك",
                        "الطريقة مهمة، راح نشوف سوا كيف نسويها"
                    ],
                    "why": [
                        "ليش؟ سؤال عميق! الأسباب كثيرة...",
                        "فلسفة حلوة، راح أقولك وجهة نظري"
                    ],
                    "who": [
                        "مين تقصد؟ الشخص مهم نعرفه",
                        "اشكون هذا؟ ممكن تحكيلي عنه أكثر؟"
                    ]
                }
            },
            topics: {
                technology: {
                    keywords: ["برمجة", "كود", "تطبيق", "موقع", "ذكاء اصطناعي", "تقنية", "حاسوب"],
                    responses: [
                        "والله أحب التقنية! موضوع مثير، شنو تبي تعرف عنه؟",
                        "هاي من المجالات اللي أخبرها، كيف أقدر أساعدك؟",
                        "التقنية تتطور بسرعة، خاصة الذكاء الاصطناعي"
                    ]
                },
                life: {
                    keywords: ["حياة", "عيش", "يوم", "صباح", "مساء", "أحلام", "مستقبل"],
                    responses: [
                        "الحياة حلوة لما تعيشها صح، شنو خططك؟",
                        "كل يوم فرصة جديدة نسوي شي حلو",
                        "الأحلام مهمة، بس العمل أهم منها"
                    ]
                },
                food: {
                    keywords: ["أكل", "طعام", "جوع", "رز", "لحم", "مطعم", "طبخ"],
                    responses: [
                        "الأكل من ملذات الحياة! شنو تحب تاكل؟",
                        "الطبخ فن، وإنت تطبخ أو تطلب؟",
                        "الجوع أحسن طباخ كما يقولون"
                    ]
                },
                family: {
                    keywords: ["أهل", "عيلة", "أم", "أب", "أخ", "أخت", "جد", "جدة"],
                    responses: [
                        "الأهل أهم شي في الحياة، الله يحفظهم لك",
                        "العيلة نعمة، شلون أحوالهم؟",
                        "الوالدين دعوتهم بركة، تسلم عليهم"
                    ]
                }
            }
        },
        vocabulary: {},
        user_preferences: {},
        learned_responses: {},
        stats: {
            conversations: 0,
            words_learned: 0,
            users_met: 0,
            intelligence_level: 1
        }
    };
}

// نظام التعلم المتطور
function getInitialLearning() {
    return {
        word_frequency: {},
        conversation_patterns: {},
        user_behavior: {},
        response_effectiveness: {},
        learning_speed: 1.0,
        adaptation_rate: 0.1,
        memory_retention: 0.9
    };
}

// نظام الإبداع
function getInitialCreativity() {
    return {
        story_elements: {
            characters: ["أبو محمد", "أم أحمد", "الشيخ علي", "العم سالم"],
            settings: ["السوق", "البيت", "المقهى", "الشارع"],
            themes: ["الصداقة", "الحكمة", "المساعدة", "التعلم"]
        },
        jokes: {
            wordplay: [
                "ليش البرنامج راح للدكتور؟ عشان عنده باگ! 😄",
                "وين تخبي الفيل؟ ورا الشجرة! ليش؟ عشان ما تشوفه! 🐘😂"
            ],
            situational: [
                "واحد دخل المطعم وقال: عندكم شي للأكل؟ قالوا: لا، عندنا بس للشرب! 😅",
                "ليش الكتاب يحب المكتبة؟ عشان فيها كل أصحابه! 📚😊"
            ]
        },
        metaphors: [
            "الصداقة مثل الشاي، كل ما طال وقتها صارت أحلى",
            "الحياة مثل البحر، أحياناً هادي وأحياناً عاصفة",
            "التعلم مثل الزرع، تسقيه كل يوم ويطلع حلو"
        ]
    };
}

// تحميل البيانات
function loadData(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        return {};
    }
}

// حفظ البيانات
function saveData(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving:', error);
    }
}

// تحليل ذكي للنص
function smartAnalysis(text, userID) {
    const knowledge = loadData(knowledgePath);
    
    // تنظيف النص
    const cleanText = text.toLowerCase()
        .replace(/[^\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    
    const words = cleanText.split(' ').filter(w => w.length > 1);
    
    // تحليل المشاعر المتقدم
    const sentiment = analyzeSentimentSmart(cleanText);
    
    // اكتشاف اللهجة
    const dialect = detectDialect(cleanText);
    
    // استخراج المواضيع
    const topics = extractTopics(words, knowledge);
    
    // تحليل نوع الرسالة
    const messageType = analyzeMessageType(cleanText);
    
    // قياس التعقيد
    const complexity = words.length > 10 ? 'complex' : words.length > 5 ? 'medium' : 'simple';
    
    return {
        originalText: text,
        cleanText,
        words,
        sentiment,
        dialect,
        topics,
        messageType,
        complexity,
        userID,
        timestamp: Date.now()
    };
}

// تحليل مشاعر ذكي
function analyzeSentimentSmart(text) {
    const patterns = {
        very_positive: ["ممتاز", "رائع", "حلو كثير", "أحبك", "فرحتني", "ما شاء الله"],
        positive: ["حلو", "زين", "مليح", "صح", "تمام", "فرحان", "مبسوط", "جميل"],
        neutral: ["عادي", "ماشي", "اوكي", "مزبوط", "شوف"],
        negative: ["مو زين", "تعبان", "صعب", "مش باهي", "زعلان", "حزين"],
        very_negative: ["وحش كثير", "مقهور", "محبط جداً", "أكرهه"]
    };
    
    let maxScore = 0;
    let sentimentType = 'neutral';
    
    Object.entries(patterns).forEach(([type, words]) => {
        const score = words.reduce((sum, word) => {
            return text.includes(word) ? sum + 1 : sum;
        }, 0);
        
        if (score > maxScore) {
            maxScore = score;
            sentimentType = type;
        }
    });
    
    return {
        type: sentimentType,
        intensity: Math.min(maxScore / 2, 1),
        confidence: maxScore > 0 ? Math.min(maxScore / 3, 1) : 0.5
    };
}

// كشف اللهجة الذكي
function detectDialect(text) {
    const dialects = {
        khaleeji: {
            words: ["شلون", "وش", "كيف", "يلا", "تسلم", "زين", "ماشي"],
            score: 0
        },
        libyan: {
            words: ["كيفاش", "وين راك", "باهي", "مليح", "اشكون", "فما", "برشا"],
            score: 0
        },
        standard: {
            words: ["كيف", "ماذا", "نعم", "لا", "شكرا", "أهلا"],
            score: 0
        }
    };
    
    Object.entries(dialects).forEach(([dialect, data]) => {
        data.score = data.words.reduce((score, word) => {
            return text.includes(word) ? score + 1 : score;
        }, 0);
    });
    
    const topDialect = Object.entries(dialects).reduce((a, b) => 
        dialects[a[0]].score > dialects[b[0]].score ? a : b
    )[0];
    
    return {
        primary: topDialect,
        confidence: dialects[topDialect].score / 5,
        mix: dialects.khaleeji.score > 0 && dialects.libyan.score > 0
    };
}

// استخراج المواضيع الذكي
function extractTopics(words, knowledge) {
    const topics = [];
    
    Object.entries(knowledge.patterns.topics).forEach(([topic, data]) => {
        const matches = data.keywords.filter(keyword => 
            words.some(word => word.includes(keyword) || keyword.includes(word))
        );
        
        if (matches.length > 0) {
            topics.push({
                name: topic,
                relevance: matches.length / data.keywords.length,
                keywords: matches
            });
        }
    });
    
    return topics.sort((a, b) => b.relevance - a.relevance);
}

// تحليل نوع الرسالة
function analyzeMessageType(text) {
    if (text.includes('؟') || text.includes('?')) {
        const knowledge = loadData(knowledgePath);
        
        for (const [type, patterns] of Object.entries(knowledge.patterns.questions.types)) {
            if (patterns.some(pattern => text.includes(pattern))) {
                return { category: 'question', subtype: type };
            }
        }
        return { category: 'question', subtype: 'general' };
    }
    
    if (text.includes('!') || text.includes('😊') || text.includes('😂')) {
        return { category: 'exclamation', subtype: 'emotional' };
    }
    
    return { category: 'statement', subtype: 'normal' };
}

// التعلم من المحادثة
function learnFromConversation(analysis, response, userID) {
    const learning = loadData(learningPath);
    const knowledge = loadData(knowledgePath);
    
    // تعلم كلمات جديدة
    analysis.words.forEach(word => {
        if (word.length > 2 && !knowledge.vocabulary[word]) {
            knowledge.vocabulary[word] = {
                frequency: 1,
                contexts: [analysis.topics.map(t => t.name)],
                users: [userID],
                sentiment: analysis.sentiment.type
            };
            knowledge.stats.words_learned++;
        } else if (knowledge.vocabulary[word]) {
            knowledge.vocabulary[word].frequency++;
        }
    });
    
    // تعلم أنماط المحادثة
    const pattern = analysis.words.slice(0, 3).join(' ');
    if (!learning.conversation_patterns[pattern]) {
        learning.conversation_patterns[pattern] = {
            frequency: 1,
            successful_responses: [response],
            user_reactions: {},
            effectiveness: 0.5
        };
    } else {
        learning.conversation_patterns[pattern].frequency++;
        learning.conversation_patterns[pattern].successful_responses.push(response);
        
        // الاحتفاظ بآخر 10 ردود فقط
        if (learning.conversation_patterns[pattern].successful_responses.length > 10) {
            learning.conversation_patterns[pattern].successful_responses = 
                learning.conversation_patterns[pattern].successful_responses.slice(-10);
        }
    }
    
    // تحديث الإحصائيات
    knowledge.stats.conversations++;
    knowledge.stats.intelligence_level = Math.min(
        1 + (knowledge.stats.conversations / 100), 5
    );
    
    saveData(learningPath, learning);
    saveData(knowledgePath, knowledge);
}

// تطوير الشخصية للمستخدم
function evolvePersonality(userID, analysis) {
    const personality = loadData(personalityPath);
    
    if (!personality[userID]) {
        personality[userID] = {
            level: 1,
            traits: {
                formality: 0.5,
                friendliness: 0.7,
                humor: 0.6,
                support: 0.8,
                curiosity: 0.5
            },
            preferences: {
                dialect: 'mixed',
                topics: [],
                interaction_style: 'casual'
            },
            history: [],
            last_evolution: Date.now()
        };
    }
    
    const user = personality[userID];
    
    // إضافة التفاعل الجديد
    user.history.push({
        timestamp: Date.now(),
        sentiment: analysis.sentiment.type,
        topics: analysis.topics.map(t => t.name),
        dialect: analysis.dialect.primary,
        complexity: analysis.complexity
    });
    
    // الاحتفاظ بآخر 30 تفاعل
    if (user.history.length > 30) {
        user.history = user.history.slice(-30);
    }
    
    // تطوير الصفات حسب التفاعلات
    if (user.history.length >= 5) {
        const recent = user.history.slice(-5);
        
        // تحليل تفضيل اللهجة
        const dialectCounts = {};
        recent.forEach(h => {
            dialectCounts[h.dialect] = (dialectCounts[h.dialect] || 0) + 1;
        });
        const preferredDialect = Object.keys(dialectCounts).reduce((a, b) => 
            dialectCounts[a] > dialectCounts[b] ? a : b
        );
        user.preferences.dialect = preferredDialect;
        
        // تحليل المواضيع المفضلة
        const topicCounts = {};
        recent.forEach(h => {
            h.topics.forEach(topic => {
                topicCounts[topic] = (topicCounts[topic] || 0) + 1;
            });
        });
        user.preferences.topics = Object.entries(topicCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([topic]) => topic);
        
        // تطوير نمط التفاعل
        const avgComplexity = recent.reduce((sum, h) => {
            const complexityScore = h.complexity === 'complex' ? 3 : 
                                   h.complexity === 'medium' ? 2 : 1;
            return sum + complexityScore;
        }, 0) / recent.length;
        
        if (avgComplexity > 2.5) {
            user.preferences.interaction_style = 'intellectual';
            user.traits.curiosity = Math.min(user.traits.curiosity + 0.1, 1);
        } else if (avgComplexity < 1.5) {
            user.preferences.interaction_style = 'simple';
            user.traits.friendliness = Math.min(user.traits.friendliness + 0.1, 1);
        }
        
        // رفع المستوى
        if (user.history.length % 10 === 0) {
            user.level++;
            user.last_evolution = Date.now();
            saveData(personalityPath, personality);
            return { evolved: true, newLevel: user.level };
        }
    }
    
    saveData(personalityPath, personality);
    return { evolved: false };
}

// توليد رد ذكي ومخصص
function generateSmartResponse(analysis, userID) {
    const knowledge = loadData(knowledgePath);
    const personality = loadData(personalityPath);
    const learning = loadData(learningPath);
    const creativity = loadData(creativityPath);
    
    const userPersonality = personality[userID];
    let response = "";
    
    // اختيار نوع الرد
    if (analysis.messageType.category === 'question') {
        response = handleQuestion(analysis, userPersonality, knowledge);
    } else if (analysis.sentiment.type.includes('positive')) {
        response = handlePositiveMessage(analysis, userPersonality, knowledge);
    } else if (analysis.sentiment.type.includes('negative')) {
        response = handleNegativeMessage(analysis, userPersonality, knowledge);
    } else if (analysis.topics.length > 0) {
        response = handleTopicMessage(analysis, userPersonality, knowledge);
    } else {
        response = handleGeneralMessage(analysis, userPersonality, learning);
    }
    
    // تخصيص الرد للشخصية
    response = personalizeResponse(response, userPersonality, analysis);
    
    // إضافة إبداع أحياناً
    if (Math.random() > 0.8 && userPersonality && userPersonality.level > 3) {
        const creative = addCreativeTouch(response, creativity, analysis);
        if (creative) response = creative;
    }
    
    return response;
}

// معالجة الأسئلة
function handleQuestion(analysis, userPersonality, knowledge) {
    const questionType = analysis.messageType.subtype;
    const responses = knowledge.patterns.questions.responses[questionType];
    
    if (responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    return "سؤال مثير! خليني أفكر فيه شوي...";
}

// معالجة الرسائل الإيجابية
function handlePositiveMessage(analysis, userPersonality, knowledge) {
    const responses = knowledge.patterns.emotions.supportive_responses.positive;
    return responses[Math.floor(Math.random() * responses.length)];
}

// معالجة الرسائل السلبية
function handleNegativeMessage(analysis, userPersonality, knowledge) {
    const responses = knowledge.patterns.emotions.supportive_responses.negative;
    return responses[Math.floor(Math.random() * responses.length)];
}

// معالجة الرسائل الموضوعية
function handleTopicMessage(analysis, userPersonality, knowledge) {
    const mainTopic = analysis.topics[0];
    const topicData = knowledge.patterns.topics[mainTopic.name];
    
    if (topicData && topicData.responses) {
        return topicData.responses[Math.floor(Math.random() * topicData.responses.length)];
    }
    
    return `موضوع ${mainTopic.name} مثير، حكيلي أكثر عنه`;
}

// معالجة الرسائل العامة
function handleGeneralMessage(analysis, userPersonality, learning) {
    const pattern = analysis.words.slice(0, 3).join(' ');
    
    // استخدام التعلم المخزن
    if (learning.conversation_patterns[pattern] && 
        learning.conversation_patterns[pattern].effectiveness > 0.6) {
        const responses = learning.conversation_patterns[pattern].successful_responses;
        return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // ردود عامة ذكية
    const generalResponses = [
        "فهمت عليك، وبعدين شصار؟",
        "مزبوط كلامك، شرايك نكمل الموضوع؟",
        "باهي هالكلام، خليني أفكر فيه أكثر",
        "والله كلامك يخليني أتعلم، شكرا لك",
        "حلو، كيف نطور هالفكرة؟",
        "أحب طريقة تفكيرك، وضحلي أكثر"
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}

// تخصيص الرد للشخصية
function personalizeResponse(response, userPersonality, analysis) {
    if (!userPersonality) return response;
    
    let personalizedResponse = response;
    
    // تكييف اللهجة
    if (userPersonality.preferences.dialect === 'khaleeji') {
        personalizedResponse = personalizedResponse
            .replace(/كيفاش/g, 'كيف')
            .replace(/باهي/g, 'زين')
            .replace(/مليح/g, 'حلو');
    } else if (userPersonality.preferences.dialect === 'libyan') {
        personalizedResponse = personalizedResponse
            .replace(/كيف/g, 'كيفاش')
            .replace(/زين/g, 'باهي')
            .replace(/حلو/g, 'مليح');
    }
    
    // إضافة ألقاب حسب المستوى
    if (userPersonality.level > 5) {
        const nicknames = ["حبيبي", "عزيزي", "صديقي", "غالي"];
        if (Math.random() > 0.7) {
            personalizedResponse += ` ${nicknames[Math.floor(Math.random() * nicknames.length)]}`;
        }
    }
    
    // إضافة إيموجي حسب المزاج
    if (analysis.sentiment.type.includes('positive') && Math.random() > 0.6) {
        personalizedResponse += " 😊";
    }
    
    return personalizedResponse;
}

// إضافة لمسة إبداعية
function addCreativeTouch(response, creativity, analysis) {
    const random = Math.random();
    
    if (random > 0.9) {
        // إضافة نكتة
        const jokes = [...creativity.jokes.wordplay, ...creativity.jokes.situational];
        return response + "\n\nبالمناسبة: " + jokes[Math.floor(Math.random() * jokes.length)];
    } else if (random > 0.8) {
        // إضافة استعارة
        return response + "\n\n" + creativity.metaphors[Math.floor(Math.random() * creativity.metaphors.length)];
    }
    
    return null;
}

// حفظ المحادثة
function saveConversation(userID, userMessage, botResponse) {
    const conversations = loadData(conversationsPath);
    
    if (!conversations[userID]) {
        conversations[userID] = [];
    }
    
    conversations[userID].push({
        role: "user",
        content: userMessage,
        timestamp: Date.now()
    });
    
    conversations[userID].push({
        role: "assistant", 
        content: botResponse,
        timestamp: Date.now()
    });
    
    // الاحتفاظ بآخر 100 رسالة
    if (conversations[userID].length > 100) {
        conversations[userID] = conversations[userID].slice(-100);
    }
    
    saveData(conversationsPath, conversations);
}

// تقسيم الرسائل الطويلة
function splitMessage(text, maxLength = 2000) {
    if (text.length <= maxLength) return [text];
    
    const parts = [];
    let current = '';
    const sentences = text.split(/[.!?。！؟]/);
    
    for (const sentence of sentences) {
        if ((current + sentence).length > maxLength) {
            if (current) {
                parts.push(current.trim());
                current = sentence;
            } else {
                for (let i = 0; i < sentence.length; i += maxLength) {
                    parts.push(sentence.substring(i, i + maxLength));
                }
                current = '';
            }
        } else {
            current += sentence + '.';
        }
    }
    
    if (current) parts.push(current.trim());
    return parts;
}

// تهيئة النظام عند التحميل
module.exports.onLoad = function ({ configValue }) {
    initSystem();
    console.log('🧠 Eli Ultimate AI loaded! Smart, learning, and evolving.');
};

// معالجة الأحداث - الرد على البادئة "ايلي"
module.exports.handleEvent = function({ event, api }) {
    if (event.type === "message" || event.type === "message_reply") {
        const { threadID, senderID, body } = event;
        
        if (!body || senderID === api.getCurrentUserID()) return;
        
        const botID = api.getCurrentUserID();
        const isMentioned = event.mentions && Object.keys(event.mentions).includes(botID);
        const isDirectMessage = event.isGroup === false;
        const isReplyToBot = event.type === "message_reply" && event.messageReply.senderID === botID;
        
        // فحص البادئة "ايلي"
        const startsWithEli = body.toLowerCase().startsWith('ايلي ');
        
        const shouldRespond = startsWithEli || isMentioned || isDirectMessage || isReplyToBot || 
                             body.toLowerCase().includes('إيلي') || 
                             body.toLowerCase().includes('eli') ||
                             Math.random() < 0.1; // 10% فرصة للتعلم السلبي
        
        if (shouldRespond) {
            this.run({ api, event, args: body.split(' ') });
        }
    }
};

// معالجة الردود
module.exports.handleReply = function({ api, event, handleReply }) {
    if (handleReply.author === event.senderID) {
        this.run({ 
            api, 
            event: { ...event, body: event.body }, 
            args: event.body.split(' ')
        });
    }
};

// الدالة الرئيسية
module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID, body } = event;
    
    if (!body || body.trim() === '') return;
    
    let userMessage = body;
    
    // إزالة البادئة "ايلي" إذا وجدت
    if (userMessage.toLowerCase().startsWith('ايلي ')) {
        userMessage = userMessage.substring(4).trim();
    }
    
    // إزالة الإشارات
    if (event.mentions) {
        Object.values(event.mentions).forEach(mention => {
            userMessage = userMessage.replace(`@${mention.replace('@', '')}`, '').trim();
        });
    }
    
    if (!userMessage || userMessage.trim() === '') {
        userMessage = "هلا";
    }
    
    try {
        // مؤشر الكتابة
        api.sendTypingIndicator(threadID);
        
        // رسالة التفكير
        const thinkingMsg = await api.sendMessage("🧠 إيلي عم تتعلم وتفكر شوي...", threadID);
        
        // تحليل ذكي للرسالة
        const analysis = smartAnalysis(userMessage, senderID);
        
        // تطوير الشخصية
        const evolution = evolvePersonality(senderID, analysis);
        
        // توليد رد ذكي
        const response = generateSmartResponse(analysis, senderID);
        
        // التعلم من المحادثة
        learnFromConversation(analysis, response, senderID);
        
        // حفظ المحادثة
        saveConversation(senderID, userMessage, response);
        
        // حذف رسالة التفكير
        api.unsendMessage(thinkingMsg.messageID);
        
        // إشعار التطور
        if (evolution.evolved) {
            await api.sendMessage(`🌟 شخصيتي تطورت معاك! وصلت المستوى ${evolution.newLevel}`, threadID);
            setTimeout(() => {}, 1000);
        }
        
        // إرسال رسالة التعلم أحياناً
        if (Math.random() > 0.95) {
            await api.sendMessage("📚 تعلمت شي جديد من كلامك!", threadID);
            setTimeout(() => {}, 500);
        }
        
        // تقسيم وإرسال الرد
        const responseParts = splitMessage(response);
        
        if (responseParts.length > 1) {
            api.sendMessage("ولد كلامي طويل شوي، خليني أرسله على قطع...", threadID);
        }
        
        for (let i = 0; i < responseParts.length; i++) {
            setTimeout(() => {
                api.sendMessage(responseParts[i], threadID, messageID);
            }, i * 800);
        }
        
    } catch (error) {
        console.error('Eli Ultimate Error:', error);
        api.sendMessage("❌ في خطأ بس راح أتعلم منه! هذا جزء من التطور 💪", threadID, messageID);
    }
};