import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { X, Sparkles, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ArchivePage from '@/pages/ArchivePage';
import SummaryPage from '@/pages/SummaryPage';
import WishlistPage from '@/pages/WishlistPage';
import { useWishlistStore } from '@/store/useWishlistStore';
import { getLastReminderDate, setLastReminderDate } from '@/utils/storage';
import { useNavigate } from 'react-router-dom';

function WeeklyReminder() {
  const [show, setShow] = useState(false);
  const wishlistCount = useWishlistStore((s) => s.getCount());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (wishlistCount === 0) return;
    if (location.pathname === '/wishlist') return;

    const lastReminder = getLastReminderDate();
    const now = new Date();
    const weekMs = 7 * 24 * 60 * 60 * 1000;

    if (!lastReminder || now.getTime() - new Date(lastReminder).getTime() >= weekMs) {
      setShow(true);
      setLastReminderDate(now.toISOString());
    }
  }, [wishlistCount, location.pathname]);

  if (!show || wishlistCount === 0) return null;

  return (
    <div className="relative z-30 bg-gradient-to-r from-primary-600/20 via-accent-movie/15 to-primary-600/20 border-b border-primary-500/30 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary-500/30 flex items-center justify-center flex-shrink-0 animate-pulse-slow">
            <Sparkles size={18} className="text-primary-300" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              你还有 <span className="text-accent-movie font-bold">{wishlistCount}</span> 件待看未完成
            </p>
            <p className="text-xs text-gray-400">周末了，选一个来消化吧～</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => navigate('/wishlist')}
            className="px-3 py-1.5 rounded-lg bg-primary-600/60 hover:bg-primary-500 text-white text-sm font-medium transition-colors flex items-center gap-1"
          >
            查看清单
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => setShow(false)}
            className="p-1.5 rounded-lg hover:bg-surface-light/50 text-gray-400 hover:text-white transition-colors"
            aria-label="关闭提醒"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [formOpen, setFormOpen] = useState(false);
  const [wishlistFormOpen, setWishlistFormOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <WeeklyReminder />
        <Navbar onAdd={() => {
          const path = window.location.pathname;
          if (path === '/wishlist') {
            setWishlistFormOpen(true);
          } else {
            setFormOpen(true);
          }
        }} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ArchivePage formOpen={formOpen} setFormOpen={setFormOpen} />} />
            <Route path="/wishlist" element={<WishlistPage formOpen={wishlistFormOpen} setFormOpen={setWishlistFormOpen} />} />
            <Route path="/summary" element={<SummaryPage />} />
          </Routes>
        </main>
        <footer className="relative z-10 py-6 text-center text-gray-500 text-sm border-t border-primary-800/30">
          <p>书影音存档 · 记录你的文化生活</p>
        </footer>
      </div>
    </Router>
  );
}
