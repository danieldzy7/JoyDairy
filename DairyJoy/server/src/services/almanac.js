const { Solar } = require('lunar-javascript');

// 给定 YYYY-MM-DD，返回该天的中国万年历结构化信息
function getAlmanacForDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const solar = Solar.fromYmd(y, m, d);
  const lunar = solar.getLunar();

  return {
    date: dateStr,
    solar: {
      year: solar.getYear(),
      month: solar.getMonth(),
      day: solar.getDay(),
      week: '星期' + '日一二三四五六'[solar.getWeek()],
    },
    lunar: {
      year: lunar.getYearInChinese(),
      month: lunar.getMonthInChinese() + '月',
      day: lunar.getDayInChinese(),
      yearGanZhi: lunar.getYearInGanZhi(),
      monthGanZhi: lunar.getMonthInGanZhi(),
      dayGanZhi: lunar.getDayInGanZhi(),
      zodiac: lunar.getYearShengXiao(),
    },
    jieQi: lunar.getJieQi() || lunar.getPrevJieQi()?.getName() || '',
    yi: lunar.getDayYi() || [], // 宜
    ji: lunar.getDayJi() || [], // 忌
    chongSha: lunar.getDayChongDesc?.() || '',
    pengZuGan: lunar.getPengZuGan?.() || '',
    pengZuZhi: lunar.getPengZuZhi?.() || '',
    xiShen: lunar.getDayPositionXiDesc?.() || '',
    caiShen: lunar.getDayPositionCaiDesc?.() || '',
    fuShen: lunar.getDayPositionFuDesc?.() || '',
    jcTwelve: lunar.getDayJianChu?.() || '',
    xingXiu: lunar.getDayXiu?.() || '',
  };
}

module.exports = { getAlmanacForDate };
