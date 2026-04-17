import { useState } from 'react';
import dayjs from 'dayjs';
import HoroscopeCard from '../components/HoroscopeCard.jsx';

export default function Horoscope({ profile }) {
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const zodiac = profile?.zodiac || 'libra';

  return (
    <>
      <div className="header-hero">
        <div>
          <div className="kicker">Horoscope</div>
          <div className="hero-title">今日星语</div>
          <div className="hero-sub">
            你的星座：天秤座 · 生日 {profile?.birthday || '1989-10-04'}
          </div>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="btn ghost"
          style={{ padding: '8px 12px' }}
        />
      </div>
      <HoroscopeCard zodiac={zodiac} date={date} />
    </>
  );
}
