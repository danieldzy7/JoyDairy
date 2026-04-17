import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { burnIncense } from '../api.js';

export default function Incense({ onBurned }) {
  const [wish, setWish] = useState('');
  const [burning, setBurning] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');

  const burn = async () => {
    if (!wish.trim()) {
      setErr('先写下你的心愿吧～');
      return;
    }
    setBurning(true);
    setErr('');
    setData(null);
    try {
      const d = await burnIncense(wish.trim());
      setData(d);
      onBurned?.(d);
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    } finally {
      setBurning(false);
    }
  };

  return (
    <motion.div
      className="card ritual-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="kicker">Incense · 赛博烧香</div>
      <h2 style={{ marginTop: 0 }}>写下一个心愿</h2>
      <p className="muted" style={{ marginTop: 0 }}>
        把心里真正想要的事写下来，交给宇宙，也交给未来的自己动手。
      </p>

      <div className="incense-stage">
        <div className={`incense-smoke ${burning ? 'on' : ''}`}>
          <span /><span /><span />
        </div>
        <div className={`incense-stick ${burning ? 'on' : ''}`}>
          <div className="tip" />
        </div>
        <div className="incense-bowl" />
      </div>

      <textarea
        value={wish}
        onChange={(e) => setWish(e.target.value)}
        rows={3}
        placeholder="例如：希望下个月 side project 能上线 / 希望能找到新工作 / 希望和家人关系更近"
        style={{
          width: '100%', padding: 12, borderRadius: 14,
          border: '1px solid rgba(0,0,0,0.07)', background: 'white',
          fontSize: 15, fontFamily: 'inherit', resize: 'vertical',
          marginTop: 10,
        }}
      />
      <div style={{ display: 'flex', gap: 10, marginTop: 10, alignItems: 'center' }}>
        <button className="btn accent" onClick={burn} disabled={burning}>
          {burning ? <span className="spinner" /> : '🪔'} 点香祈愿
        </button>
        {err && <span className="muted" style={{ color: '#9c4a3a' }}>{err}</span>}
      </div>

      <AnimatePresence>
        {data && (
          <motion.div
            key="echo"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ marginTop: 14 }}
          >
            <div style={{
              padding: 14, borderRadius: 14,
              background: 'rgba(255,255,255,0.75)',
              border: '1px solid rgba(0,0,0,0.05)',
              fontSize: 15, lineHeight: 1.75,
            }}>
              {data.echo}
            </div>

            {Array.isArray(data.steps) && data.steps.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <div className="kicker" style={{ color: '#4e7e67' }}>你可以靠自己推进的步骤</div>
                <ol style={{ margin: '6px 0 0', paddingLeft: 20 }}>
                  {data.steps.map((s, i) => (
                    <li key={i} style={{ marginBottom: 4 }}>{s}</li>
                  ))}
                </ol>
              </div>
            )}

            {data.blessing && (
              <div className="encourage-quote" style={{ marginTop: 14 }}>
                <span className="q-mark">“</span>{data.blessing}<span className="q-mark">”</span>
              </div>
            )}

            <div className="muted" style={{ fontSize: 12, marginTop: 8 }}>
              幸运值 +{data.luckyDelta || 3} ✨
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
