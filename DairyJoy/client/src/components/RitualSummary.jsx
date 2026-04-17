import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getRituals } from '../api.js';

const KIND_META = {
  draw:    { icon: '🎋', label: '抽签' },
  incense: { icon: '🪔', label: '烧香' },
  muyu:    { icon: '🪵', label: '木鱼' },
  buddha:  { icon: '📿', label: '佛说' },
};

export default function RitualSummary({ date }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    getRituals(date)
      .then((r) => { if (!ignore) setList(r); })
      .finally(() => !ignore && setLoading(false));
    return () => { ignore = true; };
  }, [date]);

  const totalLucky = list.reduce((s, r) => s + (r.luckyDelta || 0), 0);
  const muyuCount = list
    .filter((r) => r.kind === 'muyu')
    .reduce((s, r) => s + (r.payload?.count || r.luckyDelta || 0), 0);
  const draws   = list.filter((r) => r.kind === 'draw');
  const incense = list.filter((r) => r.kind === 'incense');
  const buddhas = list.filter((r) => r.kind === 'buddha');

  if (loading) return null;
  if (list.length === 0) return null;

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ padding: 18 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <div className="kicker">Today's Rituals</div>
          <h3 style={{ margin: 0 }}>这天在禅房的小仪式</h3>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="muted" style={{ fontSize: 12 }}>幸运值</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 700, color: '#e58a7b' }}>
            +{totalLucky}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
        {muyuCount > 0 && (
          <span className="chip">{KIND_META.muyu.icon} 木鱼 · {muyuCount} 下</span>
        )}
        {draws.length > 0 && (
          <span className="chip">{KIND_META.draw.icon} 抽签 · {draws.length} 次</span>
        )}
        {incense.length > 0 && (
          <span className="chip">{KIND_META.incense.icon} 烧香 · {incense.length} 愿</span>
        )}
        {buddhas.length > 0 && (
          <span className="chip">{KIND_META.buddha.icon} 佛说 · {buddhas.length} 段</span>
        )}
      </div>

      {draws.length > 0 && (
        <div style={{ marginTop: 12 }}>
          {draws.slice(0, 3).map((d) => (
            <div key={d._id} style={{
              padding: '10px 12px', borderRadius: 12, marginTop: 8,
              background: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>
                {KIND_META.draw.icon} {d.payload?.levelCn || '签'} · {d.payload?.title || ''}
              </div>
              {d.payload?.guidance && (
                <div style={{ fontSize: 14, marginTop: 4 }}>
                  → {d.payload.guidance}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {incense.length > 0 && (
        <div style={{ marginTop: 10 }}>
          {incense.slice(0, 3).map((inc) => (
            <div key={inc._id} style={{
              padding: '10px 12px', borderRadius: 12, marginTop: 8,
              background: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>
                {KIND_META.incense.icon} 心愿
              </div>
              <div style={{ fontSize: 14, marginTop: 4 }}>
                {inc.payload?.wish}
              </div>
              {inc.payload?.blessing && (
                <div style={{ fontSize: 13, marginTop: 6, fontFamily: 'var(--font-serif)', color: 'var(--ink-1)' }}>
                  “{inc.payload.blessing}”
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {buddhas.length > 0 && (
        <div style={{ marginTop: 10 }}>
          {buddhas.slice(0, 2).map((b) => (
            <div key={b._id} style={{
              padding: '10px 12px', borderRadius: 12, marginTop: 8,
              background: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize: 13, color: 'var(--ink-2)' }}>
                {KIND_META.buddha.icon} 佛说 · {b.payload?.source || ''}
              </div>
              {b.payload?.sutra && (
                <div style={{ fontSize: 14, marginTop: 4, fontFamily: 'var(--font-serif)', color: 'var(--ink-1)' }}>
                  {b.payload.sutra}
                </div>
              )}
              {b.payload?.doNow && (
                <div style={{ fontSize: 13, marginTop: 4, color: '#2f5a47' }}>
                  → {b.payload.doNow}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
