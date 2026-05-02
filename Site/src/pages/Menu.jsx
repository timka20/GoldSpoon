import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ShoppingCart, Check } from 'lucide-react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const MenuItemCard = ({ item, onAddToCart, added }) => {
  return (
    <div className="group flex flex-col bg-[#13141a] rounded-2xl overflow-hidden shadow-lg border border-white/5 hover:border-[#D4AF37]/50 transition-all duration-300 hover:-translate-y-1">
      <div className="relative w-full h-64 overflow-hidden">
        <img
          src={item.Image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'}
          alt={item.Name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#13141a] via-transparent to-transparent opacity-60"></div>
      </div>

      <div className="p-6 flex flex-col flex-grow relative z-10 -mt-4 bg-[#13141a] rounded-t-2xl">
        <h3 className="text-xl font-serif text-white mb-2 group-hover:text-[#D4AF37] transition-colors">{item.Name}</h3>

        <div className="text-[#A39D8F] text-sm mb-6 flex-grow">
          <p className="font-medium text-gray-300 mb-1 text-xs uppercase tracking-wider">Состав:</p>
          <p className="leading-relaxed text-[#A39D8F] line-clamp-3">{item.Description || 'Описание отсутствует'}</p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <span className="text-[#D4AF37] font-bold text-lg">{item.Price} ₽</span>
          <button
            onClick={() => onAddToCart(item)}
            className={`flex items-center gap-2 cursor-pointer border px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              added
                ? 'bg-green-500/20 border-green-500 text-green-400'
                : 'border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black'
            }`}
          >
            {added ? <Check size={16} /> : <ShoppingCart size={16} />}
            {added ? 'Добавлено' : 'В корзину'}
          </button>
        </div>
      </div>
    </div>
  );
};

const MenuPage = () => {
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("Все блюда");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      return [];
    }
  });
  const [addedIds, setAddedIds] = useState(new Set());

  useEffect(() => {
    const loadMenu = async () => {
      try {
        setLoading(true);
        const data = await api.getMenu();
        const active = (data || []).filter(item => item.IsActive !== false);
        setMenuItems(active);
      } catch (err) {
        setError('Не удалось загрузить меню');
      } finally {
        setLoading(false);
      }
    };
    loadMenu();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    { id: 'all', label: 'Все блюда' },
    { id: 'main', label: 'Горячие блюда' },
    { id: 'salads', label: 'Салаты' },
    { id: 'desserts', label: 'Десерты' },
    { id: 'drinks', label: 'Напитки' },
  ];

  const filteredItems = selectedCategory === 'Все блюда'
    ? menuItems
    : menuItems.filter(item => {
        const cat = (item.Category || '').toLowerCase();
        if (selectedCategory === 'Горячие блюда') return cat.includes('горяч') || cat.includes('main');
        if (selectedCategory === 'Салаты') return cat.includes('салат') || cat.includes('salad');
        if (selectedCategory === 'Десерты') return cat.includes('десерт') || cat.includes('dessert');
        if (selectedCategory === 'Напитки') return cat.includes('напиток') || cat.includes('drink');
        return true;
      });

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.menuItemId === item.MenuItemID);
      if (existing) {
        return prev.map(i => i.menuItemId === item.MenuItemID ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { menuItemId: item.MenuItemID, name: item.Name, price: item.Price, image: item.Image, quantity: 1 }];
    });
    setAddedIds(prev => new Set(prev).add(item.MenuItemID));
    setTimeout(() => {
      setAddedIds(prev => {
        const next = new Set(prev);
        next.delete(item.MenuItemID);
        return next;
      });
    }, 1500);
  };

  return (
    <div className="bg-[#0b0c10] min-h-screen font-sans text-white">

      <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1920')",
        }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-[#0b0c10]"></div>

        <div className="relative z-10 container mx-auto px-4 md:px-20 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#D4AF37] mb-6 drop-shadow-lg">
            Меню
          </h1>
          <p className="text-center text-white text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
            Ресторан <span className="text-[#D4AF37] font-medium">"Золотая Ложка"</span> — это место, где каждое блюдо становится произведением искусства,
            а каждый визит превращается в незабываемое гастрономическое путешествие.
          </p>
        </div>
      </section>

      <main className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-7xl">

          <div className="flex justify-end mb-12 relative" ref={dropdownRef}>

            {/* <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`
                flex items-center gap-3 px-8 py-3 
                border border-[#D4AF37] cursor-pointer text-[#D4AF37] 
                rounded-full hover:bg-[#D4AF37] hover:text-black 
                transition-all duration-300 text-sm font-medium group
                ${isDropdownOpen ? 'bg-[#D4AF37] text-black' : ''}
              `}
            >
              <span>{selectedCategory}</span>
              <ChevronDown
                size={18}
                strokeWidth={2}
                className={`transition-transform  duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button> */}

            <div
              className={`
                absolute top-full right-0 mt-4 w-64 
                bg-[#1e1f25] border border-[#D4AF37]/30 
                rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50
                transition-all duration-300 ease-out origin-top-right
                ${isDropdownOpen ? 'opacity-100 scale-100 visible translate-y-0' : 'opacity-0 scale-95 invisible -translate-y-2'}
              `}
            >
              <div className="py-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.label);
                      setIsDropdownOpen(false);
                    }}
                    className={`
                      w-full text-left cursor-pointer px-6 py-3 text-sm font-medium transition-colors
                      hover:bg-[#D4AF37] hover:text-black
                      ${selectedCategory === cat.label ? 'text-[#D4AF37] bg-white/5' : 'text-gray-300'}
                    `}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {loading ? (
            <div className="text-center py-20 text-gray-400">Загрузка меню...</div>
          ) : error ? (
            <div className="text-center py-20 text-red-400">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <MenuItemCard
                  key={item.MenuItemID}
                  item={item}
                  onAddToCart={addToCart}
                  added={addedIds.has(item.MenuItemID)}
                />
              ))}
            </div>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="text-center py-20 text-gray-400">Блюда не найдены</div>
          )}

        </div>
      </main>
    </div>
  );
};

export default MenuPage;
