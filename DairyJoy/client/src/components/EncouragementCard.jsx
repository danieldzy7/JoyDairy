import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getEncouragement } from '../api.js';

const TONE_LABEL = {
  warm:    '温柔',
  praise:  '夸夸',
  cheer:   '鼓劲',
  builder: '建设者',
  sober:   '清醒',
  funny:   '俏皮',
  cozy:    '暖心',
};

export default function EncouragementCard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = async ({ refresh = false } = {}) => {
    setLoading(true);
    setErr('');
    try {
      const d = await getEncouragement({
        refresh,
        excludeTone: refresh ? data?.tone : undefined,
      });
      setData(d);
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="card encourage-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
        <div>
          <div className="kicker">For You · 小悦想对你说</div>
          <h2 style={{ margin: 0 }}>{data?.title || '给你的一段话'}</h2>
          {data?.tone && (
            <span className="muted" style={{ fontSize: 12 }}>
              · {TONE_LABEL[data.tone] || '随机'} 风 ·
            </span>
          )}
        </div>
        <button
          className="btn ghost mini"
          onClick={() => load({ refresh: true })}
          disabled={loading}
          title="再来一段不一样的"
        >
          {loading ? <span className="spinner" /> : '🔄'} 换一段
        </button>
      </div>

      <AnimatePresence mode="wait">
        {loading && !data && (
          <motion.div
            key="loading"
            className="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span className="spinner" /> 小悦正在给你写一段话…
          </motion.div>
        )}

        {err && !loading && (
          <div className="empty" style={{ color: '#9c4a3a' }}>{err}</div>
        )}

        {data && !err && (
          <motion.div
            key={(data.title || '') + (data.tone || '') + (data.cached ? 'c' : 'n') + (data.message?.slice(0, 10) || '')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.4 }}
            style={{ marginTop: 14 }}
          >
            <p
              style={{
                fontSize: 15.5, lineHeight: 1.85, margin: 0,
                whiteSpace: 'pre-wrap',
              }}
            >
              {data.message}
            </p>

            {data.action && (
              <div className="action-box">
                <div className="action-kicker">今天就可以做的一件事</div>
                <div className="action-text">{data.action}</div>
              </div>
            )}

            {data.quote && (
              <div className="encourage-quote">
                <span className="q-mark">“</span>
                {data.quote}
                <span className="q-mark">”</span>
              </div>
            )}

            {Array.isArray(data.hashtags) && data.hashtags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                {data.hashtags.slice(0, 4).map((h, i) => (
                  <span key={i} className="chip" style={{ background: 'rgba(231,217,241,0.6)', color: '#7a5aa6' }}>
                    #{String(h).replace(/^#+/, '')}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
