import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import { getAlmanac } from '../api.js';

export default function AlmanacCard({ date, compact = false }) {
  const d = date || dayjs().format('YYYY-MM-DD');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let ignore = false;
    setLoading(true); setErr('');
    getAlmanac(d)
      .then((r) => { if (!ignore) setData(r); })
      .catch((e) => !ignore && setErr(e.response?.data?.error || e.message))
      .finally(() => !ignore && setLoading(false));
    return () => { ignore = true; };
  }, [d]);

  return (
    <motion.div className="card" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <div className="kicker">中国万年历</div>
      {loading && <div className="empty"><span className="spinner" /> 翻黄历中…</div>}
      {err && <div className="empty">{err}</div>}
      {data && (
        <>
          <div className="almanac-top">
            <div>
              <div className="lunar-big">
                {data.lunar.month}{data.lunar.day}
              </div>
              <div className="muted">
                {data.solar.year}.{data.solar.month}.{data.solar.day} · {data.solar.week} · 农历{data.lunar.year}年（{data.lunar.yearGanZhi} · 属{data.lunar.zodiac}）
              </div>
              <div className="tag-row">
                <span className="chip">日干支 · <b>{data.lunar.dayGanZhi}</b></span>
                {data.jieQi && <span className="chip">节气 · <b>{data.jieQi}</b></span>}
                {data.jcTwelve && <span className="chip">建除 · <b>{data.jcTwelve}</b></span>}
                {data.chongSha && <span className="chip">{data.chongSha}</span>}
              </div>
            </div>
          </div>

          {data.ai?.summary && (
            <p style={{ marginTop: 14, fontSize: 15.5, lineHeight: 1.75 }}>
              {data.ai.summary}
            </p>
          )}

          <div className="yi-ji-grid">
            <div className="yi">
              <h4>宜 · 今日适合</h4>
              <ul>
                {(data.ai?.suitableToday || data.yi || []).slice(0, 6).map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="ji">
              <h4>忌 · 今日避免</h4>
              <ul>
                {(data.ai?.avoidToday || data.ji || []).slice(0, 6).map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          </div>

          {!compact && data.ai?.reminders?.length > 0 && (
            <>
              <div className="divider" />
              <h3>🌱 今日小提醒</h3>
              <ul style={{ marginTop: 6 }}>
                {data.ai.reminders.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </>
          )}

          {data.ai?.moodTip && (
            <div
              style={{
                marginTop: 14, padding: '12px 14px', borderRadius: 14,
                background: 'rgba(122, 166, 148, 0.12)', color: '#3f6b56',
              }}
            >
              💚 {data.ai.moodTip}
            </div>
          )}

          {!compact && (
            <details className="expand" style={{ marginTop: 12 }}>
              <summary>查看传统黄历原始数据</summary>
              <div className="muted" style={{ fontSize: 13, marginTop: 8 }}>
                <div>喜神：{data.xiShen || '—'} / 财神：{data.caiShen || '—'} / 福神：{data.fuShen || '—'}</div>
                <div>彭祖：{data.pengZuGan}；{data.pengZuZhi}</div>
                <div>二十八宿：{data.xingXiu}</div>
                <div>宜（原文）：{(data.yi || []).join('、') || '—'}</div>
                <div>忌（原文）：{(data.ji || []).join('、') || '—'}</div>
              </div>
            </details>
          )}
        </>
      )}
    </motion.div>
  );
}
