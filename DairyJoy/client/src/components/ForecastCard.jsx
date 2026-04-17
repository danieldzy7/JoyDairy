import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { getForecast } from '../api.js';

function Stars({ n = 3 }) {
  const filled = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
  return (
    <div style={{ color: 'var(--gold)', letterSpacing: 2, fontSize: 13 }}>
      {'★'.repeat(filled)}<span style={{ opacity: 0.25 }}>{'★'.repeat(5 - filled)}</span>
    </div>
  );
}

export default function ForecastCard({ zodiac = 'libra', days = 5 }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [expandedIdx, setExpandedIdx] = useState(0);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setErr('');
    getForecast(days, zodiac)
      .then((d) => { if (!ignore) setData(d); })
      .catch((e) => !ignore && setErr(e.response?.data?.error || e.message))
      .finally(() => !ignore && setLoading(false));
    return () => { ignore = true; };
  }, [days, zodiac]);

  return (
    <motion.div className="card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="kicker">Forecast · 未来运势</div>
      <h2 style={{ marginTop: 0 }}>未来 {days} 天</h2>

      {loading && <div className="empty"><span className="spinner" /> 正在排未来的星盘…</div>}
      {err && <div className="empty" style={{ color: '#9c4a3a' }}>{err}</div>}

      {data && !loading && (
        <>
          {data.overview && (
            <p style={{ marginTop: 0, fontSize: 15, lineHeight: 1.75 }}>{data.overview}</p>
          )}

          <div className="forecast-list">
            {(data.days || []).map((d, i) => {
              const dj = dayjs(d.date);
              const isBest = data.bestDay === d.date;
              const isWarn = data.warnDay === d.date;
              const active = expandedIdx === i;
              return (
                <motion.div
                  key={d.date}
                  className={`forecast-row ${active ? 'active' : ''}`}
                  onClick={() => setExpandedIdx(active ? -1 : i)}
                  whileHover={{ y: -1 }}
                >
                  <div className="forecast-date">
                    <div className="dd" style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700 }}>
                      {dj.format('DD')}
                    </div>
                    <div className="mm" style={{ fontSize: 11, color: 'var(--ink-2)' }}>
                      {dj.format('MMM · ddd')}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <strong style={{ fontFamily: 'var(--font-serif)' }}>{d.theme}</strong>
                      {isBest && <span className="chip" style={{ background: 'rgba(232,169,63,0.2)', color: '#a06a22' }}>✨ 最佳</span>}
                      {isWarn && <span className="chip" style={{ background: 'rgba(229,138,123,0.2)', color: '#9c4a3a' }}>⚠️ 留意</span>}
                      <Stars n={d.score} />
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--ink-1)', marginTop: 2 }}>
                      {d.headline}
                    </div>

                    {active && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{ overflow: 'hidden', marginTop: 8 }}
                      >
                        <div className="chip" style={{ marginRight: 6 }}>焦点 · {d.focus}</div>
                        {d.actionable && (
                          <div className="action-box" style={{ marginTop: 10 }}>
                            <div className="action-kicker">当日可动手</div>
                            <div className="action-text" style={{ fontSize: 15 }}>{d.actionable}</div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );
}
