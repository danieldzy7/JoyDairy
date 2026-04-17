import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { drawFortune } from '../api.js';

export default function DrawFortune({ onDrawn }) {
  const [question, setQuestion] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const draw = async () => {
    setLoading(true);
    setErr('');
    setData(null);
    try {
      const d = await drawFortune(question);
      setData(d);
      onDrawn?.(d);
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setQuestion('');
  };

  return (
    <motion.div
      className="card ritual-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="kicker">Fortune · 电子抽签</div>
      <h2 style={{ marginTop: 0 }}>今日一签</h2>

      {!data && (
        <>
          <p className="muted" style={{ marginTop: 0 }}>
            心里默念一件想问的事（也可以留空），然后诚心一签。
          </p>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={2}
            placeholder="比如：最近想换工作，今天的方向在哪？"
            style={{
              width: '100%', padding: 12, borderRadius: 14,
              border: '1px solid rgba(0,0,0,0.07)', background: 'white',
              fontSize: 15, fontFamily: 'inherit', resize: 'vertical',
            }}
          />

          <div className="qian-stand" onClick={loading ? undefined : draw}>
            <AnimatePresence>
              {loading && (
                <motion.div
                  key="shake"
                  className="qian-stick shaking"
                  initial={{ y: -4 }}
                  animate={{ y: [0, -8, 0, -6, 0], rotate: [0, 1.5, -1.2, 0.8, 0] }}
                  transition={{ repeat: Infinity, duration: 0.45 }}
                />
              )}
              {!loading && <motion.div key="idle" className="qian-stick" />}
            </AnimatePresence>
            <div className="qian-base">
              <div className="qian-label">{loading ? '诚心 · 诚心…' : '点这里 · 摇一支签'}</div>
            </div>
          </div>
          {err && <div className="empty" style={{ color: '#9c4a3a' }}>{err}</div>}
        </>
      )}

      <AnimatePresence>
        {data && (
          <motion.div
            key="result"
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, type: 'spring' }}
            className="qian-card"
            style={{ borderColor: data.accent || 'var(--accent)' }}
          >
            <div className="qian-level" style={{ color: data.accent || 'var(--accent)' }}>
              {data.levelCn}
            </div>
            <div className="qian-title">{data.title}</div>
            <div className="qian-poem">
              {(data.poem || []).map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
            <div className="divider" />
            <div style={{ fontSize: 15, lineHeight: 1.75 }}>{data.interpretation}</div>
            {data.guidance && (
              <div className="action-box" style={{ marginTop: 14 }}>
                <div className="action-kicker">今天就可以做</div>
                <div className="action-text">{data.guidance}</div>
              </div>
            )}
            {Array.isArray(data.keywords) && data.keywords.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                {data.keywords.map((k, i) => (
                  <span key={i} className="chip">#{String(k).replace(/^#+/, '')}</span>
                ))}
              </div>
            )}
            <div className="muted" style={{ marginTop: 12, fontSize: 12 }}>
              幸运值 +{data.luckyDelta} ✨
            </div>
            <div style={{ marginTop: 12 }}>
              <button className="btn ghost mini" onClick={reset}>再抽一支</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
