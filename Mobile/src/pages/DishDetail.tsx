import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, ShoppingBag, Sparkles, Flame, Zap, Droplets, Wheat } from 'lucide-react';
import { useMenuStore } from '../store/menuStore';
import { useCartStore } from '../store/cartStore';

interface Nutrient {
  label: string;
  value: string;
  icon: React.ReactNode;
}

function parseNutrients(description: string): { cleanDescription: string; nutrients: Nutrient[] } {
  const pattern = /(Жиры|Углеводы|Белки|Энерг\. ценность)\s*·\s*([\d.]+\s*(?:г|ккал))/gi;
  const nutrients: Nutrient[] = [];
  let cleanDescription = description;

  let match;
  while ((match = pattern.exec(description)) !== null) {
    const label = match[1];
    const value = match[2];
    let icon = <Sparkles size={14} />;
    if (label === 'Жиры') icon = <Droplets size={14} />;
    if (label === 'Углеводы') icon = <Wheat size={14} />;
    if (label === 'Белки') icon = <Zap size={14} />;
    if (label === 'Энерг. ценность') icon = <Flame size={14} />;
    nutrients.push({ label, value, icon });
    cleanDescription = cleanDescription.replace(match[0], '').trim();
  }

  cleanDescription = cleanDescription.replace(/\s+/g, ' ').trim();

  return { cleanDescription, nutrients };
}

export default function DishDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { items, fetchMenu } = useMenuStore();
  const { items: cartItems, addItem, updateQuantity } = useCartStore();
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const item = items.find((i) => i.MenuItemID === Number(id));

  useEffect(() => {
    if (item) {
      const cartItem = cartItems.find((c) => c.menuItem.MenuItemID === item.MenuItemID);
      setQuantity(cartItem ? cartItem.quantity : 0);
    }
  }, [item, cartItems]);

  if (!item) {
    return (
      <div className="min-h-full flex items-center justify-center animate-fade-in">
        <p className="text-muted">Блюдо не найдено</p>
      </div>
    );
  }

  const { cleanDescription, nutrients } = parseNutrients(item.Description);

  const handleAdd = () => {
    addItem(item);
    setQuantity((q) => q + 1);
  };

  const handleUpdate = (newQty: number) => {
    if (newQty <= 0) {
      updateQuantity(item.MenuItemID, 0);
      setQuantity(0);
    } else {
      updateQuantity(item.MenuItemID, newQty);
      setQuantity(newQty);
    }
  };

  return (
    <div className="min-h-full animate-fade-in">
      {}
      <div className="relative h-64 bg-gradient-to-b from-charcoal-light to-charcoal">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full glass flex items-center justify-center active:scale-90 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>
        {item.Image ? (
          <img src={item.Image} alt={item.Name} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles size={64} className="text-gold opacity-40" />
          </div>
        )}
      </div>

      {}
      <div className="px-5 -mt-8 relative z-10 pb-8">
        <div className="glass rounded-2xl p-5">
          <h1 className="text-2xl font-bold text-snow mb-2">{item.Name}</h1>
          <p className="text-gold text-xl font-bold">{Number(item.Price).toFixed(0)} ₽</p>

          {}
          {nutrients.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {nutrients.map((n, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5"
                >
                  <span className="text-gold">{n.icon}</span>
                  <span className="text-xs text-white/80">{n.label}</span>
                  <span className="text-xs font-bold text-white">{n.value}</span>
                </div>
              ))}
            </div>
          )}

          {}
          {cleanDescription && (
            <p className="text-muted text-sm mt-4 leading-relaxed">{cleanDescription}</p>
          )}

          {}
          <div className="mt-8 flex items-center justify-between">
            <span className="text-sm text-platinum font-medium">Количество</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleUpdate(quantity - 1)}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-gold active:scale-90 transition-transform"
              >
                <Minus size={18} />
              </button>
              <span className="text-lg font-bold w-6 text-center">{quantity}</span>
              <button
                onClick={() => quantity === 0 ? handleAdd() : handleUpdate(quantity + 1)}
                className="w-10 h-10 rounded-full glass flex items-center justify-center text-gold active:scale-90 transition-transform"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {}
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="w-full mt-6 bg-gold-gradient text-charcoal font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <ShoppingBag size={20} />
              Добавить в корзину
            </button>
          ) : (
            <button
              onClick={() => navigate('/cart')}
              className="w-full mt-6 bg-gold-gradient text-charcoal font-bold py-4 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <ShoppingBag size={20} />
              В корзине — перейти
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
