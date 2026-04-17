const mongoose = require('mongoose');

// 缓存当天的星座 / 万年历解读，避免重复消耗 OpenAI 额度
const DailyInsightSchema = new mongoose.Schema(
  {
    date: { type: String, required: true, index: true }, // YYYY-MM-DD
    kind: { type: String, enum: ['horoscope', 'almanac'], required: true, index: true },
    zodiac: { type: String, default: '' },
    payload: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

DailyInsightSchema.index({ date: 1, kind: 1, zodiac: 1 }, { unique: true });

module.exports = mongoose.model('DailyInsight', DailyInsightSchema);
