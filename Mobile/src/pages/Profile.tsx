import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  LogOut,
  ChevronRight,
  Shield,
  Bell,
  Moon,
  Smartphone,
  ShoppingBag,
  CalendarDays,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { useReservationStore } from '../store/reservationStore';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loadUser } = useAuthStore();
  const { orders, fetchOrders } = useOrderStore();
  const { reservations, fetchReservations } = useReservationStore();

  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem('notifications') === 'true';
  });
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') !== 'light';
  });

  useEffect(() => {
    loadUser();
    if (isAuthenticated) {
      fetchOrders();
      fetchReservations();
    }
  }, [loadUser, fetchOrders, fetchReservations, isAuthenticated]);

  const userOrders = orders.filter((o) => o.UserID === user?.UserID);
  const userReservations = reservations.filter((r) => r.UserID === user?.UserID);

  const toggleNotifications = async () => {
    if (!notifications) {
      if (!('Notification' in window)) {
        alert('Ваш браузер не поддерживает уведомления');
        return;
      }
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotifications(true);
        localStorage.setItem('notifications', 'true');
      }
    } else {
      setNotifications(false);
      localStorage.setItem('notifications', 'false');
    }
  };

  const toggleTheme = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    if (newDark) {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
      const meta = document.getElementById('theme-color') as HTMLMetaElement | null;
      if (meta) meta.content = '#0A0A0A';
    } else {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
      const meta = document.getElementById('theme-color') as HTMLMetaElement | null;
      if (meta) meta.content = '#f0f0f0';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center px-6 animate-fade-in">
        <User size={56} className="text-charcoal-surface mb-4" />
        <h2 className="text-lg font-bold mb-1">Требуется вход</h2>
        <p className="text-muted text-sm text-center mb-6">Войдите, чтобы получить доступ к профилю</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-gold-gradient text-charcoal font-bold px-8 py-3 rounded-xl"
        >
          Войти
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-4 animate-fade-in">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-gold-gradient">Профиль</h1>
      </div>

      {}
      <div className="px-5 mt-4">
        <div className="glass rounded-2xl p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gold-gradient flex items-center justify-center shrink-0">
            <User size={32} className="text-charcoal" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold truncate">{user?.Username || 'Пользователь'}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <Shield size={14} className="text-gold" />
              <span className="text-xs text-gold font-medium">Клиент</span>
            </div>
            <p className="text-xs text-muted mt-1">
              С нами с {user?.CreatedDate ? new Date(user.CreatedDate).toLocaleDateString('ru-RU') : '...'}
            </p>
          </div>
        </div>
      </div>
      {}
      <div className="px-5 mt-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="glass rounded-xl p-4 text-center">
            <ShoppingBag size={24} className="text-gold mx-auto mb-2" />
            <p className="text-lg font-bold">{userOrders.length}</p>
            <p className="text-xs text-muted">Заказов</p>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <CalendarDays size={24} className="text-gold mx-auto mb-2" />
            <p className="text-lg font-bold">{userReservations.length}</p>
            <p className="text-xs text-muted">Бронирований</p>
          </div>
        </div>
      </div>

      {}
      <div className="px-5 mt-5">
        <h3 className="text-sm font-semibold text-platinum mb-3">Настройки</h3>
        <div className="glass rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-gold" />
              <span className="text-sm">Уведомления</span>
            </div>
            <button
              onClick={toggleNotifications}
              className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${
                notifications ? 'bg-gold' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  notifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Moon size={18} className="text-gold" />
              <span className="text-sm">Тёмная тема</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-12 h-7 rounded-full p-1 cursor-pointer transition-colors ${
                darkMode ? 'bg-gold' : 'bg-white/20'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  darkMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
          <button
            onClick={() => navigate('/orders')}
            className="w-full flex items-center justify-between px-4 py-3.5 border-b border-white/10 active:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Smartphone size={18} className="text-gold" />
              <span className="text-sm">Мои заказы</span>
            </div>
            <ChevronRight size={16} className="text-muted" />
          </button>
          <button
            onClick={() => navigate('/reservation')}
            className="w-full flex items-center justify-between px-4 py-3.5 active:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CalendarDays size={18} className="text-gold" />
              <span className="text-sm">Бронирования</span>
            </div>
            <ChevronRight size={16} className="text-muted" />
          </button>
        </div>
      </div>

      {}
      <div className="px-5 mt-5">
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="w-full flex items-center justify-center gap-2 glass border-red-900/50 text-red-400 py-3.5 rounded-xl active:scale-[0.98] transition-transform"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Выйти из аккаунта</span>
        </button>
      </div>
    </div>
  );
}
