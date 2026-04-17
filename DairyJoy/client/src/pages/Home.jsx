import dayjs from 'dayjs';
import JoyForm from '../components/JoyForm.jsx';
import HoroscopeCard from '../components/HoroscopeCard.jsx';
import AlmanacCard from '../components/AlmanacCard.jsx';
import EncouragementCard from '../components/EncouragementCard.jsx';
import ForecastCard from '../components/ForecastCard.jsx';

export default function Home({ profile }) {
  const today = dayjs().format('YYYY-MM-DD');
  const zodiac = profile?.zodiac || 'libra';

  const greet = (() => {
    const h = new Date().getHours();
    if (h < 6) return '夜深了';
    if (h < 11) return '早上好';
    if (h < 14) return '中午好';
    if (h < 18) return '下午好';
    if (h < 22) return '晚上好';
    return '夜安';
  })();

  return (
    <>
      <div className="header-hero">
        <div>
          <div className="kicker">Joy Diary · 悦记</div>
          <div className="hero-title">{greet}{profile?.name ? `，${profile.name}` : ''} ✿</div>
          <div className="hero-sub">{dayjs().format('YYYY 年 M 月 D 日 · dddd')} · 愿你今天被温柔以待</div>
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <EncouragementCard />
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.2fr 1fr', gap: 18 }}>
        <div className="grid">
          <JoyForm date={today} />
        </div>
        <div className="grid">
          <HoroscopeCard zodiac={zodiac} date={today} compact />
          <ForecastCard zodiac={zodiac} days={5} />
          <AlmanacCard date={today} compact />
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .container > .grid[style*="1.2fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
