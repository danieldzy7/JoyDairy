const express = require('express');
const dayjs = require('dayjs');
const JoyEntry = require('../models/JoyEntry');
const { chatCompletion, chatJSON } = require('../services/openai');
const { USER_PERSONA_GUIDE } = require('../services/persona');

const router = express.Router();

function today() {
  return dayjs().format('YYYY-MM-DD');
}

// GET /api/entries?limit=30
router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '60', 10), 365);
    const list = await JoyEntry.find({ owner: 'me' })
      .sort({ date: -1 })
      .limit(limit)
      .lean();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// GET /api/entries/:date
router.get('/:date', async (req, res, next) => {
  try {
    const entry = await JoyEntry.findOne({ owner: 'me', date: req.params.date }).lean();
    res.json(entry || null);
  } catch (err) {
    next(err);
  }
});

// PUT /api/entries/:date  (upsert)
router.put('/:date', async (req, res, next) => {
  try {
    const date = req.params.date || today();
    const { joys = [], mood = 3, reflection = '', gratitude = '' } = req.body || {};
    const cleaned = (joys || [])
      .map((j) => (typeof j === 'string' ? { text: j } : j))
      .filter((j) => j && j.text && j.text.trim())
      .slice(0, 5)
      .map((j) => ({ text: String(j.text).trim(), tag: j.tag || '' }));

    const entry = await JoyEntry.findOneAndUpdate(
      { owner: 'me', date },
      { $set: { joys: cleaned, mood, reflection, gratitude } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(entry);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/entries/:date
router.delete('/:date', async (req, res, next) => {
  try {
    await JoyEntry.deleteOne({ owner: 'me', date: req.params.date });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// POST /api/entries/polish  -> 把用户粗略写的一句话润色成更有画面感的表达
router.post('/polish', async (req, res, next) => {
  try {
    const { text = '', style = 'warm' } = req.body || {};
    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: '请先写一点内容再润色' });
    }

    const styleHint = {
      warm: '温暖治愈、有画面感',
      poetic: '略带诗意、但不做作',
      short: '精炼克制、短句',
      playful: '俏皮可爱、轻松',
    }[style] || '温暖治愈、有画面感';

    const system = `你是一位中文写作助手，擅长把用户随手记录的"开心的小事"润色得更生动、更有画面感。规则：
1. 严格保留用户原意，不要添加用户没提到的事实、人物、地点；
2. 风格：${styleHint}；
3. 控制在 40 字以内，一句话即可；
4. 只输出润色后的那一句话，不要任何解释、引号或前缀。`;

    const { chatCompletion } = require('../services/openai');
    const polished = await chatCompletion(
      [
        { role: 'system', content: system },
        { role: 'user', content: String(text).trim() },
      ],
      { temperature: 0.75 }
    );

    res.json({ text: String(polished).trim().replace(/^["'「]|["'」]$/g, '') });
  } catch (err) {
    next(err);
  }
});

// POST /api/entries/:date/reflect  -> 让 AI 根据当天 3 件事给出一段疗愈反馈
router.post('/:date/reflect', async (req, res, next) => {
  try {
    const entry = await JoyEntry.findOne({ owner: 'me', date: req.params.date }).lean();
    if (!entry || !entry.joys?.length) {
      return res.status(400).json({ error: '该日期还没有记录开心事' });
    }

    const system = `你是"小悦"——Joy Diary 里温柔但清醒的陪伴师。用户每天记录 3 件开心的事，你需要给她一段回信。
${USER_PERSONA_GUIDE}
【这段回信的结构】
1. 开头 2-3 句**先好好地"看见"她今天**——具体、有温度，不要套话：
   - 有工作/学习/运动/产出/深度关系相关的事 → 放大并肯定；
   - 都是小确幸（吃的、喝的、逛的、看剧、养花）→ 就大方肯定"能感受到这些是很好的事"，不要急着点醒她"这不够让你走出来"；
   - 出现做义工/捐款/帮他人 → 承认善意；只有她密集重复这类行为时，才温柔提一嘴"先照顾好自己再照顾别人"，其他时候不提；
   - mood 低 / reflection 里有难过的话 → 本次回信**以陪伴为主**，不强行给方向；
2. 提炼 1 个值得继续的模式——可以是"产出复利"，也可以是"允许自己开心"、"照顾好自己的身体"、"和重要的人保持联系"。不是每次都非要绑在事业上；
3. 结尾给 1 条**明天可以做的小事**：
   - 她状态平稳 → 给一件做事类小动作（工作/学习/作品/邮件/复盘）；
   - 她状态低或疲惫 → 给一件照顾自己类小动作（早睡/走一走/吃顿好的/发条消息给想念的人）；
   - **不要**推"开花店/裸辞/天天做义工/把兴趣强行当事业"这些硬护栏禁止的方向；
4. 语气温柔、清醒、有分寸；140-200 字；中文。`;

    const userMsg = `日期：${entry.date}\n心情评分：${entry.mood}/5\n今天开心的事：\n${entry.joys
      .map((j, i) => `${i + 1}. ${j.text}`)
      .join('\n')}${entry.reflection ? `\n我的自我反思：${entry.reflection}` : ''}`;

    const text = await chatCompletion(
      [
        { role: 'system', content: system },
        { role: 'user', content: userMsg },
      ],
      { temperature: 0.85 }
    );

    res.json({ reflection: text });
  } catch (err) {
    next(err);
  }
});

// POST /api/entries/:date/summary  -> 结构化的今日总结 + 分析 + 推荐
router.post('/:date/summary', async (req, res, next) => {
  try {
    const entry = await JoyEntry.findOne({ owner: 'me', date: req.params.date }).lean();
    if (!entry || !entry.joys?.length) {
      return res.status(400).json({ error: '先写几件开心的事，小悦才能帮你总结哦' });
    }

    // 拉最近 7 天做一点"跨天观察"，让建议更懂她
    const recent = await JoyEntry.find({ owner: 'me' })
      .sort({ date: -1 })
      .limit(7)
      .lean();
    const recentText = recent
      .filter((e) => e.date !== entry.date)
      .map(
        (e) =>
          `【${e.date}·心情${e.mood || '-'}/5】${(e.joys || [])
            .map((j) => j.text)
            .filter(Boolean)
            .join('；') || '（无）'}`
      )
      .join('\n');

    const system = `你是"小悦"——Joy Diary 里温柔且中肯的陪伴师。
用户记录完今天的开心事后，请你给她一份**结构化的今日总结**：既有温度，也有洞察，既被看见，也能得到一点可行的方向。
${USER_PERSONA_GUIDE}

【这份总结的基调】
- **中肯**：诚实地看见好的部分，也不回避值得调整的地方；不奉承、不鸡汤、不说教；
- **温暖**：像一位很懂她、心疼她的姐姐在复盘今天，不冷硬、不像点评老师；
- **分寸感**：根据她今天的 mood 和文字密度来调节——状态低就多陪伴少建议，状态稳就多给一点方向；
- **推荐要混合**：做事类和照顾自己类都要有，**不要**全部都推她去干活，也**不要**全部都推她去躺平；根据她今天的状态拿捏比例。

【严格输出 JSON，不要任何额外文字】
{
  "gist": "一句话总结今天（20-35 字，具体、有画面感）",
  "vibe": "今天整体氛围的 2-6 字形容（例如：平稳而满足 / 有点累但温柔 / 小小充电日 / 被工作拉扯的一天）",
  "highlights": [
    { "text": "直接复述或凝练她记录里的某件事", "why": "这件事为什么值得被记住（1 句，具体、不空泛）" }
    // 1-3 条；从她今天真正记录的内容里来，**不要编造**
  ],
  "patterns": [
    "从今天 + 最近几天的记录里看出的 1-2 条模式/倾向，中肯温柔；可以是好的模式（'最近你越来越会为自己安排小奖励'），也可以是需要留意的模式（'这周都写到很晚才睡'）。**没有足够信息时就留空数组**。"
  ],
  "gentleNotes": [
    "1-2 条温柔的提醒或观察；口吻是姐姐式的关心，不是评判。举例：'今天三件事都是关于别人的，我想先问问你自己呢？' / '连续几天都很赶，要不要给自己留半小时什么都不做？' 没必要就留空数组。"
  ],
  "recommendations": [
    { "kind": "self-care" 或 "action", "text": "一条具体建议，15-40 字，动词开头，30 分钟内可开始" }
    // 2-3 条；**混合搭配**——如果她今天状态累/丧，就多放 self-care；状态稳就可以放 1 条 action + 1 条 self-care；
    // action 类遵守事业护栏，不要推开花店/裸辞/天天义工；self-care 类可以是早睡/散步/煮饭/给妈妈打电话/看一部电影；
  ],
  "closing": "一句 15-30 字的温暖收尾，给她今晚一点安心感；可以俏皮、可以踏实、可以温柔，但不要空话"
}`;

    const todayText = `日期：${entry.date}
心情：${entry.mood || '-'}/5
今天开心的事：
${entry.joys.map((j, i) => `${i + 1}. ${j.text}`).join('\n')}${entry.reflection ? `\n自我反思：${entry.reflection}` : ''}${entry.gratitude ? `\n感恩：${entry.gratitude}` : ''}`;

    const userMsg = `${todayText}${recentText ? `\n\n最近几天的记录（供你观察跨天模式，不必逐条回应）：\n${recentText}` : ''}`;

    const payload = await chatJSON(
      [
        { role: 'system', content: system },
        { role: 'user', content: userMsg },
      ],
      { temperature: 0.85 }
    );

    res.json(payload);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
