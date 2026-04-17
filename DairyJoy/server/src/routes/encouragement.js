const express = require('express');
const dayjs = require('dayjs');
const DailyInsight = require('../models/DailyInsight');
const JoyEntry = require('../models/JoyEntry');
const { chatJSON } = require('../services/openai');
const { USER_PERSONA_GUIDE } = require('../services/persona');

const router = express.Router();

// 口吻库：有些偏"做事"、有些偏"疗愈"、有些就是陪笑。
// 每次随机抽一种，让她既能被看见、被逗笑、被夸，也能在状态好时被轻轻推一把。
const TONES = {
  warm:     '像一位懂你的老朋友，温柔地看见你现在的状态，不急着给任务',
  praise:   '像一位毫不吝啬欣赏你的姐姐，具体地夸赞你已经做到或熬过的事',
  cheer:    '像一位充满能量的队友，用短促有力的话给你鼓劲',
  builder:  '像一位信你的 mentor / 合伙人，在你状态稳时聊目标和产出',
  sober:    '像一位温柔但清醒的姐姐，不说鸡汤，帮你分辨"这件事值不值得在意"',
  funny:    '像一个很会说笑话的好朋友，幽默、俏皮、一句话让你扑哧笑出来',
  cozy:     '像在冬天递来一杯热可可，只是陪你歇一下，不逼你做什么',
  healing:  '像一位温柔的疗愈者，承认你今天的累和委屈，让你允许自己慢下来',
  playful:  '像一个爱逗你的好友，跟你一起吐槽今天糟心的事，再轻轻说"没事，我陪你"',
};

// GET /api/encouragement?refresh=1
// 总是随机挑一种口吻；refresh=1 时强制换一种新的并重新生成
router.get('/', async (req, res, next) => {
  try {
    const date = dayjs().format('YYYY-MM-DD');
    const refresh = req.query.refresh === '1' || req.query.refresh === 'true';
    const excludeTone = (req.query.excludeTone || '').trim();

    let tone;
    if (refresh) {
      // 换一段：挑一个与上次不同的口吻，永远生成新文案
      tone = pickRandomKeyExcept(TONES, excludeTone);
    } else {
      // 首次进入：优先挑当天已经有缓存的口吻，直接返回；否则随机挑一个并生成
      const existing = await DailyInsight.find({ date, kind: 'affirmation' }).lean();
      if (existing.length > 0) {
        const pick = existing[Math.floor(Math.random() * existing.length)];
        return res.json({ ...pick.payload, tone: pick.zodiac, cached: true });
      }
      tone = pickRandomKey(TONES);
    }

    const cacheKey = { date, kind: 'affirmation', zodiac: tone };

    // 拉最近几天的 joy 内容，让 AI 鼓励得更"对人"，而不是套话
    const recent = await JoyEntry.find({ owner: 'me' })
      .sort({ date: -1 })
      .limit(5)
      .lean();
    const recentText = recent
      .map((e) => `【${e.date}】${(e.joys || []).map((j) => j.text).filter(Boolean).join('；') || '（未记录）'}`)
      .join('\n');

    const system = `你是 Joy Diary 里的 AI 陪伴师"小悦"，给用户写一段走心的话。
${USER_PERSONA_GUIDE}
【本次这段话的风格】
${TONES[tone]}。

【本段文案的硬性要求】
1. 中文。真诚、有画面感；不说教、不鸡汤、不空洞的"加油哦"；
2. 如果提供了她最近记录的开心小事：挑 1 件具体回应，让她感到"被看见"；
   - 如果是纯消遣类（刷剧、逛街）：不要批评，就轻轻承认"这种松弛本身也重要"，只有当这在她记录里反复出现时才温柔提一嘴；
   - 如果是看似美好但会延缓自立的方向（把园艺/插花/手作当事业、频繁做义工）：温柔承认动机，**不直接否定**，以"先照顾好自己，再去照顾别人"的方式带过；
   - 如果是有意义的产出（工作进展、技能学习、运动、作品、面试、谈判）：放大它、具体地夸她；
   - 如果看起来她最近挺累 / 沮丧：这一段就以**陪伴和肯定**为主，action 可以只是"今天早睡 / 去走 20 分钟 / 给自己做顿好吃的"；
3. 鼓励/夸赞必须**具体**——落在一个品质、一个行为、一个已经发生的动作上；
4. action 不一定要是事业任务。可以是：
   - 做事类："写一段 draft / 回一封邮件 / 复盘这周 / 学 20 分钟 XX"；
   - 照顾自己类："今天 11 点前睡 / 公园走 20 分钟 / 煮一顿喜欢的饭 / 给妈妈打个电话 / 泡个澡"；
   都可以，**根据这段消息的口吻选择**。但不要推"开花店/裸辞/天天去养老院"等硬护栏禁止的方向，也不要推纯逃避式消耗（"刷 5 小时短视频放空"）。
5. 总长度 100-180 字；
6. 最后给一句 quote：可以有力量、可以温柔、可以俏皮，**只要不是漂浮的空话**就好。

【严格按此 JSON 输出】
{
  "title": "4-10 字的小标题",
  "message": "主段落正文，100-180 字，按上面规则写",
  "action": "今天就能做的一件具体小事，15-40 字，动词开头；做事类或照顾自己类均可",
  "quote": "一句有力量或温柔的话，20 字以内",
  "hashtags": ["2-3 个 tag，不要带 #；主题可以是做事/产出/疗愈/陪伴/松弛，根据口吻选"]
}`;

    const user = `今天是 ${date}。${recent.length ? `以下是我最近记录的一些开心小事，请阅读并按上面的规则回应——先看见我，再根据当前口吻决定是陪我放松还是轻轻推我一下：\n${recentText}` : '用户今天还没记录任何内容。请送一段话：先温柔地看见她，再根据你此次的口吻，决定是陪她松一下，还是给她一件能开始的小事。'}`;

    const payload = await chatJSON([
      { role: 'system', content: system },
      { role: 'user', content: user },
    ], { temperature: 0.95 });

    await DailyInsight.findOneAndUpdate(
      cacheKey,
      { $set: { payload } },
      { upsert: true, new: true }
    );

    res.json({ ...payload, tone, cached: false });
  } catch (err) {
    next(err);
  }
});

function pickRandomKey(obj) {
  const keys = Object.keys(obj);
  return keys[Math.floor(Math.random() * keys.length)];
}

function pickRandomKeyExcept(obj, except) {
  const keys = Object.keys(obj).filter((k) => k !== except);
  if (keys.length === 0) return pickRandomKey(obj);
  return keys[Math.floor(Math.random() * keys.length)];
}

module.exports = router;
