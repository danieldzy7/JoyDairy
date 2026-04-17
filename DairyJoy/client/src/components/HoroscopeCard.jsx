import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { getHoroscope } from '../api.js';

const ZODIAC_EMOJI = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋',
  leo: '♌', virgo: '♍', libra: '♎', scorpio: '♏',
  sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓',
};

function Stars({ n = 3 }) {
  const filled = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
  return (
    <div className="stars">
      {'★'.repeat(filled)}
      <span style={{ opacity: 0.25 }}>{'★'.repeat(5 - filled)}</span>
    </div>
  );
}

export default function HoroscopeCard({ zodiac = 'libra', date, compact = false }) {
  const d = date || dayjs().format('YYYY-MM-DD');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let ignore = false;
    setLoading(true); setErr('');
    getHoroscope(d, zodiac)
      .then((r) => { if (!ignore) setData(r); })
      .catch((e) => !ignore && setErr(e.response?.data?.error || e.message))
      .finally(() => !ignore && setLoading(false));
    return () => { ignore = true; };
  }, [d, zodiac]);

  return (
    <motion.div className="card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="zodiac-header">
        <div className="zodiac-emoji">{ZODIAC_EMOJI[zodiac] || '✨'}</div>
        <div>
          <div className="kicker">Today · {d}</div>
          <h2 style={{ margin: 0 }}>{data?.zodiac || '今日运势'}</h2>
          <div className="muted">AI · 由 ChatGPT 生成</div>
        </div>
      </div>

      {loading && <div className="empty"><span className="spinner" /> 正在为你排星盘…</div>}
      {err && <div className="empty">{err}</div>}

      {data && !loading && (
        <>
          <p style={{ marginTop: 0, fontSize: 15.5, lineHeight: 1.75 }}>{data.summary}</p>

          {data.scores && (
            <div className="score-grid">
              <div className="score-cell"><div className="label">综合</div><Stars n={data.scores.overall} /></div>
              <div className="score-cell"><div className="label">爱情</div><Stars n={data.scores.love} /></div>
              <div className="score-cell"><div className="label">事业</div><Stars n={data.scores.career} /></div>
              <div className="score-cell"><div className="label">财运</div><Stars n={data.scores.wealth} /></div>
              <div className="score-cell"><div className="label">健康</div><Stars n={data.scores.health} /></div>
            </div>
          )}

          <div className="lucky-line" style={{ marginTop: 14 }}>
            {data.luckyColor && <span className="chip">幸运色 · <b>{data.luckyColor}</b></span>}
            {data.luckyNumber && <span className="chip">幸运数字 · <b>{data.luckyNumber}</b></span>}
          </div>

          {!compact && (
            <>
              <div className="divider" />
              <div className="grid cols-2">
                <div><h3>💗 感情</h3><p style={{ margin: 0 }}>{data.love}</p></div>
                <div><h3>💼 事业</h3><p style={{ margin: 0 }}>{data.career}</p></div>
                <div><h3>💰 财运</h3><p style={{ margin: 0 }}>{data.wealth}</p></div>
                <div><h3>🌿 健康</h3><p style={{ margin: 0 }}>{data.health}</p></div>
              </div>
            </>
          )}

          {data.affirmation && (
            <div
              style={{
                marginTop: 16, padding: '14px 16px', borderRadius: 14,
                background: 'linear-gradient(135deg, rgba(231,217,241,0.7), rgba(252,227,212,0.7))',
                fontFamily: 'var(--font-serif)', fontSize: 17,
              }}
            >
              ✨ {data.affirmation}
            </div>
          )}

          {data.cautions && (
            <p className="muted" style={{ marginTop: 10 }}>⚠️ 今日留意：{data.cautions}</p>
          )}
        </>
      )}
    </motion.div>
  );
}
