const express = require('express');
const dayjs = require('dayjs');
const DailyInsight = require('../models/DailyInsight');
const { getAlmanacForDate } = require('../services/almanac');
const { chatJSON } = require('../services/openai');
const { USER_PERSONA_GUIDE } = require('../services/persona');

const router = express.Router();

// GET /api/almanac?date=YYYY-MM-DD
router.get('/', async (req, res, next) => {
  try {
    const date = req.query.date || dayjs().format('YYYY-MM-DD');
    const base = getAlmanacForDate(date);

    const cached = await DailyInsight.findOne({ date, kind: 'almanac', zodiac: '' });
    if (cached) return res.json({ ...base, ai: cached.payload });

    const system = `你是一位精通中国传统万年历、黄历文化的老师，同时会用现代心理学、生活建议把黄历内容翻译成让年轻人读得懂的"今日小贴士"。避免封建迷信色彩，语气平和温柔。严格输出 JSON。
${USER_PERSONA_GUIDE}
在翻译"宜 / 忌 / 提醒 / 情绪建议"时，严格遵守上面的事业护栏：
- suitableToday：**优先**翻成"适合沟通工作 / 推进一份文档 / 面试 / 复盘 / 联系行业前辈 / 整理财务 / 运动"等脚踏实地方向；**绝不**翻成"适合插花 / 手作 / 逛花市 / 去做义工"；
- avoidToday：可以翻成"避免冲动辞职 / 避免做大额消费决定 / 避免无目的消耗时间"等；
- reminders 与 moodTip：落在"身体健康、早睡、今天推进一件有产出的小事"上，**不要**写"慢下来享受当下 / 去养老院温暖他人"等。`;

    const user = `以下是 ${date} 的黄历原始数据：
农历：${base.lunar.year}年${base.lunar.month}${base.lunar.day}（${base.lunar.yearGanZhi}年·属${base.lunar.zodiac}）
日干支：${base.lunar.dayGanZhi}    节气：${base.jieQi || '无'}
建除十二神：${base.jcTwelve}    二十八宿：${base.xingXiu}
冲煞：${base.chongSha}
宜：${(base.yi || []).join('、') || '无'}
忌：${(base.ji || []).join('、') || '无'}
彭祖百忌：${base.pengZuGan}；${base.pengZuZhi}
喜神方位：${base.xiShen}   财神方位：${base.caiShen}   福神方位：${base.fuShen}

请返回 JSON：
{
  "summary": "用 1-2 句温柔现代的话概括今天的整体节奏",
  "suitableToday": ["挑 3-4 条'宜'，并翻译为现代生活语言，例如 '适合沟通重要的事 / 整理房间'"],
  "avoidToday": ["挑 3-4 条'忌'，同样翻译为现代语言"],
  "reminders": ["3-5 条贴心的生活/身心小提醒"],
  "moodTip": "一句给情绪的温柔建议"
}
所有字段使用中文。`;

    const ai = await chatJSON([
      { role: 'system', content: system },
      { role: 'user', content: user },
    ]);

    await DailyInsight.create({ date, kind: 'almanac', zodiac: '', payload: ai });
    res.json({ ...base, ai });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
