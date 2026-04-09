import type { MemoryItem, PersonalityConfig, LanguageStyleConfig } from '@/types/avatar';

// 问题库
const QUESTION_BANK = [
  // 性格相关
  '如果你能拥有一种超能力，你会选择什么？为什么？',
  '描述一下你理想中的周末是怎样的？',
  '你觉得自己最大的优点和缺点分别是什么？',
  
  // 思维方式
  '当你面临一个困难决定时，你通常会怎么做？',
  '你最近一直在思考的一个问题是什么？',
  
  // 价值观
  '你最看重朋友身上的什么品质？',
  '如果可以给五年前的自己一条建议，你会说什么？',
  
  // 生活态度
  '什么事情会让你感到真正的快乐？',
  '你如何看待工作和生活的平衡？',
  
  // 兴趣爱好
  '空闲时间你最喜欢做什么？',
  '最近有什么让你着迷的事物吗？',
  
  // 人际关系
  '在朋友眼中，你是个怎样的人？',
  '你喜欢独处还是和朋友在一起？',
  
  // 梦想与目标
  '如果可以选择任何地方生活，你会选择哪里？',
  '你未来最想实现的一个目标是什么？',
  
  // 情绪表达
  '当你心情不好时，你会怎么调节？',
  '你觉得自己的表达能力如何？',
];

// 关键词映射表
const KEYWORD_MAPPINGS = {
  // 性格倾向 (extraversion)
  extraversion: {
    high: ['朋友', '聚会', '社交', '热闹', '外向', '活跃', '开朗', '热情', '话多', '喜欢人'],
    low: ['独处', '安静', '内向', '宅', '一个人', '安静', '沉默', '低调', '私密', '安静'],
  },
  
  // 思维方式 (rationality)
  rationality: {
    high: ['逻辑', '理性', '分析', '思考', '客观', '理智', '冷静', '计划', '策略', '道理'],
    low: ['感觉', '感性', '直觉', '随心', '情绪', '感受', '冲动', '喜欢', '心动', '情感'],
  },
  
  // 处事风格 (seriousness)
  seriousness: {
    high: ['认真', '严谨', '负责', '完美', '细致', '规划', '目标', '自律', '坚持', '努力'],
    low: ['随性', '佛系', '躺平', '轻松', '自在', '随意', '灵活', '顺其自然', '开心就好'],
  },
  
  // 表达方式 (praiseCritical)
  praiseCritical: {
    high: ['批评', '直接', '犀利', '真实', '吐槽', '挑刺', '严格', '要求高', '毒舌'],
    low: ['鼓励', '赞美', '温柔', '支持', '夸奖', '暖心', '包容', '理解', '安慰'],
  },
  
  // 内容风格 (abstractLiterary)
  abstractLiterary: {
    high: ['文艺', '诗意', '浪漫', '细腻', '温柔', '美好', '优雅', '深情', '意境'],
    low: ['抽象', '梗', '搞笑', '沙雕', '无厘头', '魔性', '鬼畜', '整活', '抽象'],
  },
  
  // 语气态度 (coldShowy)
  coldShowy: {
    high: ['显眼', '搞笑', '活跃', '话痨', '表现', '张扬', '社牛', '戏精', '夸张'],
    low: ['高冷', '淡定', '冷静', '沉默', '低调', '酷', '少言', '神秘', '疏离'],
  },
};

// 分析回答
export function analyzeAnswer(answer: string): {
  memories: MemoryItem[];
  personalityAdjustments: Partial<PersonalityConfig>;
  languageStyleAdjustments: Partial<LanguageStyleConfig>;
  insights: string[];
} {
  const memories: MemoryItem[] = [];
  const personalityAdjustments: Partial<PersonalityConfig> = {};
  const languageStyleAdjustments: Partial<LanguageStyleConfig> = {};
  const insights: string[] = [];
  
  const lowerAnswer = answer.toLowerCase();
  
  // 分析性格倾向
  let extraversionScore = 50;
  KEYWORD_MAPPINGS.extraversion.high.forEach(word => {
    if (lowerAnswer.includes(word)) extraversionScore += 10;
  });
  KEYWORD_MAPPINGS.extraversion.low.forEach(word => {
    if (lowerAnswer.includes(word)) extraversionScore -= 10;
  });
  personalityAdjustments.extraversion = Math.max(0, Math.min(100, extraversionScore));
  
  // 分析思维方式
  let rationalityScore = 50;
  KEYWORD_MAPPINGS.rationality.high.forEach(word => {
    if (lowerAnswer.includes(word)) rationalityScore += 10;
  });
  KEYWORD_MAPPINGS.rationality.low.forEach(word => {
    if (lowerAnswer.includes(word)) rationalityScore -= 10;
  });
  personalityAdjustments.rationality = Math.max(0, Math.min(100, rationalityScore));
  
  // 分析处事风格
  let seriousnessScore = 50;
  KEYWORD_MAPPINGS.seriousness.high.forEach(word => {
    if (lowerAnswer.includes(word)) seriousnessScore += 10;
  });
  KEYWORD_MAPPINGS.seriousness.low.forEach(word => {
    if (lowerAnswer.includes(word)) seriousnessScore -= 10;
  });
  personalityAdjustments.seriousness = Math.max(0, Math.min(100, seriousnessScore));
  
  // 分析表达方式
  let praiseCriticalScore = 50;
  KEYWORD_MAPPINGS.praiseCritical.high.forEach(word => {
    if (lowerAnswer.includes(word)) praiseCriticalScore += 10;
  });
  KEYWORD_MAPPINGS.praiseCritical.low.forEach(word => {
    if (lowerAnswer.includes(word)) praiseCriticalScore -= 10;
  });
  languageStyleAdjustments.praiseCritical = Math.max(0, Math.min(100, praiseCriticalScore));
  
  // 分析内容风格
  let abstractLiteraryScore = 50;
  KEYWORD_MAPPINGS.abstractLiterary.high.forEach(word => {
    if (lowerAnswer.includes(word)) abstractLiteraryScore += 10;
  });
  KEYWORD_MAPPINGS.abstractLiterary.low.forEach(word => {
    if (lowerAnswer.includes(word)) abstractLiteraryScore -= 10;
  });
  languageStyleAdjustments.abstractLiterary = Math.max(0, Math.min(100, abstractLiteraryScore));
  
  // 分析语气态度
  let coldShowyScore = 50;
  KEYWORD_MAPPINGS.coldShowy.high.forEach(word => {
    if (lowerAnswer.includes(word)) coldShowyScore += 10;
  });
  KEYWORD_MAPPINGS.coldShowy.low.forEach(word => {
    if (lowerAnswer.includes(word)) coldShowyScore -= 10;
  });
  languageStyleAdjustments.coldShowy = Math.max(0, Math.min(100, coldShowyScore));
  
  // 提取记忆
  // 兴趣爱好
  const hobbyPatterns = ['喜欢', '爱好', '热衷', '着迷', '沉迷', '热爱'];
  hobbyPatterns.forEach(pattern => {
    const index = lowerAnswer.indexOf(pattern);
    if (index !== -1) {
      const afterPattern = answer.slice(index + pattern.length, index + pattern.length + 20);
      const match = afterPattern.match(/[\u4e00-\u9fa5]{2,6}/);
      if (match) {
        memories.push({
          id: Date.now().toString() + Math.random(),
          category: 'interest',
          content: `喜欢${match[0]}`,
          source: 'qa',
          createdAt: Date.now(),
        });
        insights.push(`发现兴趣爱好：${match[0]}`);
      }
    }
  });
  
  // 价值观
  const valuePatterns = ['看重', '重视', '认为', '觉得', '相信'];
  valuePatterns.forEach(pattern => {
    const index = lowerAnswer.indexOf(pattern);
    if (index !== -1) {
      const sentence = answer.slice(index, index + 30);
      if (sentence.length > 5) {
        memories.push({
          id: Date.now().toString() + Math.random(),
          category: 'value',
          content: sentence,
          source: 'qa',
          createdAt: Date.now(),
        });
        insights.push('记录了价值观相关信息');
      }
    }
  });
  
  return {
    memories,
    personalityAdjustments,
    languageStyleAdjustments,
    insights,
  };
}

// 生成AI回复
export function generateAIResponse(insights: string[]): string {
  const responses = [
    '原来如此，我记住了！',
    '很有趣的回答，让我更了解你了。',
    '明白了，这对我理解你很有帮助。',
    'get到了，我会记住的！',
    '了解了，继续下一个问题？',
  ];
  
  // 如果有洞察，添加个性化回复
  if (insights.length > 0) {
    return `${responses[Math.floor(Math.random() * responses.length)]} ${insights[0]}`;
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
}

// 获取下一个问题
export function getNextQuestion(askedCount: number): string {
  return QUESTION_BANK[askedCount % QUESTION_BANK.length];
}
