import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ChevronRight, Clock, CheckCircle2, ChefHat, Package } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import { useAuthStore } from '../store/authStore';

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  'new': { label: 'В обработке', color: 'text-amber-400', icon: Clock },
  'preparing': { label: 'Готовится', color: 'text-orange-400', icon: ChefHat },
  'ready': { label: 'Готов', color: 'text-blue-400', icon: Package },
  'served': { label: 'Выдан', color: 'text-emerald-400', icon: CheckCircle2 },
  'completed': { label: 'Завершен', color: 'text-purple-400', icon: CheckCircle2 },
};

export default function Orders() {
  const navigate = useNavigate();
  const { orders, fetchOrders, isLoading } = useOrderStore();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const myOrders = orders.filter((o) => o.UserID === user?.UserID).sort(
    (a, b) => new Date(b.OrderDateTime).getTime() - new Date(a.OrderDateTime).getTime()
  );

  return (
    <div className="min-h-full pb-4 animate-fade-in">
      <div className="px-5 pt-6 pb-4  sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gold-gradient">Мои заказы</h1>
      </div>

      <div className="px-5 mt-3 space-y-3">
        {isLoading && (
          <div className="text-center py-10">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-muted text-sm">Загрузка...</p>
          </div>
        )}

        {!isLoading && myOrders.length === 0 && (
          <div className="text-center py-10">
            <ClipboardList size={48} className="text-charcoal-surface mx-auto mb-3" />
            <p className="text-muted text-sm">У вас пока нет заказов</p>
          </div>
        )}

        {myOrders.map((order) => {
          const cfg = statusConfig[order.Status] || { label: order.Status, color: 'text-muted', icon: Clock };
          const Icon = cfg.icon;
          return (
            <button
              key={order.OrderID}
              onClick={() => navigate(`/orders/${order.OrderID}`)}
              className="w-full glass rounded-xl p-4 text-left active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon size={18} className={cfg.color} />
                  <span className={`text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                </div>
                <ChevronRight size={16} className="text-muted" />
              </div>
              <p className="text-sm font-semibold">Заказ #{order.OrderID}</p>
              <p className="text-xs text-muted mt-0.5">
                {new Date(order.OrderDateTime).toLocaleString('ru-RU', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              {order.TableNumber && (
                <p className="text-xs text-muted mt-0.5">Стол {order.TableNumber}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

