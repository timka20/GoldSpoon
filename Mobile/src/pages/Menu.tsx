import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, ShoppingBag, Search, Sparkles } from 'lucide-react';
import { useMenuStore } from '../store/menuStore';
import { useCartStore } from '../store/cartStore';

export default function Menu() {
  const navigate = useNavigate();
  const { items, fetchMenu, isLoading } = useMenuStore();
  const { items: cartItems, addItem, updateQuantity } = useCartStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const getQty = (id: number) => {
    const found = cartItems.find((c) => c.menuItem.MenuItemID === id);
    return found ? found.quantity : 0;
  };

  const filtered = search.trim()
    ? items.filter((i) => i.Name.toLowerCase().includes(search.toLowerCase()))
    : items;

  return (
    <div className="min-h-full pb-4 animate-fade-in">
      <div className="px-5 pt-6 pb-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gold-gradient mb-4">Меню</h1>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Найти блюдо"
            className="w-full glass rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-muted focus:outline-none focus:border-gold transition-colors"
          />
        </div>
      </div>

      <div className="px-5 mt-3 space-y-3">
        {isLoading && (
          <div className="text-center py-10">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-muted text-sm">Загрузка меню...</p>
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-10">
            <ShoppingBag size={40} className="text-muted mx-auto mb-3" />
            <p className="text-muted text-sm">Блюда не найдены</p>
          </div>
        )}

        {filtered.map((item) => {
          const qty = getQty(item.MenuItemID);
          return (
            <div
              key={item.MenuItemID}
              onClick={() => navigate(`/menu/${item.MenuItemID}`)}
              className="glass rounded-xl p-4 flex gap-4 active:scale-[0.99] transition-transform"
            >
              <div className="w-20 h-20 rounded-xl bg-white/5 flex items-center justify-center shrink-0 overflow-hidden">
                {item.Image ? (
                  <img src={item.Image} alt={item.Name} className="w-full h-full object-cover" />
                ) : (
                  <Sparkles size={28} className="text-gold" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">{item.Name}</h3>
                <p className="text-xs text-muted mt-0.5 line-clamp-2">{item.Description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gold font-bold text-base">{Number(item.Price).toFixed(0)} ₽</span>
                  {qty === 0 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem(item);
                      }}
                      className="bg-gold-gradient text-charcoal w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <Plus size={18} strokeWidth={2.5} />
                    </button>
                  ) : (
                    <div
                      className="flex items-center gap-2 bg-white/5 rounded-full px-2 py-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => updateQuantity(item.MenuItemID, qty - 1)}
                        className="w-6 h-6 flex items-center justify-center text-gold"
                      >
                        <Minus size={14} strokeWidth={2.5} />
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{qty}</span>
                      <button
                        onClick={() => updateQuantity(item.MenuItemID, qty + 1)}
                        className="w-6 h-6 flex items-center justify-center text-gold"
                      >
                        <Plus size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

