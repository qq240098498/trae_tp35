import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Film, Music2, Gamepad2, Plus, Layers, ListTodo } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';

interface NavbarProps {
  onAdd: () => void;
}

export default function Navbar({ onAdd }: NavbarProps) {
  const location = useLocation();
  const wishlistCount = useWishlistStore((s) => s.getCount());

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-surface-dark/70 border-b border-primary-800/40">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-game flex items-center justify-center shadow-lg shadow-primary-600/30 group-hover:shadow-primary-500/50 transition-shadow">
              <Layers size={22} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 flex gap-0.5">
              <Film size={9} className="text-accent-movie" />
              <BookOpen size={9} className="text-accent-book" />
              <Music2 size={9} className="text-accent-album" />
              <Gamepad2 size={9} className="text-accent-game" />
            </div>
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-white leading-tight">
              书影音存档
            </h1>
            <p className="text-xs text-gray-400">记录你的文化生活</p>
          </div>
        </NavLink>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-surface/60 rounded-xl border border-primary-800/40">
            <NavLink
              to="/"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/')
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-surface-light'
              }`}
            >
              存档列表
            </NavLink>
            <NavLink
              to="/wishlist"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                isActive('/wishlist')
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-surface-light'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <ListTodo size={16} />
                待看清单
              </span>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs font-bold bg-accent-movie text-white rounded-full shadow-md">
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </NavLink>
            <NavLink
              to="/summary"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/summary')
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-surface-light'
              }`}
            >
              年度总结
            </NavLink>
          </div>

          <button
            type="button"
            onClick={onAdd}
            className="btn btn-primary ml-2"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">添加条目</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
