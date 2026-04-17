import { useState } from 'react';
import dayjs from 'dayjs';
import AlmanacCard from '../components/AlmanacCard.jsx';

export default function Almanac() {
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  return (
    <>
      <div className="header-hero">
        <div>
          <div className="kicker">Chinese Almanac</div>
          <div className="hero-title">中国万年历</div>
          <div className="hero-sub">农历 · 节气 · 宜忌 · 当天的温柔小提醒</div>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="btn ghost"
          style={{ padding: '8px 12px' }}
        />
      </div>
      <AlmanacCard date={date} />
    </>
  );
}
