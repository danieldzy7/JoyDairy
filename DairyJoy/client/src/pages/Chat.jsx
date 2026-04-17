import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { getChat, sendChat, clearChat } from '../api.js';

const QUICK = [
  '今天感觉有点累，和我聊聊吧',
  '帮我解读一下今天天秤座的运势',
  '今天黄历说的宜忌，对我有什么启发？',
  '我最近在想要不要换工作，有点迷茫',
];

export default function Chat() {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    getChat().then(setMsgs);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, sending]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg || sending) return;
    setInput('');
    setMsgs((arr) => [...arr, { role: 'user', content: msg, _local: true }]);
    setSending(true);
    try {
      const { reply } = await sendChat(msg);
      setMsgs((arr) => [...arr, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMsgs((arr) => [
        ...arr,
        { role: 'assistant', content: '（出错啦：' + (err.response?.data?.error || err.message) + '）' },
      ]);
    } finally {
      setSending(false);
    }
  };

  const reset = async () => {
    if (!confirm('清空和小悦的对话？')) return;
    await clearChat();
    setMsgs([]);
  };

  return (
    <>
      <div className="header-hero">
        <div>
          <div className="kicker">Chat with AI</div>
          <div className="hero-title">小悦 · 你的 AI 陪伴师</div>
          <div className="hero-sub">有什么想说的、想问的，都可以和我说</div>
        </div>
        <button className="btn ghost mini" onClick={reset}>清空对话</button>
      </div>

      <div className="card">
        <div className="chat-wrap">
          <div className="chat-log">
            {msgs.length === 0 && (
              <div className="empty">
                <div style={{ fontSize: 34, marginBottom: 8 }}>🌸</div>
                你好呀～我是小悦。<br />今天想和我聊点什么？
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 16 }}>
                  {QUICK.map((q) => (
                    <button key={q} className="btn ghost mini" onClick={() => send(q)}>{q}</button>
                  ))}
                </div>
              </div>
            )}
            {msgs.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`msg ${m.role}`}
              >
                {m.content}
              </motion.div>
            ))}
            {sending && (
              <div className="msg assistant">
                <span className="spinner" /> 小悦思考中…
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input">
            <textarea
              placeholder="按 Enter 发送，Shift+Enter 换行"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <button className="btn accent" onClick={() => send()} disabled={sending || !input.trim()}>
              发送
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
