const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "ايلي",
    version: "5.0.0-ultimate",
    hasPermssion: 0,
    credits: "حمادي - Hamadi",
    description: "إيلي - ذكاء اصطناعي متطور يتعلم، يتطور، ويصير أذكى مع كل محادثة. نظام تعلم فريد 100% محلي",
    commandCategory: "ai",
    usages: "ايلي [رسالتك] - للتحدث مع إيلي الذكية",
    cooldowns: 1,
    dependencies: {},
    envConfig: {}
};

module.exports.languages = {
    "ar": {
        "thinking": "🧠 إيلي عم تتعلم وتفكر...",
        "learning": "📚 تعلمت شي جديد!",
        "error": "❌ في خطأ بس راح أتعلم منه",
        "evolved": "🌟 شخصيتي تطورت معاك!"
    }
};

// مسارات الملفات
const dataDir = path.join(__dirname, 'data');
const conversationsPath = path.join(dataDir, 'conversations.json');
const knowledgeBasePath = path.join(dataDir, 'knowledge-base.json');
const learningPatternsPath = path.join(dataDir, 'learning-patterns.json');
const personalityEvolutionPath = path.join(dataDir, 'personality-evolution.json');
const responseRatingsPath = path.join(dataDir, 'response-ratings.json');
const contextMemoryPath = path.join(dataDir, 'context-memory.json');
const emotionalIntelligencePath = path.join(dataDir, 'emotional-intelligence.json');
const rewardsSystemPath = path.join(dataDir, 'rewards-system.json');
const creativityPath = path.join(dataDir, 'creativity.json');
const advancedLearningPath = path.join(dataDir, 'advanced-learning.json');

// تهيئة النظام
function initializeSystem() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const initialData = {
        conversations: {},
        knowledgeBase: getInitialKnowledge(),
        learningPatterns: {},
        personalityEvolution: {},
        responseRatings: {},
        contextMemory: {},
        emotionalIntelligence: getInitialEmotionalIntelligence(),
        rewardsSystem: {},
        creativity: getInitialCreativity(),
        advancedLearning: getInitialAdvancedLearning()
    };
    
    Object.entries({
        [conversationsPath]: initialData.conversations,
        [knowledgeBasePath]: initialData.knowledgeBase,
        [learningPatternsPath]: initialData.learningPatterns,
        [personalityEvolutionPath]: initialData.personalityEvolution,
        [responseRatingsPath]: initialData.responseRatings,
        [contextMemoryPath]: initialData.contextMemory,
        [emotionalIntelligencePath]: initialData.emotionalIntelligence,
        [rewardsSystemPath]: initialData.rewardsSystem,
        [creativityPath]: initialData.creativity,
        [advancedLearningPath]: initialData.advancedLearning
    }).forEach(([path, data]) => {
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, JSON.stringify(data, null, 2));
        }
    });
}

// المعرفة الأولية
function getInitialKnowledge() {
    return {
        vocabulary: {
            greetings: {
                khaleeji: ["هلا", "أهلين", "حياك", "شلونك", "وش أخبارك", "كيف الصحة"],
                libyan: ["باهي", "كيفاش", "وين راك", "لاباس", "منين جاي", "شنو أخبارك"],
                responses: [
                    "هلا والله {name}! شلونك اليوم؟",
                    "أهلين وسهلين! كيفاش الأحوال؟",
                    "حياك الله، وين راك من زمان؟",
                    "باهي، شنو جابك هنا؟",
                    "هلا بالغالي، كيف صحتك؟"
                ]
            },
            emotions: {
                positive: ["فرحان", "مبسوط", "حلو", "زين", "مليح", "تمام"],
                negative: ["زعلان", "حزين", "تعبان", "مو زين", "مش باهي"],
                responses: {
                    positive: [
                        "والله فرحتني! {emotion} يخليك دايما كذا",
                        "ما شاء الله، {emotion} معدي!",
                        "الله يديم عليك هالفرحة"
                    ],
                    negative: [
                        "لا تحاتي حبيبي، {emotion} راح يعدي",
                        "الله يقويك، كلنا نمر بأوقات صعبة",
                        "ما تخلي {emotion} يغلبك، إنت أقوى"
                    ]
                }
            },
            topics: {
                technology: {
                    keywords: ["برمجة", "كود", "تطبيق", "موقع", "ذكاء اصطناعي", "تقنية"],
                    responses: [
                        "والله أحب التقنية! {topic} موضوع مثير",
                        "هاي من المجالات اللي أخبرها، شنو تبي تعرف عن {topic}؟",
                        "التقنية تتطور بسرعة، خاصة {topic}"
                    ]
                },
                daily_life: {
                    keywords: ["أكل", "شغل", "مدرسة", "جامعة", "بيت", "عيلة"],
                    responses: [
                        "هاي من الأشياء المهمة في الحياة، {topic} كيف اليوم؟",
                        "{topic} شي أساسي، شنو اللي صار فيه؟",
                        "حكيلي أكثر عن {topic}"
                    ]
                }
            }
        },
        learningStats: {
            totalConversations: 0,
            uniqueUsers: 0,
            wordsLearned: 0,
            patternsDiscovered: 0,
            personalityAdjustments: 0
        }
    };
}

// تحميل البيانات
function loadData(filePath, defaultValue = {}) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        return defaultValue;
    }
}

// حفظ البيانات
function saveData(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error saving ${filePath}:`, error);
        return false;
    }
}

// تحليل نص متقدم
function advancedTextAnalysis(text, userID) {
    const cleanText = text.toLowerCase()
        .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    
    const words = cleanText.split(' ').filter(word => word.length > 1);
    
    return {
        originalText: text,
        cleanText,
        words,
        wordCount: words.length,
        complexity: calculateComplexity(words),
        sentiment: analyzeSentimentAdvanced(cleanText),
        dialect: detectDialect(cleanText),
        topics: extractAdvancedTopics(words),
        personalityTraits: extractPersonalityTraits(cleanText),
        questionType: analyzeQuestionType(text),
        emotionalIntensity: calculateEmotionalIntensity(cleanText),
        userID
    };
}

// حساب تعقيد النص
function calculateComplexity(words) {
    const uniqueWords = new Set(words);
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;
    
    return {
        lexicalDiversity: uniqueWords.size / words.length,
        averageWordLength: avgWordLength,
        complexity: avgWordLength * (uniqueWords.size / words.length)
    };
}

// تحليل مشاعر متقدم
function analyzeSentimentAdvanced(text) {
    const sentimentMap = {
        veryPositive: ["ممتاز", "رائع", "حلو كثير", "أحبك", "فرحتني", "ما شاء الله"],
        positive: ["حلو", "زين", "مليح", "صح", "تمام", "فرحان", "مبسوط"],
        neutral: ["عادي", "ماشي", "اوكي", "مزبوط"],
        negative: ["مو زين", "تعبان", "صعب", "مش باهي", "زعلان"],
        veryNegative: ["وحش كثير", "أكرهه", "مقهور", "محبط جداً"]
    };
    
    let maxScore = 0;
    let detectedSentiment = 'neutral';
    
    Object.entries(sentimentMap).forEach(([sentiment, words]) => {
        const score = words.reduce((sum, word) => {
            return text.includes(word) ? sum + 1 : sum;
        }, 0);
        
        if (score > maxScore) {
            maxScore = score;
            detectedSentiment = sentiment;
        }
    });
    
    return {
        type: detectedSentiment,
        intensity: maxScore,
        confidence: Math.min(maxScore / 3, 1)
    };
}

// كشف اللهجة
function detectDialect(text) {
    const dialectMap = {
        khaleeji: ["شلون", "وش", "كيف", "يلا", "تسلم", "زين", "ماشي"],
        libyan: ["كيفاش", "وين راك", "باهي", "مليح", "اشكون", "فما", "برشا"],
        egyptian: ["إزيك", "ايه", "خلاص", "يعني", "كده"],
        levantine: ["شو", "كيفك", "تمام", "حلو", "يلا"],
        standard: ["كيف", "ماذا", "نعم", "لا", "شكرا"]
    };
    
    const scores = {};
    Object.entries(dialectMap).forEach(([dialect, words]) => {
        scores[dialect] = words.reduce((score, word) => {
            return text.includes(word) ? score + 1 : score;
        }, 0);
    });
    
    const topDialect = Object.entries(scores).reduce((a, b) => 
        scores[a[0]] > scores[b[0]] ? a : b
    )[0];
    
    return {
        primary: topDialect,
        confidence: scores[topDialect] / 10,
        allScores: scores
    };
}

// استخراج مواضيع متقدمة
function extractAdvancedTopics(words) {
    const topicPatterns = {
        technology: {
            keywords: ["برمجة", "كود", "تطبيق", "موقع", "حاسوب", "انترنت", "ذكاء", "اصطناعي"],
            weight: 2
        },
        education: {
            keywords: ["مدرسة", "جامعة", "دراسة", "امتحان", "معهد", "تعليم"],
            weight: 1.5
        },
        family: {
            keywords: ["أهل", "عيلة", "أم", "أب", "أخ", "أخت", "جد", "جدة"],
            weight: 1.2
        },
        work: {
            keywords: ["شغل", "وظيفة", "مكتب", "راتب", "مدير", "زملاء"],
            weight: 1.5
        },
        food: {
            keywords: ["أكل", "طعام", "مطعم", "طبخ", "رز", "لحم"],
            weight: 1
        },
        emotion: {
            keywords: ["حب", "كره", "فرح", "حزن", "خوف", "قلق"],
            weight: 1.8
        }
    };
    
    const detectedTopics = [];
    Object.entries(topicPatterns).forEach(([topic, data]) => {
        const matches = data.keywords.filter(keyword => 
            words.some(word => word.includes(keyword) || keyword.includes(word))
        );
        
        if (matches.length > 0) {
            detectedTopics.push({
                topic,
                relevance: (matches.length / data.keywords.length) * data.weight,
                matchedKeywords: matches
            });
        }
    });
    
    return detectedTopics.sort((a, b) => b.relevance - a.relevance);
}

// استخراج صفات الشخصية
function extractPersonalityTraits(text) {
    const traits = {
        extroversion: ["حب الناس", "اجتماعي", "أحب الحفلات", "كثير أصدقاء"],
        openness: ["أحب التجربة", "فضولي", "إبداعي", "أحب التعلم"],
        conscientiousness: ["منظم", "ملتزم", "دقيق", "مسؤول"],
        agreeableness: ["طيب", "متعاون", "أساعد الناس", "أحب الخير"],
        neuroticism: ["قلقان", "متوتر", "حساس", "أفكر كثير"]
    };
    
    const detectedTraits = {};
    Object.entries(traits).forEach(([trait, indicators]) => {
        const score = indicators.reduce((sum, indicator) => {
            return text.includes(indicator) ? sum + 1 : sum;
        }, 0);
        detectedTraits[trait] = score / indicators.length;
    });
    
    return detectedTraits;
}

// تحليل نوع السؤال
function analyzeQuestionType(text) {
    const questionPatterns = {
        what: ["شنو", "ايش", "وش", "ماذا"],
        where: ["وين", "فين", "أين"],
        when: ["متى", "ايمتا"],
        how: ["كيف", "كيفاش"],
        why: ["ليش", "لماذا", "ليه"],
        who: ["مين", "اشكون", "من"]
    };
    
    for (const [type, patterns] of Object.entries(questionPatterns)) {
        if (patterns.some(pattern => text.includes(pattern))) {
            return type;
        }
    }
    
    return text.includes('؟') || text.includes('?') ? 'general' : 'statement';
}

// حساب الكثافة العاطفية
function calculateEmotionalIntensity(text) {
    const intensifiers = ["جداً", "كثير", "برشا", "وايد", "أكثر شي"];
    const emotionalWords = ["حب", "كره", "فرح", "حزن", "قلق", "خوف"];
    
    let intensity = 0;
    emotionalWords.forEach(word => {
        if (text.includes(word)) {
            intensity += 1;
            intensifiers.forEach(intensifier => {
                if (text.includes(word + " " + intensifier) || text.includes(intensifier + " " + word)) {
                    intensity += 0.5;
                }
            });
        }
    });
    
    return Math.min(intensity / 3, 1);
}

// التعلم من المحادثة
function learnFromConversation(analysis, response, userID) {
    const knowledgeBase = loadData(knowledgeBasePath);
    const learningPatterns = loadData(learningPatternsPath);
    
    // تعلم كلمات جديدة
    analysis.words.forEach(word => {
        if (word.length > 2) {
            if (!knowledgeBase.vocabulary.learned) {
                knowledgeBase.vocabulary.learned = {};
            }
            
            if (!knowledgeBase.vocabulary.learned[word]) {
                knowledgeBase.vocabulary.learned[word] = {
                    count: 0,
                    contexts: [],
                    sentiments: [],
                    users: new Set()
                };
            }
            
            knowledgeBase.vocabulary.learned[word].count++;
            knowledgeBase.vocabulary.learned[word].contexts.push(analysis.topics);
            knowledgeBase.vocabulary.learned[word].sentiments.push(analysis.sentiment.type);
            knowledgeBase.vocabulary.learned[word].users.add(userID);
            
            // تحويل Set إلى Array للحفظ
            knowledgeBase.vocabulary.learned[word].users = Array.from(knowledgeBase.vocabulary.learned[word].users);
        }
    });
    
    // تعلم أنماط الحديث
    const patternKey = analysis.words.slice(0, 2).join(' ');
    if (!learningPatterns[patternKey]) {
        learningPatterns[patternKey] = {
            frequency: 0,
            successfulResponses: [],
            userContext: {},
            sentimentDistribution: {}
        };
    }
    
    learningPatterns[patternKey].frequency++;
    learningPatterns[patternKey].successfulResponses.push(response);
    
    if (!learningPatterns[patternKey].userContext[userID]) {
        learningPatterns[patternKey].userContext[userID] = 0;
    }
    learningPatterns[patternKey].userContext[userID]++;
    
    // توزيع المشاعر
    const sentiment = analysis.sentiment.type;
    if (!learningPatterns[patternKey].sentimentDistribution[sentiment]) {
        learningPatterns[patternKey].sentimentDistribution[sentiment] = 0;
    }
    learningPatterns[patternKey].sentimentDistribution[sentiment]++;
    
    // تحديث إحصائيات التعلم
    knowledgeBase.learningStats.totalConversations++;
    knowledgeBase.learningStats.wordsLearned = Object.keys(knowledgeBase.vocabulary.learned || {}).length;
    knowledgeBase.learningStats.patternsDiscovered = Object.keys(learningPatterns).length;
    
    // حفظ البيانات
    saveData(knowledgeBasePath, knowledgeBase);
    saveData(learningPatternsPath, learningPatterns);
    
    return true;
}

// تطوير الشخصية
function evolvePersonality(userID, analysis) {
    const personalityEvolution = loadData(personalityEvolutionPath);
    
    if (!personalityEvolution[userID]) {
        personalityEvolution[userID] = {
            basePersonality: getBasePersonality(),
            adaptations: {},
            interactionHistory: [],
            evolutionLevel: 1,
            lastEvolution: Date.now()
        };
    }
    
    const userPersonality = personalityEvolution[userID];
    
    // إضافة تفاعل جديد
    userPersonality.interactionHistory.push({
        timestamp: Date.now(),
        sentiment: analysis.sentiment,
        topics: analysis.topics,
        dialect: analysis.dialect,
        personalityTraits: analysis.personalityTraits
    });
    
    // الاحتفاظ بآخر 50 تفاعل فقط
    if (userPersonality.interactionHistory.length > 50) {
        userPersonality.interactionHistory = userPersonality.interactionHistory.slice(-50);
    }
    
    // تحليل الأنماط وتطوير الشخصية
    if (userPersonality.interactionHistory.length >= 10) {
        const recentInteractions = userPersonality.interactionHistory.slice(-10);
        
        // تحليل اللهجة المفضلة
        const dialectPreference = getMostFrequentDialect(recentInteractions);
        if (dialectPreference !== userPersonality.adaptations.preferredDialect) {
            userPersonality.adaptations.preferredDialect = dialectPreference;
            userPersonality.evolutionLevel++;
        }
        
        // تحليل الموضوع المفضل
        const topicPreference = getMostFrequentTopic(recentInteractions);
        userPersonality.adaptations.preferredTopics = topicPreference;
        
        // تحليل النبرة المفضلة
        const sentimentTrend = getAverageSentiment(recentInteractions);
        userPersonality.adaptations.sentimentAdaptation = sentimentTrend;
        
        userPersonality.lastEvolution = Date.now();
    }
    
    saveData(personalityEvolutionPath, personalityEvolution);
    return userPersonality;
}

// الحصول على الشخصية الأساسية
function getBasePersonality() {
    return {
        warmth: 0.8,
        formality: 0.3,
        playfulness: 0.7,
        helpfulness: 0.9,
        curiosity: 0.6,
        emotionalSupport: 0.8
    };
}

// تحليل اللهجة الأكثر استخداماً
function getMostFrequentDialect(interactions) {
    const dialectCounts = {};
    interactions.forEach(interaction => {
        const dialect = interaction.dialect.primary;
        dialectCounts[dialect] = (dialectCounts[dialect] || 0) + 1;
    });
    
    return Object.entries(dialectCounts).reduce((a, b) => 
        dialectCounts[a[0]] > dialectCounts[b[0]] ? a : b
    )[0];
}

// تحليل الموضوع الأكثر شيوعاً
function getMostFrequentTopic(interactions) {
    const topicCounts = {};
    interactions.forEach(interaction => {
        interaction.topics.forEach(topicData => {
            const topic = topicData.topic;
            topicCounts[topic] = (topicCounts[topic] || 0) + topicData.relevance;
        });
    });
    
    return Object.entries(topicCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);
}

// حساب متوسط المشاعر
function getAverageSentiment(interactions) {
    const sentimentValues = {
        veryPositive: 2,
        positive: 1,
        neutral: 0,
        negative: -1,
        veryNegative: -2
    };
    
    const total = interactions.reduce((sum, interaction) => {
        return sum + (sentimentValues[interaction.sentiment.type] || 0);
    }, 0);
    
    return total / interactions.length;
}

// توليد رد ذكي ومتعلم
function generateIntelligentResponse(analysis, userID) {
    const knowledgeBase = loadData(knowledgeBasePath);
    const learningPatterns = loadData(learningPatternsPath);
    const personalityEvolution = loadData(personalityEvolutionPath);
    
    const userPersonality = personalityEvolution[userID];
    let response = "";
    
    // اختيار نوع الرد حسب التحليل
    if (analysis.questionType && analysis.questionType !== 'statement') {
        response = generateQuestionResponse(analysis, userPersonality);
    } else if (analysis.sentiment.intensity > 0.5) {
        response = generateEmotionalResponse(analysis, userPersonality);
    } else if (analysis.topics.length > 0) {
        response = generateTopicResponse(analysis, userPersonality, knowledgeBase);
    } else {
        response = generateGeneralResponse(analysis, userPersonality, learningPatterns);
    }
    
    // تخصيص الرد للهجة المفضلة
    if (userPersonality && userPersonality.adaptations.preferredDialect) {
        response = adaptToDialect(response, userPersonality.adaptations.preferredDialect);
    }
    
    // إضافة لمسة شخصية
    response = addPersonalTouch(response, userPersonality, analysis);
    
    return response;
}

// توليد رد على الأسئلة
function generateQuestionResponse(analysis, userPersonality) {
    const questionResponses = {
        what: [
            "هاي سؤال مليح! خليني أفكر...",
            "شنو تقصد بالضبط؟ ممكن توضح أكثر؟",
            "والله سؤال محيرني، بس راح أحاول أساعدك"
        ],
        where: [
            "وين بالضبط؟ ممكن تعطيني تفاصيل أكثر؟",
            "فين تقصد؟ المكان مهم يكون واضح",
            "هاي معلومة مهمة، خليني أساعدك نلاقي المكان"
        ],
        when: [
            "الوقت مهم، خليني أشوف...",
            "متى بالضبط؟ التوقيت شي أساسي",
            "ايمتا تحتاج هالشي؟"
        ],
        how: [
            "كيفاش؟ هاي طريقة مثيرة للاهتمام...",
            "الطريقة مهمة، خليني أشرحلك",
            "كيف نسوي هالشي؟ راح نشوف سوا"
        ],
        why: [
            "ليش؟ سؤال عميق، خليني أفكر فيه",
            "الأسباب كثيرة، بس راح أقولك اللي أعرفه",
            "ليه هالشي؟ فلسفة حلوة"
        ],
        who: [
            "مين تقصد؟ ممكن تعطيني تفاصيل أكثر؟",
            "اشكون هذا؟ خليني أساعدك",
            "من هو؟ الشخص مهم نعرفه"
        ]
    };
    
    const responses = questionResponses[analysis.questionType] || questionResponses.what;
    return responses[Math.floor(Math.random() * responses.length)];
}

// توليد رد عاطفي
function generateEmotionalResponse(analysis, userPersonality) {
    const emotionalResponses = {
        veryPositive: [
            "والله فرحتني! هالطاقة الإيجابية حلوة كثير",
            "ما شاء الله، شفت فرحتك وفرحت معاك!",
            "يا الله، هالحماس معدي! أحب هالشي"
        ],
        positive: [
            "حلو هالكلام، يخليك دايما مبسوط",
            "زين، الفرحة شي حلو",
            "مليح، هالمزاج الحلو يعجبني"
        ],
        negative: [
            "لا تحاتي حبيبي، كلنا نمر بأوقات صعبة",
            "فهمتك، الحياة أحيانا تكون صعبة",
            "ما تخلي هالشي يضايقك، راح يعدي"
        ],
        veryNegative: [
            "والله حاسس فيك، بس لازم تكون قوي",
            "صعبة الأوقات هاي، بس إنت أقوى منها",
            "الله يقويك، ويعطيك الصبر"
        ]
    };
    
    const responses = emotionalResponses[analysis.sentiment.type] || emotionalResponses.positive;
    return responses[Math.floor(Math.random() * responses.length)];
}

// توليد رد حسب الموضوع
function generateTopicResponse(analysis, userPersonality, knowledgeBase) {
    const topTopic = analysis.topics[0];
    if (!topTopic) return generateGeneralResponse(analysis, userPersonality);
    
    const topicResponses = knowledgeBase.vocabulary.topics[topTopic.topic];
    if (topicResponses && topicResponses.responses) {
        const response = topicResponses.responses[Math.floor(Math.random() * topicResponses.responses.length)];
        return response.replace('{topic}', topTopic.topic);
    }
    
    return `مليح موضوع ${topTopic.topic}، حكيلي أكثر عنه`;
}

// توليد رد عام
function generateGeneralResponse(analysis, userPersonality, learningPatterns) {
    const generalResponses = [
        "فهمت عليك، شنو رايك نكمل الحديث؟",
        "باهي هالكلام، خليني أفكر فيه",
        "والله كلامك يخليني أتعلم، شكرا لك",
        "مزبوط، وبعدين شصار؟",
        "حلو، كيف نطور هالموضوع؟",
        "أحب طريقة تفكيرك، وضحلي أكثر"
    ];
    
    // إذا كان هناك نمط متعلم مناسب
    const patternKey = analysis.words.slice(0, 2).join(' ');
    if (learningPatterns[patternKey] && learningPatterns[patternKey].successfulResponses.length > 0) {
        const learnedResponses = learningPatterns[patternKey].successfulResponses;
        const randomLearned = learnedResponses[Math.floor(Math.random() * learnedResponses.length)];
        if (Math.random() > 0.5) { // 50% فرصة استخدام الرد المتعلم
            return randomLearned;
        }
    }
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
}

// تكييف الرد للهجة
function adaptToDialect(response, dialect) {
    const dialectAdaptations = {
        khaleeji: {
            "شنو": "وش",
            "كيفاش": "كيف",
            "باهي": "زين",
            "مليح": "حلو"
        },
        libyan: {
            "وش": "شنو",
            "كيف": "كيفاش",
            "زين": "باهي",
            "حلو": "مليح"
        }
    };
    
    const adaptations = dialectAdaptations[dialect];
    if (!adaptations) return response;
    
    let adaptedResponse = response;
    Object.entries(adaptations).forEach(([from, to]) => {
        adaptedResponse = adaptedResponse.replace(new RegExp(from, 'g'), to);
    });
    
    return adaptedResponse;
}

// إضافة لمسة شخصية
function addPersonalTouch(response, userPersonality, analysis) {
    if (!userPersonality) return response;
    
    const evolution = userPersonality.evolutionLevel;
    let personalizedResponse = response;
    
    // إضافة اسم مستعار حسب مستوى التطور
    if (evolution > 5) {
        const nicknames = ["حبيبي", "عزيزي", "صديقي", "غالي"];
        if (Math.random() > 0.7) {
            const nickname = nicknames[Math.floor(Math.random() * nicknames.length)];
            personalizedResponse += ` ${nickname}`;
        }
    }
    
    // إضافة إيموجي حسب المزاج
    if (analysis.sentiment.type === 'positive' && Math.random() > 0.6) {
        personalizedResponse += " 😊";
    }
    
    // إضافة ذكريات مشتركة
    if (evolution > 10 && userPersonality.adaptations.preferredTopics) {
        const topics = userPersonality.adaptations.preferredTopics;
        if (Math.random() > 0.8 && topics.length > 0) {
            personalizedResponse += ` بالمناسبة، إنت دايما تحب تتكلم عن ${topics[0]}`;
        }
    }
    
    return personalizedResponse;
}

// تحديث ذاكرة السياق
function updateContextMemory(userID, analysis, response) {
    const contextMemory = loadData(contextMemoryPath);
    
    if (!contextMemory[userID]) {
        contextMemory[userID] = {
            recentTopics: [],
            conversationFlow: [],
            preferences: {},
            lastInteraction: null
        };
    }
    
    const userContext = contextMemory[userID];
    
    // تحديث المواضيع الحديثة
    analysis.topics.forEach(topic => {
        const existingIndex = userContext.recentTopics.findIndex(t => t.topic === topic.topic);
        if (existingIndex !== -1) {
            userContext.recentTopics[existingIndex].frequency++;
        } else {
            userContext.recentTopics.push({
                topic: topic.topic,
                frequency: 1,
                lastMentioned: Date.now()
            });
        }
    });
    
    // الاحتفاظ بآخر 10 مواضيع
    userContext.recentTopics = userContext.recentTopics
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 10);
    
    // تحديث تدفق المحادثة
    userContext.conversationFlow.push({
        timestamp: Date.now(),
        userInput: analysis.originalText,
        botResponse: response,
        sentiment: analysis.sentiment,
        topics: analysis.topics.map(t => t.topic)
    });
    
    // الاحتفاظ بآخر 20 تفاعل
    if (userContext.conversationFlow.length > 20) {
        userContext.conversationFlow = userContext.conversationFlow.slice(-20);
    }
    
    userContext.lastInteraction = Date.now();
    
    saveData(contextMemoryPath, contextMemory);
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
    
    // الاحتفاظ بآخر 200 رسالة
    if (conversations[userID].length > 200) {
        conversations[userID] = conversations[userID].slice(-200);
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

// الدالة الرئيسية
module.exports.onLoad = function ({ configValue }) {
    initializeSystem();
    console.log('🧠 Eli Learning AI activated! Ready to learn and evolve.');
};

module.exports.handleEvent = function({ event, api }) {
    if (event.type === "message" || event.type === "message_reply") {
        const { threadID, senderID, body } = event;
        
        if (!body || senderID === api.getCurrentUserID()) return;
        
        const botID = api.getCurrentUserID();
        const isMentioned = event.mentions && Object.keys(event.mentions).includes(botID);
        const isDirectMessage = event.isGroup === false;
        const isReplyToBot = event.type === "message_reply" && event.messageReply.senderID === botID;
        
        const shouldRespond = isMentioned || isDirectMessage || isReplyToBot || 
                             body.toLowerCase().includes('إيلي') || 
                             body.toLowerCase().includes('eli') ||
                             Math.random() < 0.2; // 20% فرصة للتعلم من أي محادثة
        
        if (shouldRespond) {
            this.run({ api, event, args: body.split(' ') });
        }
    }
};

module.exports.handleReply = function({ api, event, handleReply }) {
    if (handleReply.author === event.senderID) {
        this.run({ 
            api, 
            event: { ...event, body: event.body }, 
            args: event.body.split(' ')
        });
    }
};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID, body } = event;
    
    if (!body || body.trim() === '') return;
    
    let userMessage = body;
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
        
        // رسالة التفكير والتعلم
        const thinkingMsg = await api.sendMessage("🧠 إيلي عم تتعلم وتفكر...", threadID);
        
        // تحليل متقدم للرسالة
        const analysis = advancedTextAnalysis(userMessage, senderID);
        
        // تطوير الشخصية
        const evolvedPersonality = evolvePersonality(senderID, analysis);
        
        // توليد رد ذكي
        const response = generateIntelligentResponse(analysis, senderID);
        
        // التعلم من المحادثة
        learnFromConversation(analysis, response, senderID);
        
        // تحديث ذاكرة السياق
        updateContextMemory(senderID, analysis, response);
        
        // حفظ المحادثة
        saveConversation(senderID, userMessage, response);
        
        // حذف رسالة التفكير
        api.unsendMessage(thinkingMsg.messageID);
        
        // إشعار التطور (أحياناً)
        if (evolvedPersonality.evolutionLevel > 1 && Math.random() > 0.9) {
            await api.sendMessage("🌟 شخصيتي تطورت معاك! صرت أفهمك أحسن", threadID);
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
        
        // تعلم إضافي من ردود الفعل
        setTimeout(() => {
            // مراقبة الردود التالية للتعلم
        }, 5000);
        
    } catch (error) {
        console.error('Learning AI Error:', error);
        api.sendMessage("❌ في خطأ بس راح أتعلم منه! هذا جزء من التطور", threadID, messageID);
    }
};