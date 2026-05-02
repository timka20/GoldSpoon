import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, User, LogOut, Minus, Plus, Trash2,
  Clock, Settings, ChevronRight, Package, Calendar, Star, X, LogIn
} from 'lucide-react';
import { getOrderStatus } from '../utils/orderStatus';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { useAvailableTables } from '../hooks/useAvailableTables';
import InfoOrder from '../components/InfoOrder';

const ReviewModal = ({ isOpen, onClose, orderId, onSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.createReview({ orderId, rating, comment });
      onSubmitted();
      onClose();
    } catch (err) {
      setError(err.message || 'Ошибка при создании отзыва');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1a1a2e] rounded-2xl w-full max-w-md border border-white/10 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-medium">Оставить отзыв</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Оценка</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onClick={() => setRating(star)}>
                  <Star size={24} className={star <= rating ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-600'} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Комментарий</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={4}
              className="w-full bg-[#3a3a4e] text-white px-4 py-3 rounded-lg border border-transparent focus:border-[#D4AF37] focus:outline-none transition text-sm resize-none"
              placeholder="Расскажите о вашем впечатлении..."
            />
          </div>
          {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4AF37] hover:bg-[#b5952f] disabled:opacity-50 text-black font-medium py-3 rounded-lg transition text-sm"
          >
            {loading ? 'Отправка...' : 'Отправить отзыв'}
          </button>
        </form>
      </div>
    </div>
  );
};

const ViewReviewModal = ({ isOpen, onClose, review }) => {
  if (!isOpen || !review) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1a1a2e] rounded-2xl w-full max-w-md border border-white/10 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-medium">Ваш отзыв</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Оценка</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={24} className={star <= (review.Rating || 0) ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-600'} />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Комментарий</label>
            <div className="w-full bg-[#3a3a4e] text-white px-4 py-3 rounded-lg border border-white/10 text-sm min-h-[100px]">
              {review.Comment || 'Без комментария'}
            </div>
          </div>
          <div className="text-gray-500 text-xs">
            {review.CreatedAt ? new Date(review.CreatedAt).toLocaleString('ru-RU') : ''}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReservationModal = ({ isOpen, onClose, onCreated, availableTables }) => {
  const [tableId, setTableId] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [people, setPeople] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const suitableTables = availableTables.filter(t => {
    const min = Number(people);
    const max = min >= 5 ? Infinity : min + 1;
    return t.Capacity >= min && t.Capacity <= max;
  });

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (suitableTables.length > 0) {
        setTableId(String(suitableTables[0].TableID));
      } else {
        setTableId('');
      }
    }
  }, [isOpen, suitableTables.length]);

  useEffect(() => {
    const current = suitableTables.find(t => String(t.TableID) === tableId);
    if (!current && suitableTables.length > 0) {
      setTableId(String(suitableTables[0].TableID));
    }
  }, [people, suitableTables, tableId]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tableId || !dateTime) {
      setError('Заполните все поля');
      return;
    }
    if (Number(people) < 1) {
      setError('Минимальное количество гостей — 1');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.createReservation({
        tableId: Number(tableId),
        reservationDateTime: new Date(dateTime).toISOString(),
        numberOfPeople: Number(people),
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err.message || 'Ошибка при бронировании');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#1a1a2e] rounded-2xl w-full max-w-md border border-white/10 shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-medium">Забронировать стол</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Количество человек</label>
            <input
              type="number"
              min={1}
              max={20}
              value={people}
              onChange={e => setPeople(e.target.value)}
              className="w-full bg-[#3a3a4e] text-white px-4 py-3 rounded-lg border border-transparent focus:border-[#D4AF37] focus:outline-none transition text-sm"
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Стол</label>
            <select
              value={tableId}
              onChange={e => setTableId(e.target.value)}
              className="w-full bg-[#3a3a4e] text-white px-4 py-3 rounded-lg border border-transparent focus:border-[#D4AF37] focus:outline-none transition text-sm"
            >
              {suitableTables.map(t => (
                <option key={t.TableID} value={t.TableID}>Стол {t.TableNumber} (мест: {t.Capacity})</option>
              ))}
              {suitableTables.length === 0 && <option>Нет подходящих столов</option>}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Дата и время</label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={e => setDateTime(e.target.value)}
              className="w-full bg-[#3a3a4e] text-white px-4 py-3 rounded-lg border border-transparent focus:border-[#D4AF37] focus:outline-none transition text-sm"
            />
          </div>
          {error && <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
          <button
            type="submit"
            disabled={loading || suitableTables.length === 0}
            className="w-full bg-[#D4AF37] hover:bg-[#b5952f] disabled:opacity-50 text-black font-medium py-3 rounded-lg transition text-sm"
          >
            {loading ? 'Бронирование...' : 'Забронировать'}
          </button>
        </form>
      </div>
    </div>
  );
};

const AuthPrompt = ({ onLogin, icon, title, subtitle }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-500">
    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
      {icon}
    </div>
    <p className="text-lg text-white mb-1">{title}</p>
    <p className="text-sm text-gray-400 mb-6">{subtitle}</p>
    <button
      onClick={onLogin}
      className="flex items-center gap-2 px-6 py-2 bg-[#D4AF37] hover:bg-[#b5952f] text-black rounded-xl transition font-medium text-sm"
    >
      <LogIn size={16} />
      Войти в аккаунт
    </button>
  </div>
);

const ProfilePage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { onOpenLogin } = useOutletContext();
  const {
    availableForReservation,
    availableForOrder,
    myReservations,
    loading: tablesLoading,
  } = useAvailableTables();

  const [activeTab, setActiveTab] = useState('order');
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; }
  });
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingReservations, setLoadingReservations] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [infoOrderOpen, setInfoOrderOpen] = useState(false);
  const [reviewOrderId, setReviewOrderId] = useState(null);
  const [viewReview, setViewReview] = useState(null);
  const [existingReviews, setExistingReviews] = useState(new Map());
  const [reservationOpen, setReservationOpen] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState('');
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (activeTab === 'history' && isAuthenticated) loadOrders();
    if (activeTab === 'reservations' && isAuthenticated) loadReservations();
  }, [activeTab, isAuthenticated]);

  useEffect(() => {
    if (availableForOrder.length > 0) {
      setSelectedTableId(String(availableForOrder[0].TableID));
    } else {
      setSelectedTableId('');
    }
  }, [availableForOrder]);

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const [orderData, reviewData] = await Promise.all([
        api.getOrders(),
        api.getReviews().catch(() => []),
      ]);
      setOrders(orderData || []);
      const map = new Map();
      (reviewData || []).forEach(r => {
        if (r.OrderID) map.set(r.OrderID, r);
      });
      setExistingReviews(map);
    } catch {
      setOrders([]);
      setExistingReviews(new Map());
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadReservations = async () => {
    setLoadingReservations(true);
    try {
      const data = await api.getReservations();
      setReservations(data || []);
    } catch {
      setReservations([]);
    } finally {
      setLoadingReservations(false);
    }
  };

  const updateQty = (menuItemId, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.menuItemId === menuItemId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (menuItemId) => {
    setCartItems(prev => prev.filter(item => item.menuItemId !== menuItemId));
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const handleOrderSubmit = async () => {
    if (!isAuthenticated) {
      onOpenLogin();
      return;
    }
    if (cartItems.length === 0) return;
    if (!selectedTableId) {
      setOrderError('Выберите стол');
      return;
    }
    setOrderSubmitting(true);
    setOrderError('');
    try {
      await api.createOrder({
        tableId: Number(selectedTableId),
        items: cartItems.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity })),
      });
      setCartItems([]);
      localStorage.removeItem('cart');
      setActiveTab('history');
    } catch (err) {
      setOrderError(err.message || 'Ошибка при оформлении заказа');
    } finally {
      setOrderSubmitting(false);
    }
  };

  const openOrderInfo = async (order) => {
    try {
      const data = await api.getOrder(order.OrderID);
      setSelectedOrder(data);
      setInfoOrderOpen(true);
    } catch {
      setSelectedOrder(order);
      setInfoOrderOpen(true);
    }
  };

  const cancelReservation = async (id) => {
    if (!confirm('Отменить бронирование?')) return;
    try {
      await api.deleteReservation(id);
      loadReservations();
    } catch (err) {
      alert(err.message || 'Ошибка');
    }
  };

  const allTabs = [
    { id: 'order', label: 'Текущий заказ', icon: <ShoppingBag size={18} /> },
    { id: 'history', label: 'История заказов', icon: <Clock size={18} /> },
    { id: 'reservations', label: 'Бронирования', icon: <Calendar size={18} /> },
    { id: 'settings', label: 'Настройки', icon: <Settings size={18} /> },
  ];

  const visibleTabs = isAuthenticated
    ? allTabs
    : allTabs.filter(t => t.id !== 'settings');

  return (
    <div className="bg-[#0b0c10] min-h-screen font-sans text-white pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">

        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-serif font-bold text-[#D4AF37] mb-2">Личный кабинет</h1>
          <p className="text-[#A39D8F] font-medium">Управляйте заказами и настройками профиля</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-[#13141a] rounded-2xl p-6 border border-white/5 shadow-xl sticky top-24">

              <div className="flex flex-col items-center mb-8 pb-8 border-b border-white/5">
                <div className="relative w-24 h-24 mb-4 group cursor-pointer">
                  <div className="absolute inset-0 bg-[#D4AF37] rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <div className="relative w-full h-full rounded-full border-2 border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] bg-[#1a1b22]">
                    <User size={40} strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="text-xl font-serif text-white">{user?.Username || 'Гость'}</h3>
                <p className="text-[#D4AF37] text-sm mt-1">{isAuthenticated ? 'Клиент' : 'Неавторизованный пользователь'}</p>
              </div>

              <nav className="space-y-3">
                {visibleTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-500 cursor-pointer group ${
                      activeTab === tab.id
                        ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20'
                        : 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {tab.icon}
                      {tab.label}
                    </div>
                    {activeTab === tab.id && <ChevronRight size={16} />}
                  </button>
                ))}
              </nav>

              {isAuthenticated && (
                <button
                  onClick={logout}
                  className="mt-8 w-full flex items-center cursor-pointer justify-center gap-2 text-[#A39D8F] hover:text-red-400 transition-colors text-sm py-2"
                >
                  <LogOut size={16} />
                  Выйти из аккаунта
                </button>
              )}

            </div>
          </div>

          <div className="flex-1">
            <div className="bg-[#13141a] rounded-2xl border border-white/5 min-h-[600px] p-6 md:p-8 relative overflow-hidden">

              <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              {activeTab === 'order' && (
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-serif text-white flex items-center gap-3">
                      <Package className="text-[#D4AF37]" /> Текущий заказ
                    </h2>
                  </div>

                  {cartItems.length > 0 ? (
                    <>
                      <div className="space-y-4 mb-8">
                        {cartItems.map(item => (
                          <div key={item.menuItemId} className="group flex flex-col sm:flex-row sm:items-center gap-4 bg-[#1a1b22] p-4 rounded-xl border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300">
                            <div className="w-full sm:w-20 h-32 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 relative">
                              <img src={item.image || '/cat.png'} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <h4 className="text-white text-lg font-medium truncate">{item.name}</h4>
                              <p className="text-[#D4AF37] text-sm">{item.price.toLocaleString()} ₽ / шт</p>
                            </div>

                            <div className="flex items-center gap-4 mt-2 sm:mt-0">
                              <div className="flex items-center bg-[#0b0c10] rounded-lg border border-white/10">
                                <button
                                  onClick={() => updateQty(item.menuItemId, -1)}
                                  className="w-8 h-8 flex items-center cursor-pointer justify-center text-[#A39D8F] hover:text-[#D4AF37] transition"
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="text-white text-sm font-medium w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQty(item.menuItemId, 1)}
                                  className="w-8 h-8 flex items-center justify-center cursor-pointer text-[#A39D8F] hover:text-[#D4AF37] transition"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              <div className="text-right min-w-[80px] hidden sm:block">
                                <p className="text-white font-bold text-lg">{(item.quantity * item.price).toLocaleString()} ₽</p>
                              </div>

                              <button
                                onClick={() => removeItem(item.menuItemId)}
                                className="w-8 h-8 flex items-center cursor-pointer justify-center text-[#A39D8F] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            <div className="sm:hidden flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                              <span className="text-[#A39D8F] text-xs">Итого:</span>
                              <span className="text-white font-bold">{(item.quantity * item.price).toLocaleString()} ₽</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mb-4">
                        <label className="block text-gray-300 text-sm mb-2">Выберите стол</label>
                        {tablesLoading ? (
                          <div className="text-gray-400 text-sm">Загрузка столов...</div>
                        ) : (
                          <select
                            value={selectedTableId}
                            onChange={e => setSelectedTableId(e.target.value)}
                            className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition"
                          >
                            {availableForOrder.map(t => (
                              <option key={t.TableID} value={t.TableID}>
                                Стол {t.TableNumber} (мест: {t.Capacity})
                                {myReservations.has(t.TableID) ? ' — ваше бронирование' : ''}
                              </option>
                            ))}
                            {availableForOrder.length === 0 && <option>Нет свободных столов</option>}
                          </select>
                        )}
                      </div>

                      {orderError && (
                        <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">{orderError}</div>
                      )}

                      <div className="bg-[#0b0c10] rounded-xl p-6 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          <p className="text-[#A39D8F] text-base mb-1">Общая сумма заказа</p>
                          <p className="text-3xl font-serif font-bold text-[#D4AF37]">{totalPrice.toLocaleString()} ₽</p>
                        </div>
                        <button
                          onClick={handleOrderSubmit}
                          disabled={orderSubmitting || availableForOrder.length === 0}
                          className="w-full sm:w-auto bg-[#D4AF37] cursor-pointer hover:bg-[#b5952f] disabled:opacity-50 duration-500 text-black font-medium py-3 px-8 rounded-xl transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.6)]"
                        >
                          {orderSubmitting ? 'Оформление...' : isAuthenticated ? 'Оформить заказ' : 'Войти и оформить'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <ShoppingBag size={32} className="text-gray-600" />
                      </div>
                      <p className="text-lg">Ваша корзина пуста</p>
                      <a href="/menu" className="mt-4 text-[#D4AF37] hover:text-white transition">Перейти в меню</a>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <Clock className="text-[#D4AF37]" />
                    <h2 className="text-2xl font-serif text-white">История заказов</h2>
                  </div>

                  {!isAuthenticated ? (
                    <AuthPrompt
                      onLogin={onOpenLogin}
                      icon={<Clock size={32} className="text-gray-600" />}
                      title="История заказов недоступна"
                      subtitle="Войдите в аккаунт, чтобы просматривать историю"
                    />
                  ) : loadingOrders ? (
                    <div className="text-center py-16 text-gray-400">Загрузка...</div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">У вас пока нет заказов</div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(item => (
                        <div key={item.OrderID} className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#1a1b22] p-5 rounded-xl border border-white/5 hover:bg-[#1f2029] transition cursor-pointer"
                          onClick={() => openOrderInfo(item)}>
                          <div className="flex items-center gap-4 mb-3 sm:mb-0">
                            <div className="w-12 h-12 rounded-full bg-[#0b0c10] flex items-center justify-center text-[#D4AF37] font-serif font-bold border border-white/10">
                              #{item.OrderID}
                            </div>
                            <div>
                              <p className="text-white font-medium">{new Date(item.OrderDateTime).toLocaleDateString('ru-RU')}</p>
                              <p className="text-[#A39D8F] text-xs">Стол {item.TableNumber}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                            {(() => {
                              const statusInfo = getOrderStatus(item.Status);
                              const StatusIcon = statusInfo.Icon;
                              const hasReview = existingReviews.get(item.OrderID);
                              return (
                                <>
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide flex items-center gap-1.5 ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} border`}>
                                    <StatusIcon size={14} />
                                    {statusInfo.label}
                                  </span>
                                  <button
                                    className={`transition ${hasReview ? 'text-[#D4AF37] hover:text-[#b5952f]' : 'text-[#A39D8F] hover:text-white'}`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (hasReview) setViewReview(hasReview);
                                      else setReviewOrderId(item.OrderID);
                                    }}
                                    title={hasReview ? 'Посмотреть отзыв' : 'Оставить отзыв'}
                                  >
                                    <Star size={20} className={hasReview ? 'fill-[#D4AF37]' : ''} />
                                  </button>
                                  <ChevronRight size={20} className="text-[#A39D8F]" />
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reservations' && (
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <Calendar className="text-[#D4AF37]" />
                      <h2 className="text-2xl font-serif text-white">Бронирования</h2>
                    </div>
                    {isAuthenticated && (
                      <button
                        onClick={() => setReservationOpen(true)}
                        className="bg-[#D4AF37] hover:bg-[#b5952f] text-black font-medium py-2 px-4 rounded-xl transition text-sm"
                      >
                        + Новое бронирование
                      </button>
                    )}
                  </div>

                  {!isAuthenticated ? (
                    <AuthPrompt
                      onLogin={onOpenLogin}
                      icon={<Calendar size={32} className="text-gray-600" />}
                      title="Бронирования недоступны"
                      subtitle="Войдите в аккаунт, чтобы управлять бронированиями"
                    />
                  ) : loadingReservations ? (
                    <div className="text-center py-16 text-gray-400">Загрузка...</div>
                  ) : reservations.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">У вас нет бронирований</div>
                  ) : (
                    <div className="space-y-4">
                      {reservations.map(r => (
                        <div key={r.ReservationID} className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#1a1b22] p-5 rounded-xl border border-white/5 hover:bg-[#1f2029] transition">
                          <div className="flex items-center gap-4 mb-3 sm:mb-0">
                            <div className="w-12 h-12 rounded-full bg-[#0b0c10] flex items-center justify-center text-[#D4AF37] font-serif font-bold border border-white/10">
                              <Calendar size={18} />
                            </div>
                            <div>
                              <p className="text-white font-medium">Стол {r.TableNumber}</p>
                              <p className="text-[#A39D8F] text-xs">{new Date(r.ReservationDateTime).toLocaleString('ru-RU')}</p>
                              <p className="text-[#A39D8F] text-xs">{r.NumberOfPeople} чел.</p>
                            </div>
                          </div>
                          <button
                            onClick={() => cancelReservation(r.ReservationID)}
                            className="text-red-400 hover:text-red-300 text-sm font-medium transition"
                          >
                            Отменить
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && isAuthenticated && (
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <Settings className="text-[#D4AF37]" />
                    <h2 className="text-2xl font-serif text-white">Настройки профиля</h2>
                  </div>

                  <div className="max-w-xl space-y-6">
                    <div className="space-y-2">
                      <label className="text-[#A39D8F] text-xs uppercase tracking-wider font-medium">Имя пользователя</label>
                      <input
                        type="text"
                        defaultValue={user?.Username || ''}
                        readOnly
                        className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none transition opacity-70"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[#A39D8F] text-xs uppercase tracking-wider font-medium">ID пользователя</label>
                      <input
                        type="text"
                        defaultValue={user?.UserID || ''}
                        readOnly
                        className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none transition opacity-70"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[#A39D8F] text-xs uppercase tracking-wider font-medium">Дата регистрации</label>
                      <input
                        type="text"
                        defaultValue={user?.CreatedDate ? new Date(user.CreatedDate).toLocaleDateString('ru-RU') : ''}
                        readOnly
                        className="w-full bg-[#0b0c10] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none transition opacity-70"
                      />
                    </div>

                    <div className="pt-6 flex items-center justify-end">
                      <button
                        onClick={logout}
                        className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 text-red-400 cursor-pointer font-medium py-3 px-8 rounded-xl transition"
                      >
                        Выйти из аккаунта
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      <InfoOrder isOpen={infoOrderOpen} onClose={() => setInfoOrderOpen(false)} order={selectedOrder} />
      <ReviewModal
        isOpen={!!reviewOrderId}
        onClose={() => setReviewOrderId(null)}
        orderId={reviewOrderId}
        onSubmitted={() => {
          if (isAuthenticated && activeTab === 'history') loadOrders();
        }}
      />
      <ViewReviewModal
        isOpen={!!viewReview}
        onClose={() => setViewReview(null)}
        review={viewReview}
      />
      <ReservationModal
        isOpen={reservationOpen}
        onClose={() => setReservationOpen(false)}
        onCreated={loadReservations}
        availableTables={availableForReservation}
      />
    </div>
  );
};

export default ProfilePage;
