import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';

const WEEK_CN = ['日', '一', '二', '三', '四', '五', '六'];
const MOOD_EMOJI = ['', '😔', '😕', '🙂', '😊', '🤩'];

/**
 * 月份日历
 *
 * @param {object}   props
 * @param {string}   props.selected        YYYY-MM-DD
 * @param {function} props.onSelect        (date) => void
 * @param {Array}    props.entries         后端返回的 entry 列表 (date, mood, joys)
 */
export default function Calendar({ selected, onSelect, entries = [] }) {
  const [cursor, setCursor] = useState(dayjs(selected || undefined).startOf('month'));

  const entryMap = useMemo(() => {
    const m = {};
    for (const e of entries) m[e.date] = e;
    return m;
  }, [entries]);

  const days = useMemo(() => {
    const startOfMonth = cursor.startOf('month');
    const startWeekday = startOfMonth.day(); // 0 (Sun) ~ 6 (Sat)
    const gridStart = startOfMonth.subtract(startWeekday, 'day');
    return Array.from({ length: 42 }).map((_, i) => gridStart.add(i, 'day'));
  }, [cursor]);

  const today = dayjs().format('YYYY-MM-DD');
  const selectedKey = selected;

  const prev = () => setCursor((c) => c.subtract(1, 'month'));
  const next = () => setCursor((c) => c.add(1, 'month'));
  const goToday = () => {
    const now = dayjs();
    setCursor(now.startOf('month'));
    onSelect?.(now.format('YYYY-MM-DD'));
  };

  return (
    <motion.div className="card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="cal-head">
        <button className="btn ghost mini" onClick={prev} title="上个月">‹</button>
        <div className="cal-title">
          <div className="kicker">Calendar</div>
          <h3 style={{ margin: 0 }}>
            {cursor.format('YYYY 年 M 月')}
          </h3>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn ghost mini" onClick={goToday}>今天</button>
          <button className="btn ghost mini" onClick={next} title="下个月">›</button>
        </div>
      </div>

      <div className="cal-grid cal-weekdays">
        {WEEK_CN.map((w) => (
          <div key={w} className="cal-weekday">{w}</div>
        ))}
      </div>

      <div className="cal-grid">
        {days.map((d) => {
          const key = d.format('YYYY-MM-DD');
          const inMonth = d.month() === cursor.month();
          const isToday = key === today;
          const isSelected = key === selectedKey;
          const entry = entryMap[key];
          const joyCount = entry?.joys?.length || 0;
          const mood = entry?.mood;

          return (
            <button
              key={key}
              onClick={() => onSelect?.(key)}
              className={`cal-cell${inMonth ? '' : ' out'}${isToday ? ' today' : ''}${isSelected ? ' selected' : ''}${entry ? ' has-entry' : ''}`}
              title={entry ? `${joyCount} 件开心事 · 心情 ${MOOD_EMOJI[mood] || ''}` : key}
            >
              <span className="cal-day">{d.date()}</span>
              {entry && (
                <span className="cal-mark">
                  {mood ? MOOD_EMOJI[mood] : '·'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="cal-legend muted">
        <span><span className="dot dot-today" /> 今天</span>
        <span><span className="dot dot-has" /> 有记录</span>
        <span><span className="dot dot-sel" /> 已选中</span>
      </div>
    </motion.div>
  );
}
