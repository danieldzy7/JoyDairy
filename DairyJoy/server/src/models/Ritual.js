const mongoose = require('mongoose');

// 赛博禅房仪式记录：抽签 / 烧香 / 敲木鱼
const RitualSchema = new mongoose.Schema(
  {
    owner: { type: String, default: 'me', index: true },
    date: { type: String, required: true, index: true }, // YYYY-MM-DD
    kind: { type: String, enum: ['draw', 'incense', 'muyu', 'buddha'], required: true, index: true },
    luckyDelta: { type: Number, default: 0 },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
    // 针对不同 kind 的语义：
    //  draw:     { level, title, poem, interpretation, guidance }
    //  incense:  { wish, echo }
    //  muyu:     { count: 这条记录里累计敲了多少下 }
  },
  { timestamps: true }
);

RitualSchema.index({ owner: 1, date: 1, kind: 1 });

module.exports = mongoose.model('Ritual', RitualSchema);
