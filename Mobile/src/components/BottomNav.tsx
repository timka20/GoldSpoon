import { NavLink } from 'react-router-dom';
import { Home, UtensilsCrossed, ShoppingBag, CalendarDays, User } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

const navItems = [
  { to: '/', label: 'Главная', icon: Home },
  { to: '/menu', label: 'Меню', icon: UtensilsCrossed },
  { to: '/cart', label: 'Корзина', icon: ShoppingBag },
  { to: '/reservation', label: 'Бронь', icon: CalendarDays },
  { to: '/profile', label: 'Профиль', icon: User },
];

export default function BottomNav() {
  const cartCount = useCartStore((s) => s.count());

  return (
    <nav className="shrink-0 glass border-t border-white/10 safe-bottom">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${
                isActive ? 'text-gold' : 'text-muted'
              }`
            }
          >
            <div className="relative">
              <item.icon size={22} strokeWidth={2} />
              {item.to === '/cart' && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-gold text-charcoal text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

