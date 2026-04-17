import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { knockMuyu } from '../api.js';

// 用 Web Audio API 合成一个简短的木鱼 "咚" 音
function playKnock() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = (playKnock._ctx = playKnock._ctx || new Ctx());
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.18);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.6, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  } catch (_) { /* ignore */ }
}

/**
 * 敲木鱼：
 * - 本地立即 +1，飘一个 "+1 功德" 数字
 * - 500ms 防抖把多次点击合并成一次 POST 上传
 */
export default function Muyu({ onKnock, initialTotal = 0, soundOn: initialSound = true }) {
  const [localCount, setLocalCount] = useState(0);
  const [todayTotal, setTodayTotal] = useState(initialTotal);
  const [pops, setPops] = useState([]);
  const [blessing, setBlessing] = useState('');
  const [soundOn, setSoundOn] = useState(initialSound);
  const pendingRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    setTodayTotal(initialTotal);
  }, [initialTotal]);

  const flush = async () => {
    const n = pendingRef.current;
    if (!n) return;
    pendingRef.current = 0;
    try {
      const r = await knockMuyu(n);
      setTodayTotal(r.todayTotal);
      if (r.blessing) setBlessing(r.blessing);
      onKnock?.(r);
    } catch (_) { /* ignore */ }
  };

  const knock = () => {
    if (soundOn) playKnock();

    setLocalCount((c) => c + 1);
    setTodayTotal((t) => t + 1);

    const id = Date.now() + Math.random();
    setPops((arr) => [...arr, { id, x: (Math.random() - 0.5) * 50 }]);
    setTimeout(() => {
      setPops((arr) => arr.filter((p) => p.id !== id));
    }, 900);

    pendingRef.current += 1;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(flush, 600);
  };

  const progress = Math.min(100, (todayTotal % 108) * (100 / 108));
  const nextMilestone = Math.ceil((todayTotal + 1) / 108) * 108;

  return (
    <motion.div
      className="card ritual-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
        <div>
          <div className="kicker">Wood Fish · 敲木鱼</div>
          <h2 style={{ marginTop: 0 }}>一下一下，积点功德</h2>
        </div>
        <button
          className="btn ghost mini"
          onClick={() => setSoundOn((s) => !s)}
          title="开/关声音"
        >
          {soundOn ? '🔔 有声' : '🔕 静音'}
        </button>
      </div>

      <div className="muyu-stage" onClick={knock} role="button" tabIndex={0}
           onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && knock()}>
        <motion.div
          className="muyu-body"
          whileTap={{ scale: 0.88, rotate: -2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
          <div className="muyu-hole" />
          <div className="muyu-shine" />
        </motion.div>

        <AnimatePresence>
          {pops.map((p) => (
            <motion.div
              key={p.id}
              className="muyu-pop"
              initial={{ opacity: 0, y: 0, x: p.x }}
              animate={{ opacity: 1, y: -80, x: p.x }}
              exit={{ opacity: 0, y: -110 }}
              transition={{ duration: 0.9 }}
            >
              +1 功德
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="muyu-stats">
        <div className="muyu-num">{todayTotal}</div>
        <div className="muyu-num-label">
          今日功德 · 这次敲了 {localCount} 下
        </div>
      </div>

      <div className="muyu-progress">
        <div className="muyu-progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="muyu-progress-label">
        {todayTotal >= 108
          ? `距离下一个 ${nextMilestone} 还差 ${nextMilestone - todayTotal} 下`
          : `还差 ${108 - (todayTotal % 108)} 下，敲满 108 有惊喜 🌸`}
      </div>

      <AnimatePresence>
        {blessing && (
          <motion.div
            key="blessing"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="action-box"
            style={{ marginTop: 14 }}
          >
            <div className="action-kicker">108 下 · 一段赐语</div>
            <div className="action-text" style={{ fontSize: 15 }}>{blessing}</div>
            <button
              className="btn ghost mini"
              style={{ marginTop: 8 }}
              onClick={() => setBlessing('')}
            >
              收下
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
