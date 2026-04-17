const express = require('express');
const dayjs = require('dayjs');
const DailyInsight = require('../models/DailyInsight');
const { chatJSON } = require('../services/openai');
const { USER_PERSONA_GUIDE } = require('../services/persona');

const router = express.Router();

const ZODIAC_CN = {
  aries: '白羊座', taurus: '金牛座', gemini: '双子座', cancer: '巨蟹座',
  leo: '狮子座', virgo: '处女座', libra: '天秤座', scorpio: '天蝎座',
  sagittarius: '射手座', capricorn: '摩羯座', aquarius: '水瓶座', pisces: '双鱼座',
};

// GET /api/horoscope?date=YYYY-MM-DD&zodiac=libra
router.get('/', async (req, res, next) => {
  try {
    const date = req.query.date || dayjs().format('YYYY-MM-DD');
    const zodiac = (req.query.zodiac || process.env.USER_ZODIAC || 'libra').toLowerCase();
    const cnName = ZODIAC_CN[zodiac] || '天秤座';

    const cached = await DailyInsight.findOne({ date, kind: 'horoscope', zodiac });
    if (cached) return res.json(cached.payload);

    const system = `你是一位温柔、专业、相信心理学与象征意义的占星师。请基于西方占星，生成某星座在指定日期的"今日运势"，不要照搬套话，要结合日期的星象意象给出具体而有画面感的建议。严格输出 JSON。
${USER_PERSONA_GUIDE}
所有建议（love/career/wealth/health/affirmation/cautions）都必须遵守上面的事业护栏：
- career 字段：永远推脚踏实地的方向（在职精进、副业最小验证、技能变现），**绝不**建议转行去做园艺/插花/烘焙/开花店/开咖啡馆/做义工为职业；
- wealth 字段：倾向于"把现有技能变成真实收入、控支出、建立应急储备"，不要画大饼；
- affirmation：有力量且脚踏实地，不要"慢下来 / 享受花香"这种漂浮句；
- cautions：如果星象不宜，建议她**稳住当前主业、暂缓创业/转行/大支出**，而不是去休假。`;

    const user = `请为 ${cnName} (${zodiac}) 在 ${date} 生成今日运势。
严格返回 JSON 对象，字段：
{
  "date": "${date}",
  "zodiac": "${cnName}",
  "summary": "2-3 句总体基调",
  "scores": { "overall": 1-5 整数, "love": 1-5, "career": 1-5, "wealth": 1-5, "health": 1-5 },
  "love": "一段感情/关系建议",
  "career": "一段事业/学习建议",
  "wealth": "一段财运建议",
  "health": "一段身体与情绪建议",
  "luckyColor": "幸运色",
  "luckyNumber": "幸运数字(字符串)",
  "affirmation": "一句适合今天默念的肯定句",
  "cautions": "今天需要留意的事项"
}
所有文本使用中文。`;

    const payload = await chatJSON([
      { role: 'system', content: system },
      { role: 'user', content: user },
    ]);

    await DailyInsight.create({ date, kind: 'horoscope', zodiac, payload });
    res.json(payload);
  } catch (err) {
    next(err);
  }
});

// GET /api/horoscope/forecast?days=5&zodiac=libra
router.get('/forecast', async (req, res, next) => {
  try {
    const days = Math.max(2, Math.min(10, parseInt(req.query.days || '5', 10)));
    const zodiac = (req.query.zodiac || process.env.USER_ZODIAC || 'libra').toLowerCase();
    const cnName = ZODIAC_CN[zodiac] || '天秤座';
    const start = dayjs().format('YYYY-MM-DD');
    const end = dayjs().add(days - 1, 'day').format('YYYY-MM-DD');

    const cacheKey = `forecast-${days}-${zodiac}-${start}`;
    const cached = await DailyInsight.findOne({ date: cacheKey, kind: 'horoscope', zodiac });
    if (cached) return res.json(cached.payload);

    const dateList = Array.from({ length: days }).map((_, i) =>
      dayjs().add(i, 'day').format('YYYY-MM-DD')
    );

    const system = `你是一位温柔而专业的占星师。请为一位${cnName}(${zodiac}) 生成未来 ${days} 天的运势预测。每天都要有节奏上的差别，不要千篇一律。请严格输出 JSON。
${USER_PERSONA_GUIDE}
每天的 actionable 字段必须遵守上面的事业护栏——优先事业推进 / 在职产出 / 技能精进 / 副业最小验证 / 健康投资 / 深度行业人脉；
**绝不**出现：园艺、插花、陶艺、手作、开花店/咖啡馆、去养老院、做义工、裸辞追梦、"好好休息享受当下"等方向；
focus 字段也要对应真实的生活板块（工作 / 副业 / 技能 / 健康 / 人脉 / 财务），不要写"诗意生活 / 内心花园"这种空概念。`;
    const user = `请按顺序给出以下每天的运势：
${dateList.map((d, i) => `${i + 1}. ${d}（${i === 0 ? '今天' : i === 1 ? '明天' : `第 ${i + 1} 天`}）`).join('\n')}

严格返回 JSON：
{
  "zodiac": "${cnName}",
  "start": "${start}",
  "end": "${end}",
  "overview": "对未来${days}天的整体趋势，2-3 句，像一段叙事",
  "days": [
    {
      "date": "YYYY-MM-DD",
      "score": 1-5 整数,
      "theme": "4-8 字的当日主题，例如'宜沉心打磨'",
      "headline": "一句 20-30 字的当日提示",
      "focus": "今日最值得投入的方向（事业/学习/关系/休整 等），一个词",
      "actionable": "可以动手的一件具体小事，20-40 字，动词开头，偏向事业/技能/作品/健康，不要推荐消遣"
    }
  ],
  "bestDay": "YYYY-MM-DD，未来${days}天里能量最高的那天",
  "warnDay": "YYYY-MM-DD 或 null，需要注意的那天"
}
所有文本使用中文。`;

    const payload = await chatJSON([
      { role: 'system', content: system },
      { role: 'user', content: user },
    ], { temperature: 0.85 });

    await DailyInsight.create({ date: cacheKey, kind: 'horoscope', zodiac, payload });
    res.json(payload);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
