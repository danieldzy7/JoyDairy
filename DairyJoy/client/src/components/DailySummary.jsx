import { motion } from 'framer-motion';

const KIND_META = {
  'self-care': { icon: '☕', label: '照顾自己', color: '#8a5aa6', bg: 'rgba(183,156,217,0.14)' },
  action:      { icon: '✍', label: '去做一件事', color: '#2f5a47', bg: 'rgba(122,166,148,0.14)' },
};

export default function DailySummary({ data }) {
  if (!data) return null;

  const recs = Array.isArray(data.recommendations) ? data.recommendations : [];
  const highs = Array.isArray(data.highlights) ? data.highlights : [];
  const patterns = Array.isArray(data.patterns) ? data.patterns.filter(Boolean) : [];
  const notes = Array.isArray(data.gentleNotes) ? data.gentleNotes.filter(Boolean) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="summary-card"
    >
      <div className="summary-head">
        <div>
          <div className="kicker" style={{ color: '#b65b4a' }}>Today · 今日总结</div>
          <div className="summary-gist">{data.gist}</div>
        </div>
        {data.vibe && <div className="summary-vibe">{data.vibe}</div>}
      </div>

      {highs.length > 0 && (
        <div className="summary-section">
          <div className="summary-title">✦ 今天真正亮的地方</div>
          <ul className="summary-list">
            {highs.map((h, i) => (
              <li key={i}>
                <div className="summary-hl-text">{h.text}</div>
                {h.why && <div className="summary-hl-why">{h.why}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {patterns.length > 0 && (
        <div className="summary-section">
          <div className="summary-title">◇ 小悦看到的倾向</div>
          <ul className="summary-list plain">
            {patterns.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </div>
      )}

      {notes.length > 0 && (
        <div className="summary-section">
          <div className="summary-title">♡ 一点温柔的话</div>
          <ul className="summary-list plain">
            {notes.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </div>
      )}

      {recs.length > 0 && (
        <div className="summary-section">
          <div className="summary-title">→ 推荐你接下来可以</div>
          <div className="summary-recs">
            {recs.map((r, i) => {
              const meta = KIND_META[r.kind] || KIND_META['self-care'];
              return (
                <div key={i} className="summary-rec" style={{ background: meta.bg, borderColor: meta.bg }}>
                  <span className="rec-icon" style={{ color: meta.color }}>{meta.icon}</span>
                  <div>
                    <div className="rec-kind" style={{ color: meta.color }}>{meta.label}</div>
                    <div className="rec-text">{r.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {data.closing && (
        <div className="summary-closing">“{data.closing}”</div>
      )}

      <style>{`
        .summary-card {
          margin-top: 16px;
          padding: 18px 20px;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(252,227,212,0.55), rgba(231,217,241,0.55), rgba(215,232,222,0.55));
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: var(--shadow);
        }
        .summary-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 14px;
          flex-wrap: wrap;
        }
        .summary-gist {
          font-family: var(--font-serif);
          font-size: 19px;
          line-height: 1.55;
          font-weight: 600;
          color: var(--ink-1);
          margin-top: 4px;
        }
        .summary-vibe {
          flex: none;
          padding: 6px 12px;
          border-radius: 999px;
          background: white;
          border: 1px solid rgba(0,0,0,0.05);
          font-size: 13px;
          color: #b65b4a;
          font-weight: 500;
        }
        .summary-section { margin-top: 14px; }
        .summary-title {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 1px;
          color: var(--ink-2);
          margin-bottom: 6px;
        }
        .summary-list {
          margin: 0; padding-left: 20px;
          font-size: 14.5px;
          line-height: 1.7;
        }
        .summary-list li { margin-bottom: 6px; }
        .summary-list.plain { list-style: '· '; }
        .summary-hl-text { color: var(--ink-1); font-weight: 500; }
        .summary-hl-why { color: var(--ink-2); font-size: 13px; margin-top: 2px; }
        .summary-recs {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .summary-rec {
          display: flex; gap: 10px; align-items: flex-start;
          padding: 10px 12px; border-radius: 12px;
          border: 1px solid transparent;
        }
        .rec-icon { font-size: 18px; line-height: 1.4; flex: none; }
        .rec-kind { font-size: 11px; font-weight: 700; letter-spacing: 1px; margin-bottom: 2px; }
        .rec-text { font-size: 14.5px; line-height: 1.6; color: var(--ink-1); }
        .summary-closing {
          margin-top: 14px;
          text-align: center;
          font-family: var(--font-serif);
          font-size: 15px;
          color: var(--ink-2);
          padding: 10px 0 2px;
        }
      `}</style>
    </motion.div>
  );
}
