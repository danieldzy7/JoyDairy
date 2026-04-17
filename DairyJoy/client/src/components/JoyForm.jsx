import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { motion, AnimatePresence } from 'framer-motion';
import { getEntry, saveEntry, reflectEntry, polishJoy, summarizeEntry } from '../api.js';
import DailySummary from './DailySummary.jsx';

const MOODS = [
  { v: 1, e: '😔', l: '低落' },
  { v: 2, e: '😕', l: '一般' },
  { v: 3, e: '🙂', l: '平稳' },
  { v: 4, e: '😊', l: '开心' },
  { v: 5, e: '🤩', l: '雀跃' },
];

const POLISH_STYLES = [
  { id: 'warm', label: '温暖治愈' },
  { id: 'poetic', label: '诗意' },
  { id: 'short', label: '精炼' },
  { id: 'playful', label: '俏皮' },
];

export default function JoyForm({ date: initialDate }) {
  const [date, setDate] = useState(initialDate || dayjs().format('YYYY-MM-DD'));
  const [joys, setJoys] = useState(['', '', '']);
  const [mood, setMood] = useState(3);
  const [reflection, setReflection] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);

  const [aiText, setAiText] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');

  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [polishStyle, setPolishStyle] = useState('warm');
  const [polishingIdx, setPolishingIdx] = useState(-1);
  const [polishOriginal, setPolishOriginal] = useState({}); // 保存原文以支持撤销

  useEffect(() => {
    let ignore = false;
    getEntry(date).then((e) => {
      if (ignore) return;
      if (e) {
        const list = (e.joys || []).map((j) => j.text);
        while (list.length < 3) list.push('');
        setJoys(list);
        setMood(e.mood || 3);
        setReflection(e.reflection || '');
        setGratitude(e.gratitude || '');
      } else {
        setJoys(['', '', '']);
        setMood(3);
        setReflection('');
        setGratitude('');
      }
      setAiText('');
      setSummary(null);
      setSavedAt(null);
      setError('');
      setPolishOriginal({});
    });
    return () => { ignore = true; };
  }, [date]);

  const updateJoy = (i, v) => {
    setJoys((arr) => arr.map((x, idx) => (idx === i ? v : x)));
    setPolishOriginal((p) => {
      if (!(i in p)) return p;
      const next = { ...p };
      delete next[i]; // 用户手动编辑后，失去"撤销"的意义
      return next;
    });
  };
  const addJoy = () => setJoys((arr) => (arr.length < 5 ? [...arr, ''] : arr));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await saveEntry(date, {
        joys: joys.map((t) => ({ text: t })),
        mood,
        reflection,
        gratitude,
      });
      setSavedAt(new Date());
    } catch (err) {
      setError('保存失败：' + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleReflect = async () => {
    const filled = joys.filter((j) => j.trim());
    if (filled.length === 0) {
      setError('先写至少一件开心的事吧～');
      return;
    }
    setAiLoading(true);
    setError('');
    setAiText('');
    try {
      await saveEntry(date, {
        joys: joys.map((t) => ({ text: t })),
        mood,
        reflection,
        gratitude,
      });
      setSavedAt(new Date());
      const r = await reflectEntry(date);
      setAiText(r.reflection || '');
    } catch (err) {
      console.error('reflect failed', err);
      setError('小悦暂时回不了话：' + (err.response?.data?.error || err.message));
    } finally {
      setAiLoading(false);
    }
  };

  const handleSummary = async () => {
    const filled = joys.filter((j) => j.trim());
    if (filled.length < 3) {
      setError('先把三件事写完，小悦才好帮你总结～');
      return;
    }
    setSummaryLoading(true);
    setError('');
    setSummary(null);
    try {
      await saveEntry(date, {
        joys: joys.map((t) => ({ text: t })),
        mood,
        reflection,
        gratitude,
      });
      setSavedAt(new Date());
      const r = await summarizeEntry(date);
      setSummary(r);
    } catch (err) {
      console.error('summary failed', err);
      setError('小悦暂时想不出话来：' + (err.response?.data?.error || err.message));
    } finally {
      setSummaryLoading(false);
    }
  };

  const handlePolish = async (i) => {
    const text = (joys[i] || '').trim();
    if (!text) {
      setError('这一行还是空的，先随便写几个字～');
      return;
    }
    setPolishingIdx(i);
    setError('');
    try {
      const { text: polished } = await polishJoy(text, polishStyle);
      if (polished && polished !== text) {
        setPolishOriginal((p) => ({ ...p, [i]: text }));
        setJoys((arr) => arr.map((x, idx) => (idx === i ? polished : x)));
      }
    } catch (err) {
      setError('润色失败：' + (err.response?.data?.error || err.message));
    } finally {
      setPolishingIdx(-1);
    }
  };

  const handleUndoPolish = (i) => {
    const original = polishOriginal[i];
    if (original == null) return;
    setJoys((arr) => arr.map((x, idx) => (idx === i ? original : x)));
    setPolishOriginal((p) => {
      const next = { ...p };
      delete next[i];
      return next;
    });
  };

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, gap: 10, flexWrap: 'wrap' }}>
        <div>
          <div className="kicker">Daily Joy</div>
          <h2>今天让我微笑的三件事</h2>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="btn ghost"
          style={{ padding: '8px 12px' }}
        />
      </div>
      <p className="muted" style={{ marginTop: 0 }}>
        随便写，粗糙也没关系。点右边 ✨ 让小悦帮你润色成更有画面感的句子。
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <span className="muted" style={{ fontSize: 12 }}>润色风格：</span>
        {POLISH_STYLES.map((s) => (
          <button
            key={s.id}
            onClick={() => setPolishStyle(s.id)}
            className={`chip`}
            style={{
              cursor: 'pointer',
              border: polishStyle === s.id ? '1px solid var(--accent)' : '1px solid rgba(0,0,0,0.05)',
              background: polishStyle === s.id ? 'rgba(229, 138, 123, 0.15)' : 'rgba(255,255,255,0.85)',
              color: polishStyle === s.id ? '#b65b4a' : 'var(--ink-1)',
              fontWeight: polishStyle === s.id ? 600 : 400,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {joys.map((j, i) => (
        <div className="joy-row" key={i}>
          <div className="idx">{i + 1}</div>
          <textarea
            placeholder={[
              '例如：和朋友吃了一顿暖暖的晚餐',
              '例如：完成了拖了很久的一件小事',
              '例如：看到晚霞，忍不住停下来多看了两眼',
            ][i] || '再加一件让你心动的小事…'}
            value={j}
            onChange={(e) => updateJoy(i, e.target.value)}
            rows={2}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 2 }}>
            <button
              type="button"
              className="btn ghost mini"
              onClick={() => handlePolish(i)}
              disabled={polishingIdx === i || !j.trim()}
              title="让 ChatGPT 帮你润色"
              style={{ minWidth: 46 }}
            >
              {polishingIdx === i ? <span className="spinner" /> : '✨'}
            </button>
            {polishOriginal[i] != null && (
              <button
                type="button"
                className="btn ghost mini"
                onClick={() => handleUndoPolish(i)}
                title="撤销润色，回到原文"
                style={{ minWidth: 46, fontSize: 11 }}
              >
                ↩ 原文
              </button>
            )}
          </div>
        </div>
      ))}
      {joys.length < 5 && (
        <button className="btn ghost mini" onClick={addJoy} style={{ marginTop: 4 }}>
          + 再加一件
        </button>
      )}

      <div className="divider" />

      <h3>今天的心情</h3>
      <div className="mood-picker">
        {MOODS.map((m) => (
          <button
            key={m.v}
            className={m.v === mood ? 'active' : ''}
            onClick={() => setMood(m.v)}
            title={m.l}
          >
            {m.e}
          </button>
        ))}
      </div>

      <details className="expand">
        <summary>写一点自我反思（可选）</summary>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="今天的我想对自己说点什么？"
          rows={3}
          style={{
            width: '100%', marginTop: 10,
            border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, padding: 12,
            background: 'white', fontSize: 15,
          }}
        />
      </details>

      <details className="expand">
        <summary>感恩小语（可选）</summary>
        <textarea
          value={gratitude}
          onChange={(e) => setGratitude(e.target.value)}
          placeholder="今天想感谢谁 / 什么？"
          rows={2}
          style={{
            width: '100%', marginTop: 10,
            border: '1px solid rgba(0,0,0,0.07)', borderRadius: 14, padding: 12,
            background: 'white', fontSize: 15,
          }}
        />
      </details>

      <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn accent" onClick={handleSave} disabled={saving}>
          {saving ? <span className="spinner" /> : '💾'} 保存
        </button>
        <button className="btn ghost" onClick={handleReflect} disabled={aiLoading}>
          {aiLoading ? <span className="spinner" /> : '🪶'} 让小悦写一段给我
        </button>
        <button
          className="btn accent-soft"
          onClick={handleSummary}
          disabled={summaryLoading}
          title="写完三件事后，生成今日总结 + 分析 + 推荐"
        >
          {summaryLoading ? <span className="spinner" /> : '📝'} 生成今日总结
        </button>
        {savedAt && !error && <span className="muted">已保存 · {dayjs(savedAt).format('HH:mm:ss')}</span>}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              marginTop: 12, padding: '10px 14px', borderRadius: 12,
              background: 'rgba(229,138,123,0.15)', color: '#9c4a3a',
              fontSize: 14,
            }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {aiText && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: 16, padding: 16, borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(231,217,241,0.6), rgba(252,227,212,0.6))',
            border: '1px solid rgba(255,255,255,0.9)',
          }}
        >
          <div className="kicker" style={{ color: '#7a5aa6' }}>来自 小悦 的回信</div>
          <div style={{ fontSize: 15, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{aiText}</div>
        </motion.div>
      )}

      <DailySummary data={summary} />
    </motion.div>
  );
}
