import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { getEntries } from '../api.js';
import JoyForm from '../components/JoyForm.jsx';
import Calendar from '../components/Calendar.jsx';
import RitualSummary from '../components/RitualSummary.jsx';

export default function Diary() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(dayjs().format('YYYY-MM-DD'));
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    getEntries(365)
      .then(setList)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);
  // 切日期时给服务端一点时间写入，再刷新 timeline（JoyForm 里的保存是异步的）
  useEffect(() => {
    const t = setTimeout(load, 600);
    return () => clearTimeout(t);
  }, [selected, load]);

  return (
    <>
      <div className="header-hero">
        <div>
          <div className="kicker">Diary</div>
          <div className="hero-title">我的开心日记本</div>
          <div className="hero-sub">点日历上的任意一天，翻看那天的温柔片段</div>
        </div>
      </div>

      <div className="grid diary-grid">
        <div className="grid">
          <JoyForm key={selected} date={selected} />
          <RitualSummary key={`ritual-${selected}`} date={selected} />
        </div>
        <div className="grid" style={{ gap: 14 }}>
          <Calendar
            selected={selected}
            onSelect={(d) => setSelected(d)}
            entries={list}
          />

          <div className="card">
            <div className="kicker">Timeline</div>
            <h3 style={{ marginTop: 0 }}>
              最近的开心事 {list.length > 0 && <span className="muted" style={{ fontWeight: 400, fontSize: 13 }}>· 共 {list.length} 天</span>}
            </h3>
            {loading && <div className="empty"><span className="spinner" /></div>}
            {!loading && list.length === 0 && (
              <div className="empty">还没有记录～从今天开始吧 🌷</div>
            )}
            <div className="grid" style={{ gridTemplateColumns: '1fr', gap: 10, maxHeight: 420, overflowY: 'auto', paddingRight: 4 }}>
              {list.slice(0, 60).map((e) => {
                const d = dayjs(e.date);
                return (
                  <motion.button
                    key={e.date}
                    whileHover={{ y: -2 }}
                    onClick={() => setSelected(e.date)}
                    className="timeline-card"
                    style={{
                      textAlign: 'left', border: 0, cursor: 'pointer',
                      outline: selected === e.date ? '2px solid var(--accent)' : 'none',
                    }}
                  >
                    <div className="date-badge">
                      <div className="dd">{d.format('DD')}</div>
                      <div className="mm">{d.format('MMM · ddd')}</div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>
                        心情 {['', '😔','😕','🙂','😊','🤩'][e.mood] || ''} · {e.joys?.length || 0} 件开心事
                      </div>
                      <div style={{ marginTop: 4, fontSize: 14, color: 'var(--ink-1)', lineHeight: 1.5 }}>
                        {(e.joys?.[0]?.text || '').slice(0, 40)}
                        {e.joys?.[0]?.text?.length > 40 ? '…' : ''}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .diary-grid { grid-template-columns: 1.1fr 1fr; gap: 18px; }
        @media (max-width: 960px) {
          .diary-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
