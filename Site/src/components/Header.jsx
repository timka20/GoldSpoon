import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Utensils, LogIn, User, LogOut, Menu as MenuIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ onOpenLogin }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
  };

  const isActive = (path) => location.pathname === path;
  const isHome = location.pathname === '/';

  const showSolid = !isHome || scrolled || mobileOpen;

  return (
    <header className="fixed top-0 left-0 w-full z-50 py-6">
      <div className={`absolute inset-0 transition-opacity duration-500 ${showSolid ? 'opacity-100' : 'opacity-0'} bg-[#0B0C10]/80 backdrop-blur-md border-b border-white/5`} />

      <div className="relative container mx-auto px-8 md:px-20 flex justify-between items-center ">
        <Link to='/' className="flex items-center gap-3 z-50 -translate-x-[35%]" onClick={() => setMobileOpen(false)}>
          <Utensils size={32} className="text-[#C59C22]" />
          <span className="text-2xl font-serif font-bold tracking-wide text-[#C59C22]">Золотая ложка </span>
        </Link>

        <nav className="hidden lg:flex absolute left-1/2 transform -translate-x-[48%] items-center gap-[80px]">
          <Link to="/" className={`text-m font-medium tracking-wide transition-colors pb-1 hover:text-[#C59C22] ${isActive('/') ? 'text-[#C59C22]' : 'text-white'}`}>Главная</Link>
          <Link to="/menu" className={`text-s font-medium tracking-wide transition-colors pb-1 hover:text-[#C59C22] ${isActive('/menu') ? 'text-[#C59C22]' : 'text-white'}`}>Меню</Link>
          <Link to="/contacts" className="text-s font-medium tracking-wide transition-colors pb-1 text-white hover:text-[#C59C22]">Контакты</Link>
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="hidden lg:flex items-center gap-4 translate-x-[58%]">
              <Link
                to="/profile"
                className="flex items-center gap-2 text-white hover:text-[#C59C22] transition-colors text-sm font-medium"
              >
                <User size={18} />
                <span className="max-w-[120px] truncate">{user?.Username || 'Профиль'}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer border border-red-500/50 text-red-400 rounded-full hover:bg-red-500/10 transition-all text-sm font-medium"
              >
                <LogOut size={16} />
                Выйти
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="hidden lg:flex items-center gap-3 px-8 py-2 translate-x-[58%] cursor-pointer border border-[#C59C22] text-[#C59C22] rounded-full hover:bg-[#C59C22] hover:text-black transition-all text-sm font-medium group"
            >
              <LogIn size={18} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
              Войти
            </button>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-[#C59C22] z-50"
            aria-label="Открыть меню"
            style={{
              backgroundColor: '#303030',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #C59C22',
            }}
          >
            {mobileOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            ) : (
              <MenuIcon size={24} />
            )}
          </button>
        </div>
      </div>

      <div className={`absolute top-0 left-0 w-full bg-[#0b0c10] lg:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[500px] opacity-100 pt-24' : 'max-h-0 opacity-0'}`}>
        <div className="px-8 md:px-20 pb-8 pt-4 flex flex-col space-y-2">
          <Link to="/" onClick={() => setMobileOpen(false)} className={`block text-xl font-medium py-3 transition-colors hover:text-[#D4AF37] ${isActive('/') ? 'text-[#D4AF37]' : 'text-white'}`}>Главная</Link>
          <Link to="/menu" onClick={() => setMobileOpen(false)} className={`block text-xl font-medium py-3 transition-colors hover:text-[#D4AF37] ${isActive('/menu') ? 'text-[#D4AF37]' : 'text-white'}`}>Меню</Link>
          <Link to="/contacts" onClick={() => setMobileOpen(false)} className="block text-xl font-medium py-3 transition-colors text-white hover:text-[#D4AF37]">Контакты</Link>

          {isAuthenticated ? (
            <div className="pt-6 border-t border-white/10 mt-6 space-y-3">
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-[#D4AF37] hover:text-white transition">
                <User size={20} />
                <span className="text-base font-medium">{user?.Username || 'Профиль'}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-8 py-2 border border-red-500/50 text-red-400 rounded-full hover:bg-red-500/10 transition-all text-base font-medium group"
              >
                <LogOut size={18} strokeWidth={1.5} />
                Выйти
              </button>
            </div>
          ) : (
            <div className="pt-6 border-t border-white/10 mt-6">
              <button
                onClick={() => { setMobileOpen(false); onOpenLogin(); }}
                className="flex items-center gap-3 px-8 py-2 border border-[#D4AF37] text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-black transition-all text-base font-medium group"
              >
                <LogIn size={18} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
                Войти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
