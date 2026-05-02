import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Clock, Star, ChevronRight, Flame, Sparkles, Crown, ClipboardList, ChefHat, Package, CheckCircle2 } from 'lucide-react';
import LocationModal from '../components/LocationModal';
import { useMenuStore } from '../store/menuStore';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType; bg: string }> = {
  'new': { label: 'В обработке', color: 'text-amber-400', bg: 'bg-amber-500', icon: Clock },
  'preparing': { label: 'Готовится', color: 'text-orange-400', bg: 'bg-orange-500', icon: ChefHat },
  'ready': { label: 'Готов', color: 'text-blue-400', bg: 'bg-blue-500', icon: Package },
  'served': { label: 'Выдан', color: 'text-emerald-400', bg: 'bg-emerald-500', icon: CheckCircle2 },
};

export default function Home() {
  const navigate = useNavigate();
  const { items, fetchMenu } = useMenuStore();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { orders, fetchOrders } = useOrderStore();
  const [search, setSearch] = useState('');
  const [showLocation, setShowLocation] = useState(false);

  useEffect(() => {
    fetchMenu();
    if (isAuthenticated) fetchOrders();
  }, [fetchMenu, fetchOrders, isAuthenticated]);

  const popularItems = items.slice(0, 5);
  const filteredItems = search.trim()
    ? items.filter((i) => i.Name.toLowerCase().includes(search.toLowerCase()))
    : [];

  const userOrders = orders.filter((o) => o.UserID === user?.UserID);
  const activeOrder = userOrders
    .filter((o) => o.Status !== 'completed')
    .sort((a, b) => new Date(b.OrderDateTime).getTime() - new Date(a.OrderDateTime).getTime())[0];

  return (
    <div className="min-h-full pb-4 animate-fade-in">
      <div className="px-5 pt-6 pb-4 ">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center">
              <Crown size={18} className="text-charcoal" />
            </div>
            <div>
              <p className="text-xs text-muted">Добро пожаловать</p>
              <p className="text-sm font-semibold">{user?.Username || 'Гость'}</p>
            </div>
          </div>
          <button
            onClick={() => setShowLocation(true)}
            className="w-9 h-9 rounded-full glass flex items-center justify-center"
          >
            <MapPin size={18} className="text-gold" />
          </button>
        </div>

        {}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по меню"
            className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-gold transition-colors"
          />
        </div>
      </div>

      {}
      {activeOrder && (
        <div className="px-5 mt-4">
          <button
            onClick={() => navigate(`/orders/${activeOrder.OrderID}`)}
            className="w-full text-left"
          >
            {(() => {
              const cfg = statusConfig[activeOrder.Status] || statusConfig['new'];
              const Icon = cfg.icon;
              return (
                <div className={`relative overflow-hidden rounded-2xl glass p-5`}>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${cfg.bg} flex items-center justify-center shrink-0`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</span>
                        <span className="text-[10px] text-muted">• Заказ #{activeOrder.OrderID}</span>
                      </div>
                      <p className="text-sm font-medium truncate">
                        {activeOrder.TableNumber ? `Стол ${activeOrder.TableNumber}` : 'Самовывоз'}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        Нажмите, чтобы отследить статус
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-muted shrink-0" />
                  </div>
                </div>
              );
            })()}
          </button>
        </div>
      )}

      {}
      {search.trim() && (
        <div className="px-5 mt-3">
          <h3 className="text-sm font-semibold text-platinum mb-2">Результаты поиска</h3>
          <div className="space-y-2">
            {filteredItems.length === 0 && (
              <p className="text-muted text-sm">Ничего не найдено</p>
            )}
            {filteredItems.map((item) => (
              <button
                key={item.MenuItemID}
                onClick={() => navigate(`/menu/${item.MenuItemID}`)}
                className="w-full flex items-center gap-3 glass rounded-xl p-3 text-left"
              >
                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                  {item.Image ? (
                    <img src={item.Image} alt={item.Name} className="w-full h-full object-cover" />
                  ) : (
                    <Sparkles size={20} className="text-gold" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.Name}</p>
                  <p className="text-xs text-muted truncate">{item.Description}</p>
                </div>
                <span className="text-gold font-bold text-sm">{Number(item.Price).toFixed(0)} ₽</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {!search.trim() && (
        <>
          {}
          <div className="px-5 mt-4">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gold-dark to-gold p-5">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1 bg-charcoal/30 rounded-full px-2.5 py-1 mb-2">
                  <Star size={12} className="text-white" />
                  <span className="text-xs font-medium text-white">Премиум</span>
                </div>
                <h2 className="text-xl font-bold text-charcoal mb-1">Золотая Ложка</h2>
                <p className="text-charcoal/80 text-xs mb-3">Изысканные блюда и безупречный сервис</p>
                <button
                  onClick={() => navigate('/menu')}
                  className="bg-charcoal text-gold text-xs font-bold px-4 py-2 rounded-full active:scale-95 transition-transform"
                >
                  Перейти в меню
                </button>
              </div>
              <Flame className="absolute -right-4 -bottom-4 text-charcoal/10" size={120} />
            </div>
          </div>

          {}
          <div className="mt-6 px-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold">Меню</h3>
              <button onClick={() => navigate('/menu')} className="text-gold text-xs font-medium flex items-center gap-0.5">
                Все <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {items.map((item) => (
                <button
                  key={item.MenuItemID}
                  onClick={() => navigate(`/menu/${item.MenuItemID}`)}
                  className="glass rounded-xl p-3 text-left active:scale-[0.98] transition-transform"
                >
                  <div className="w-full h-24 rounded-lg bg-white/5 flex items-center justify-center mb-2 overflow-hidden">
                    {item.Image ? (
                      <img src={item.Image} alt={item.Name} className="w-full h-full object-cover" />
                    ) : (
                      <Sparkles size={28} className="text-gold" />
                    )}
                  </div>
                  <p className="text-sm font-medium truncate">{item.Name}</p>
                  <p className="text-xs text-muted truncate">{item.Description}</p>
                  <p className="text-gold text-xs font-bold mt-1">{Number(item.Price).toFixed(0)} ₽</p>
                </button>
              ))}
              {items.length === 0 && (
                <p className="text-muted text-sm col-span-2">Меню загружается...</p>
              )}
            </div>
          </div>

          {}
          <div className="px-5 mt-5 mb-4">
            <div className="glass rounded-xl p-4">
              <h4 className="text-sm font-semibold mb-2">О ресторане</h4>
              <p className="text-xs text-muted leading-relaxed">
                Золотая Ложка — это сочетание изысканной кухни, элегантной атмосферы и безупречного сервиса.
                Мы создаём кулинарные шедевры, чтобы каждый визит становился особенным событием.
              </p>
            </div>
          </div>
        </>
      )}
      {showLocation && <LocationModal onClose={() => setShowLocation(false)} />}
    </div>
  );
}

