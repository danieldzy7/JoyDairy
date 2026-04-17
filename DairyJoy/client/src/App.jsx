import { NavLink, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/Home.jsx';
import Diary from './pages/Diary.jsx';
import Horoscope from './pages/Horoscope.jsx';
import Almanac from './pages/Almanac.jsx';
import Chat from './pages/Chat.jsx';
import Temple from './pages/Temple.jsx';
import { getProfile } from './api.js';

export default function App() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfile().then(setProfile).catch(() => setProfile({ name: 'Friend', zodiac: 'libra' }));
  }, []);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="logo">悦</div>
            <div>
              Joy Diary <small>· 悦记 {profile?.name ? `· Hi, ${profile.name}` : ''}</small>
            </div>
          </div>
          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>今日</NavLink>
            <NavLink to="/diary" className={({ isActive }) => (isActive ? 'active' : '')}>日记</NavLink>
            <NavLink to="/horoscope" className={({ isActive }) => (isActive ? 'active' : '')}>星座</NavLink>
            <NavLink to="/almanac" className={({ isActive }) => (isActive ? 'active' : '')}>万年历</NavLink>
            <NavLink to="/temple" className={({ isActive }) => (isActive ? 'active' : '')}>禅房</NavLink>
            <NavLink to="/chat" className={({ isActive }) => (isActive ? 'active' : '')}>小悦</NavLink>
          </nav>
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home profile={profile} />} />
          <Route path="/diary" element={<Diary />} />
          <Route path="/horoscope" element={<Horoscope profile={profile} />} />
          <Route path="/almanac" element={<Almanac />} />
          <Route path="/temple" element={<Temple />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>
    </div>
  );
}
