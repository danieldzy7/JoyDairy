const express = require('express');
const dayjs = require('dayjs');
const Ritual = require('../models/Ritual');
const { chatJSON, chatCompletion } = require('../services/openai');
const { USER_PERSONA_GUIDE } = require('../services/persona');

const router = express.Router();

const LEVELS = [
  { id: 'great',    cn: '上上签', weight: 1,  luckyDelta: 8,  accent: '#e8a93f' },
  { id: 'good',     cn: '上签',   weight: 3,  luckyDelta: 5,  accent: '#e58a7b' },
  { id: 'fair',     cn: '中签',   weight: 5,  luckyDelta: 2,  accent: '#b79cd9' },
  { id: 'neutral',  cn: '平签',   weight: 3,  luckyDelta: 1,  accent: '#7aa694' },
  { id: 'caution',  cn: '下签',   weight: 1,  luckyDelta: 0,  accent: '#8a8399' },
];

function weightedPick(items) {
  const total = items.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (const it of items) {
    r -= it.weight;
    if (r <= 0) return it;
  }
  return items[items.length - 1];
}

// POST /api/rituals/draw -> 电子抽签
router.post('/draw', async (req, res, next) => {
  try {
    const date = dayjs().format('YYYY-MM-DD');
    const level = weightedPick(LEVELS);
    const { question = '' } = req.body || {};

    const system = `你是一位修行多年的东方签诗老师，兼具现代心理学与职业规划智慧。用户来抽一支电子签。
${USER_PERSONA_GUIDE}
【本次签文的结构】
1) 一首 4 句的签诗，每句 5-7 字，古典意象，但不封建迷信；
2) 简短白话解读（60-120 字），结合用户所问的事，翻译到现代生活语境；
3) 一条今天可以落地的具体小行动 guidance（15-40 字，动词开头），严格按上面"事业护栏"+"动作建议风格"——**绝不**出现：园艺/插花/手作/开花店/开咖啡馆/做义工/去养老院/捐款/纯消遣/"好好休息"。

用户此次抽到的是：**${level.cn}**（${level.id}）。请按这个等级的基调来写——${level.cn}要呼应这个吉凶程度，即便下签也要给出建设性的转化路径（通常是"稳住本职、不要贸然行动、把基本盘做扎实"），而不是恐吓。

${question ? `用户今天想问的事：${question}` : '用户没有具体问题，请给一段与她事业推进、在职表现、副业最小验证、或技能精进相关的今日指引。'}

严格输出 JSON：
{
  "level": "${level.id}",
  "levelCn": "${level.cn}",
  "title": "4-8 字的签名",
  "poem": ["4 行签诗，每行一个字符串"],
  "interpretation": "白话解读，60-120 字",
  "guidance": "今天就能做的一件具体事，15-40 字",
  "keywords": ["2-3 个关键词，不要带 #"]
}`;

    const payload = await chatJSON([
      { role: 'system', content: system },
      { role: 'user', content: question || '请给我今日的一支签。' },
    ], { temperature: 0.95 });

    const doc = await Ritual.create({
      date,
      kind: 'draw',
      luckyDelta: level.luckyDelta,
      payload: { ...payload, accent: level.accent, question },
    });

    res.json({
      id: doc._id,
      ...payload,
      accent: level.accent,
      luckyDelta: level.luckyDelta,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/rituals/incense  -> 赛博烧香
router.post('/incense', async (req, res, next) => {
  try {
    const { wish = '' } = req.body || {};
    if (!wish || !String(wish).trim()) {
      return res.status(400).json({ error: '请先写下你想祈愿的事' });
    }
    const date = dayjs().format('YYYY-MM-DD');

    const system = `你是一位温柔但清醒的引路人。用户在"赛博烧香"功能里写下一个心愿。
${USER_PERSONA_GUIDE}
【本次回应的结构】
1) 用 2-3 句走心的话"接住"这个心愿——不是批判、不是鸡汤；
2) 把它转化为"可以靠她自己推进的具体小步骤" 1-2 条（每条 20-40 字，动词开头），严格按上面"事业护栏"+"动作建议风格"写；
3) 最后一句祝福，像咒语或短诗，一行不超过 20 字，要**有力量且脚踏实地**，不要"慢下来 / 顺其自然"这种漂浮句子。

特别注意：
- 如果她的心愿是"开花店/咖啡馆/书店/民宿"等浪漫但不切实际的创业：第 2 步要**温柔但明确地**把她引回"先在现有工作/技能上做最小验证、积累作品和现金流"；
- 如果她的心愿是"去帮助别人/做义工/公益"：承认善意，同时建议她"先让自己站稳，用专业能力帮助同行比泛化的善行更有复利"。

严格输出 JSON：
{
  "echo": "接住她心愿的那几句话",
  "steps": ["具体步骤 1", "具体步骤 2"],
  "blessing": "一句祝福"
}`;

    const payload = await chatJSON([
      { role: 'system', content: system },
      { role: 'user', content: `我的心愿：${wish}` },
    ], { temperature: 0.85 });

    const doc = await Ritual.create({
      date,
      kind: 'incense',
      luckyDelta: 3,
      payload: { wish, ...payload },
    });

    res.json({ id: doc._id, wish, ...payload, luckyDelta: 3 });
  } catch (err) {
    next(err);
  }
});

// POST /api/rituals/muyu   敲一下木鱼 +1 幸运值
// body: { count: 本次合并上传的下数，默认 1 }
router.post('/muyu', async (req, res, next) => {
  try {
    const date = dayjs().format('YYYY-MM-DD');
    const count = Math.max(1, Math.min(999, parseInt(req.body?.count || 1, 10)));

    const doc = await Ritual.create({
      date,
      kind: 'muyu',
      luckyDelta: count,
      payload: { count },
    });

    // 计算今日累计木鱼下数，用于 108 彩蛋
    const todayAll = await Ritual.find({ owner: 'me', date, kind: 'muyu' }).lean();
    const todayTotal = todayAll.reduce((s, r) => s + (r.payload?.count || r.luckyDelta || 0), 0);

    let blessing = null;
    if (todayTotal >= 108 && todayTotal - count < 108) {
      // 刚跨过 108
      try {
        blessing = await chatCompletion(
          [
            {
              role: 'system',
              content:
                `用户今天刚敲满 108 下木鱼。给她写一段 60 字以内温柔但清醒的祝福，落在"通过今天做一件具体能产出/能挣钱/能推进事业的事来让自己走出来"上。\n` +
                `绝不能推荐：园艺/插花/手作/开花店/开咖啡馆/义工/捐款/纯休息。\n` +
                `只输出那段话本身，不要引号。`,
            },
            { role: 'user', content: '请赐我一段话。' },
          ],
          { temperature: 0.9 }
        );
      } catch (_) { /* ignore */ }
    }

    res.json({ id: doc._id, luckyDelta: count, todayTotal, blessing });
  } catch (err) {
    next(err);
  }
});

// GET /api/rituals?date=YYYY-MM-DD  或 /api/rituals/by-date/:date
router.get('/', async (req, res, next) => {
  try {
    const query = { owner: 'me' };
    if (req.query.date) query.date = req.query.date;
    if (req.query.kind) query.kind = req.query.kind;
    const list = await Ritual.find(query).sort({ createdAt: -1 }).limit(200).lean();
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// GET /api/rituals/stats  返回今日幸运值 / 累计幸运值 / 按日期聚合
router.get('/stats', async (_req, res, next) => {
  try {
    const today = dayjs().format('YYYY-MM-DD');
    const all = await Ritual.find({ owner: 'me' }).lean();

    const totalLucky = all.reduce((s, r) => s + (r.luckyDelta || 0), 0);

    const todayList = all.filter((r) => r.date === today);
    const todayLucky = todayList.reduce((s, r) => s + (r.luckyDelta || 0), 0);
    const todayMuyu = todayList
      .filter((r) => r.kind === 'muyu')
      .reduce((s, r) => s + (r.payload?.count || r.luckyDelta || 0), 0);
    const todayDraws = todayList.filter((r) => r.kind === 'draw').length;
    const todayIncense = todayList.filter((r) => r.kind === 'incense').length;
    const todayBuddha = todayList.filter((r) => r.kind === 'buddha').length;

    // 按日期聚合（最近 30 天）
    const byDate = {};
    for (const r of all) {
      byDate[r.date] = (byDate[r.date] || 0) + (r.luckyDelta || 0);
    }
    const recent = Object.entries(byDate)
      .sort(([a], [b]) => (a < b ? 1 : -1))
      .slice(0, 30)
      .map(([date, lucky]) => ({ date, lucky }));

    res.json({
      today,
      totalLucky,
      todayLucky,
      todayMuyu,
      todayDraws,
      todayIncense,
      todayBuddha,
      recent,
    });
  } catch (err) {
    next(err);
  }
});

// ========== 佛说 ==========
const SUTRA_SEEDS = [
  { text: '应无所住而生其心。',              source: '《金刚经》' },
  { text: '一切有为法，如梦幻泡影，如露亦如电，应作如是观。', source: '《金刚经》' },
  { text: '心若无事，万法自如。',            source: '禅宗语录' },
  { text: '一念放下，万般自在。',            source: '禅宗语录' },
  { text: '精进不退，是名真勇。',            source: '《大般涅槃经》' },
  { text: '勤修戒定慧，熄灭贪嗔痴。',        source: '佛家格言' },
  { text: '不忘初心，方得始终。',            source: '《华严经》' },
  { text: '诸行无常，是生灭法。',            source: '《涅槃经》' },
  { text: '一切众生，皆具如来智慧德相，但因妄想执着，不能证得。', source: '《华严经》' },
  { text: '行到水穷处，坐看云起时。',        source: '王维（禅意诗）' },
  { text: '菩提本无树，明镜亦非台；本来无一物，何处惹尘埃。', source: '六祖惠能' },
  { text: '若能转物，即同如来。',            source: '《楞严经》' },
  { text: '人生如逆旅，我亦是行人。',        source: '苏轼（禅意词）' },
  { text: '万法皆空，因果不空。',            source: '印光法师' },
  { text: '种如是因，收如是果；一切唯心造。',  source: '《华严经》' },
  { text: '心随万境转，转处实能幽。',        source: '《楞伽经》' },
  { text: '以戒为师，以苦为师。',            source: '佛陀遗教' },
  { text: '但行好事，莫问前程。',            source: '《增广贤文》（禅意）' },
];

function pickSutra() {
  return SUTRA_SEEDS[Math.floor(Math.random() * SUTRA_SEEDS.length)];
}

// POST /api/rituals/buddha  { question? }  -> 请一段佛说
router.post('/buddha', async (req, res, next) => {
  try {
    const { question = '' } = req.body || {};
    const date = dayjs().format('YYYY-MM-DD');
    const sutra = pickSutra();

    const system = `你是一位温柔而通达的现代居士，熟悉佛法但不迷信，擅长把经文翻译成当代人听得懂、用得上的生活指引。
${USER_PERSONA_GUIDE}

【本次"佛说"的写法】
我会给你一句经典的佛家 / 禅宗原文，你要：
1) 保留原文（**不要改动一个字**），附上出处；
2) 用现代白话做一段 80-150 字的解读，紧扣原文但不装玄虚；
3) 结合用户的处境（或她的问题）给一条"**今天要放下什么 / 今天要做什么**"的落地指引，严格遵守上面的事业护栏——要把她推去做**真正能自立、能复利**的事，**不要**推荐园艺/开店/义工/漫无目的休息；
4) 最后一句"偈语"（gatha）：4-14 字的点睛短句，有力量且脚踏实地。

严格输出 JSON：
{
  "sutra": "原文，保持不变",
  "source": "出处",
  "modern": "80-150 字白话解读",
  "letGo": "一件今天可以放下的事（常见方向：放下对未来的焦虑 / 放下'学个兴趣当事业'的幻想 / 放下对他人评价的过度在意 / 放下'等状态好再开始'的拖延）",
  "doNow": "一件今天就能做的具体小事，15-40 字，动词开头，严格符合事业护栏",
  "gatha": "4-14 字的收尾短句"
}`;

    const user = `原文：${sutra.text}
出处：${sutra.source}
${question ? `用户今天想请教的事：${question}` : '用户没有具体问题，请给一段通用的今日点拨，落在"做事让自己走出来"的方向上。'}`;

    const payload = await chatJSON([
      { role: 'system', content: system },
      { role: 'user', content: user },
    ], { temperature: 0.85 });

    const doc = await Ritual.create({
      date,
      kind: 'buddha',
      luckyDelta: 2,
      payload: { ...payload, question },
    });

    res.json({ id: doc._id, ...payload, luckyDelta: 2 });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
