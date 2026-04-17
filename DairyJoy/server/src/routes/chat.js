const express = require('express');
const ChatMessage = require('../models/ChatMessage');
const { chatCompletion } = require('../services/openai');
const { USER_PERSONA_GUIDE } = require('../services/persona');

const router = express.Router();

const SYSTEM_PROMPT = `你是 Joy Diary 里的 AI 陪伴师，名字叫"小悦"。
用户资料：生日 1989-10-04，天秤座。
${USER_PERSONA_GUIDE}
【作为"聊天陪伴师"的额外行为规则】
1. **先读情绪，再决定要不要给方向**。严格遵守上面【情绪优先原则】。
   - 她明显累 / 丧 / 难过 / 委屈 / 烦 → 这一轮**只陪伴、只共情、只夸她**，不给任何 action，不引导到事业。
   - 她在分享小确幸 / 撒娇 / 吐槽 / 闲聊 → 陪她笑、陪她骂、陪她开心，不必引回"那你今天做点啥"。
   - 她平稳 / 主动问方向 → 才给**一件**很小、30 分钟能起步的事，不堆多任务。

2. **疗愈、开心、偷懒都是正当主题**。当她想歇、想玩、想犒劳自己：大方鼓励她早睡/散步/看电影/煮顿好吃的/买束花/泡澡/发呆。
   只在看到"逃避式消耗"（连刷 5 小时短视频 / 报复性熬夜 / 暴食）时，温柔地提一个更舒服的替代，不评判。

3. **她问事业/方向/要不要辞职/学什么/做什么副业时**，按【事业硬性护栏】温柔地守住底线：
   - 提到想学园艺/插花/烘焙/陶艺 → 作为纯爱好充分肯定；只在她把它当"事业方向"时，才轻轻提一句变现和就业面的现实；不要每次都拽回"那你本职在做什么"。
   - 提到想开花店/咖啡馆/书店/民宿 → 不含糊地说清现实（房租、毛利、回本周期），建议先用已有技能做在线轻资产验证；语气是关心不是否定。
   - 说想裸辞追梦 → 先问她储蓄能撑多久，建议"在职搭桥"而不是裸辞。
   - 说想频繁做义工/捐款/去养老院 → 承认善意，建议放到年度 1-2 次节奏，把今年的主线先走稳。

4. **输出**：中文，默认简短（2–5 句）；不要每条回复都带粗体 action；
   只有她情绪平稳且确实需要方向时，再用一行 bullet 给**一个**具体小动作。
   涉及星座、万年历、心理、投资、职业时，可以给专业具体的回答。

5. **核心基调**：先让她今天觉得被好好陪过、被看见、被逗笑，再谈明天去做什么。
   节奏宁可慢一点，不要每句都在推她。`;

// GET /api/chat?conversationId=default
router.get('/', async (req, res, next) => {
  try {
    const conversationId = req.query.conversationId || 'default';
    const msgs = await ChatMessage.find({ owner: 'me', conversationId })
      .sort({ createdAt: 1 })
      .limit(200)
      .lean();
    res.json(msgs);
  } catch (err) {
    next(err);
  }
});

// POST /api/chat  { message, conversationId? }
router.post('/', async (req, res, next) => {
  try {
    const { message, conversationId = 'default' } = req.body || {};
    if (!message || !String(message).trim()) {
      return res.status(400).json({ error: '消息不能为空' });
    }

    await ChatMessage.create({ conversationId, role: 'user', content: message });

    const history = await ChatMessage.find({ owner: 'me', conversationId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    const ordered = history.reverse();

    const reply = await chatCompletion(
      [
        { role: 'system', content: SYSTEM_PROMPT },
        ...ordered.map((m) => ({ role: m.role, content: m.content })),
      ],
      { temperature: 0.9 }
    );

    const saved = await ChatMessage.create({ conversationId, role: 'assistant', content: reply });

    res.json({ reply, message: saved });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/chat  -> 清空对话
router.delete('/', async (req, res, next) => {
  try {
    const conversationId = req.query.conversationId || 'default';
    await ChatMessage.deleteMany({ owner: 'me', conversationId });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
