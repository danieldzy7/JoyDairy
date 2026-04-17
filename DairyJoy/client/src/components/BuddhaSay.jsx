import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { askBuddha } from '../api.js';

export default function BuddhaSay({ onAsked }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  const ask = async () => {
    setLoading(true);
    setErr('');
    try {
      const d = await askBuddha(question.trim());
      setData(d);
      onAsked?.(d);
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="card ritual-card buddha-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="kicker">Buddha Says · 佛说</div>
      <h2 style={{ marginTop: 0 }}>请一段佛说</h2>
      <p className="muted" style={{ marginTop: 0 }}>
        翻一页经，听一句话。心里有事就写下来，没事就只看一眼，随缘。
      </p>

      <div className="buddha-stage">
        <div className="buddha-lotus" aria-hidden>
          <span>卍</span>
        </div>
      </div>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        rows={2}
        placeholder="可选：今天心里放不下的事，一句话即可（也可以留空）"
        style={{
          width: '100%', padding: 12, borderRadius: 14,
          border: '1px solid rgba(0,0,0,0.07)', background: 'white',
          fontSize: 15, fontFamily: 'inherit', resize: 'vertical',
          marginTop: 6,
        }}
      />
      <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="btn accent" onClick={ask} disabled={loading}>
          {loading ? <span className="spinner" /> : '📿'} {data ? '再请一段' : '请一段佛说'}
        </button>
        {err && <span className="muted" style={{ color: '#9c4a3a' }}>{err}</span>}
      </div>

      <AnimatePresence mode="wait">
        {data && (
          <motion.div
            key={data.id || data.sutra}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5 }}
            style={{ marginTop: 14 }}
          >
            <div className="buddha-scroll">
              <div className="buddha-sutra">{data.sutra}</div>
              <div className="buddha-source">—— {data.source}</div>
            </div>

            {data.modern && (
              <div style={{
                marginTop: 12, padding: '12px 14px', borderRadius: 14,
                background: 'rgba(255,255,255,0.75)',
                border: '1px solid rgba(0,0,0,0.05)',
                fontSize: 15, lineHeight: 1.8,
              }}>
                {data.modern}
              </div>
            )}

            <div className="buddha-pair">
              {data.letGo && (
                <div className="buddha-slot letgo">
                  <div className="kicker">今日可放下</div>
                  <div>{data.letGo}</div>
                </div>
              )}
              {data.doNow && (
                <div className="buddha-slot donow">
                  <div className="kicker">今日去做</div>
                  <div>{data.doNow}</div>
                </div>
              )}
            </div>

            {data.gatha && (
              <div className="buddha-gatha">
                <span className="g-dot">•</span>{data.gatha}<span className="g-dot">•</span>
              </div>
            )}

            <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>
              幸运值 +{data.luckyDelta || 2} ✨
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
