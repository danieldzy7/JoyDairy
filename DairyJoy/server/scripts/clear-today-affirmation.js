require('dotenv').config();
const mongoose = require('mongoose');
const dayjs = require('dayjs');
const DailyInsight = require('../src/models/DailyInsight');

// 清除今天的所有 AI 缓存（鼓励语 / 当日运势 / 未来几天预测 / 万年历贴士）
(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: 'joydiary' });
  const today = dayjs().format('YYYY-MM-DD');

  // 1. 今天生成的 affirmation/horoscope/almanac
  const directToday = await DailyInsight.deleteMany({
    date: { $in: [today] },
  });

  // 2. forecast 缓存的 date 是 "forecast-5-libra-YYYY-MM-DD" 形式，前缀匹配
  const forecasts = await DailyInsight.deleteMany({
    date: { $regex: `^forecast-.*-${today}$` },
  });

  console.log(`Cleared ${directToday.deletedCount} daily caches + ${forecasts.deletedCount} forecast caches for ${today}`);
  await mongoose.disconnect();
})();
