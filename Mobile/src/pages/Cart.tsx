import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, BookmarkCheck } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useReservationStore } from '../store/reservationStore';
import { MdTableBar } from 'react-icons/md';
import { useOrderStore } from '../store/orderStore';

export default function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, total, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const { tables, reservations, fetchTables, fetchReservations } = useReservationStore();
  const { createOrder, fetchOrders, activeTableIds } = useOrderStore();
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTableSelect, setShowTableSelect] = useState(false);

  const handleOrder = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (items.length === 0) return;
    if (!showTableSelect) {
      await fetchTables();
      await fetchOrders();
      await fetchReservations();
      setShowTableSelect(true);
      return;
    }
    if (!selectedTable) return;

    setIsSubmitting(true);
    try {
      const orderId = await createOrder({
        tableId: selectedTable,
        items: items.map((i) => ({
          menuItemId: i.menuItem.MenuItemID,
          quantity: i.quantity,
        })),
      });
      clearCart();
      setShowTableSelect(false);
      navigate(`/orders/${orderId}`);
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  const myReservedTableIds = new Set(
    reservations
      .filter((r) => r.UserID === user?.UserID)
      .map((r) => r.TableID)
  );

  const otherReservedTableIds = new Set(
    reservations
      .filter((r) => r.UserID !== user?.UserID)
      .map((r) => r.TableID)
  );

  const availableTables = tables.filter((t) => {
    if (myReservedTableIds.has(t.TableID)) return true;
    return !t.IsReserved && !activeTableIds.includes(t.TableID) && !otherReservedTableIds.has(t.TableID);
  });

  if (items.length === 0 && !showTableSelect) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center px-6 animate-fade-in">
        <ShoppingBag size={56} className="text-charcoal-surface mb-4" />
        <h2 className="text-lg font-bold mb-1">Корзина пуста</h2>
        <p className="text-muted text-sm text-center mb-6">Добавьте блюда из меню, чтобы оформить заказ</p>
        <button
          onClick={() => navigate('/menu')}
          className="bg-gold-gradient text-charcoal font-bold px-8 py-3 rounded-xl active:scale-[0.98] transition-transform"
        >
          Перейти в меню
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-4 animate-fade-in">
      <div className="px-5 pt-6 pb-4  sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gold-gradient">Корзина</h1>
        <p className="text-muted text-xs mt-1">{items.reduce((s, i) => s + i.quantity, 0)} позиций</p>
      </div>

      {!showTableSelect ? (
        <>
          <div className="px-5 mt-3 space-y-3">
            {items.map((item) => (
              <div key={item.menuItem.MenuItemID} className="glass rounded-xl p-4 flex gap-4">
                <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                  {item.menuItem.Image ? (
                    <img src={item.menuItem.Image} alt={item.menuItem.Name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-gold text-xl font-bold">{item.menuItem.Name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold truncate">{item.menuItem.Name}</h3>
                  <p className="text-gold text-sm font-bold mt-0.5">{(Number(item.menuItem.Price) * item.quantity).toFixed(0)} ₽</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-2 bg-white/5 rounded-full px-2 py-1">
                      <button
                        onClick={() => updateQuantity(item.menuItem.MenuItemID, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-gold"
                      >
                        <Minus size={14} strokeWidth={2.5} />
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.menuItem.MenuItemID, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-gold"
                      >
                        <Plus size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.menuItem.MenuItemID)}
                      className="text-muted active:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 mt-6">
            <div className="glass rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-muted text-sm">Итого</span>
                <span className="text-xl font-bold text-gold">{total().toFixed(0)} ₽</span>
              </div>
            </div>
            <button
              onClick={handleOrder}
              className="w-full bg-gold-gradient text-charcoal font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              Оформить заказ <ArrowRight size={18} />
            </button>
          </div>
        </>
      ) : (
        <div className="px-5 mt-3">
          <h3 className="text-sm font-semibold mb-3">Выберите стол</h3>
          {availableTables.length === 0 ? (
            <div className="glass rounded-xl p-6 text-center mb-6">
              <MdTableBar size={32} className="text-muted mx-auto mb-2" />
              <p className="text-sm text-platinum font-medium">Сейчас нет свободных столов</p>
              <p className="text-xs text-muted mt-1">Попробуйте позже</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {availableTables.map((table) => {
                const isMyReserved = myReservedTableIds.has(table.TableID);
                return (
                  <button
                    key={table.TableID}
                    onClick={() => setSelectedTable(table.TableID)}
                    className={`p-4 rounded-xl text-left transition-colors relative ${
                      selectedTable === table.TableID
                        ? 'bg-gold/20 border border-gold'
                        : 'glass rounded-xl active:scale-[0.98]'
                    }`}
                  >
                    {isMyReserved && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                        <BookmarkCheck size={12} />
                        Ваша бронь
                      </div>
                    )}
                    <p className="text-sm font-semibold">Стол {table.TableNumber}</p>
                    <p className="text-xs text-muted mt-0.5">{table.Capacity} мест</p>
                  </button>
                );
              })}
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => setShowTableSelect(false)}
              className="flex-1 glass rounded-xl text-white font-medium py-3 rounded-xl"
            >
              Назад
            </button>
            <button
              onClick={handleOrder}
              disabled={!selectedTable || isSubmitting}
              className="flex-[2] bg-gold-gradient text-charcoal font-bold py-3 rounded-xl disabled:opacity-60 active:scale-[0.98] transition-transform"
            >
              {isSubmitting ? 'Оформление...' : `Заказать на ${total().toFixed(0)} ₽`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

