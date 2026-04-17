import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DrawFortune from '../components/DrawFortune.jsx';
import Incense from '../components/Incense.jsx';
import Muyu from '../components/Muyu.jsx';
import BuddhaSay from '../components/BuddhaSay.jsx';
import { getRitualStats } from '../api.js';

export default function Temple() {
  const [stats, setStats] = useState(null);

  const refresh = useCallback(() => {
    getRitualStats().then(setStats).catch(() => {});
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <>
      <div className="header-hero">
        <div>
          <div className="kicker">Cyber Temple</div>
          <div className="hero-title">赛博禅房</div>
          <div className="hero-sub">诚心一签 · 清净一愿 · 功德一下</div>
        </div>
        {stats && (
          <motion.div
            className="card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ padding: '14px 18px', display: 'flex', gap: 18, alignItems: 'center' }}
          >
            <div style={{ textAlign: 'center' }}>
              <div className="kicker" style={{ marginBottom: 2 }}>今日幸运</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 700, color: '#e58a7b' }}>
                +{stats.todayLucky || 0}
              </div>
            </div>
            <div style={{ width: 1, background: 'rgba(0,0,0,0.08)', alignSelf: 'stretch' }} />
            <div style={{ textAlign: 'center' }}>
              <div className="kicker" style={{ marginBottom: 2 }}>累计</div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 600 }}>
                {stats.totalLucky || 0}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.1fr 1fr', gap: 18 }}>
        <div className="grid" style={{ gap: 18 }}>
          <DrawFortune onDrawn={refresh} />
          <Incense onBurned={refresh} />
        </div>
        <div className="grid" style={{ gap: 18 }}>
          <Muyu initialTotal={stats?.todayMuyu || 0} onKnock={refresh} />
          <BuddhaSay onAsked={refresh} />
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .container > .grid[style*="1.1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
