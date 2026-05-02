import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ChefHat, Package, CheckCircle2, MapPin, ShoppingBag, Star, CreditCard } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import { api } from '../api/client';
import PaymentModal from '../components/PaymentModal';
import type { Review } from '../types';

const steps = [
  { key: 'new', label: 'В обработке', icon: Clock, color: 'amber' },
  { key: 'preparing', label: 'Готовится', icon: ChefHat, color: 'orange' },
  { key: 'ready', label: 'Готов', icon: Package, color: 'blue' },
  { key: 'served', label: 'Выдан', icon: CheckCircle2, color: 'emerald' },
] as const;

type StepColor = 'amber' | 'orange' | 'blue' | 'emerald';

const colorMap: Record<StepColor, { bg: string; text: string; ring: string; line: string }> = {
  amber: { bg: 'bg-amber-500', text: 'text-amber-400', ring: 'ring-amber-500/30', line: 'bg-amber-500' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-400', ring: 'ring-orange-500/30', line: 'bg-orange-500' },
  blue: { bg: 'bg-blue-500', text: 'text-blue-400', ring: 'ring-blue-500/30', line: 'bg-blue-500' },
  emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', ring: 'ring-emerald-500/30', line: 'bg-emerald-500' },
};

export default function OrderTracker() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentOrder, getOrder, isLoading } = useOrderStore();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [review, setReview] = useState<Review | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paying, setPaying] = useState(false);
  const prevStatusRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (id) getOrder(Number(id));
  }, [id, getOrder]);

  useEffect(() => {
    if (!currentOrder) return;
    const prev = prevStatusRef.current;
    if (prev && prev !== currentOrder.Status) {
      const enabled = localStorage.getItem('notifications') === 'true';
      if (enabled && Notification.permission === 'granted') {
        new Notification('Золотая Ложка', {
          body: `Статус заказа #${currentOrder.OrderID} изменился: ${currentOrder.Status}`,
          icon: '/icon-192x192.png',
        });
      }
    }
    prevStatusRef.current = currentOrder.Status;
  }, [currentOrder]);

  useEffect(() => {
    if (!id) return;
    const interval = setInterval(() => getOrder(Number(id)), 3000);
    return () => clearInterval(interval);
  }, [id, getOrder]);

  useEffect(() => {
    if (!id) return;
    api.getReview(Number(id))
      .then((r) => {
        if (r) {
          setReview(r);
          setRating(r.Rating);
          setComment(r.Comment);
        }
      })
      .catch(() => {});
  }, [id]);

  const handlePay = async () => {
    if (!currentOrder) return;
    setPaying(true);
    try {
      const amount = currentOrder.items?.reduce((s, i) => s + Number(i.Price) * i.Quantity, 0) || 0;
      await api.createTransaction({ orderId: currentOrder.OrderID, amount });
      await api.updateOrderStatus(currentOrder.OrderID, 'completed');
      await getOrder(Number(id));
    } catch (err: any) {
      throw err;
    } finally {
      setPaying(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!id || rating === 0) return;
    setSubmitting(true);
    try {
      await api.createReview({
        orderId: Number(id),
        rating,
        comment: comment.trim(),
      });
      const r = await api.getReview(Number(id));
      if (r) setReview(r);
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const currentStepIndex = steps.findIndex((s) => s.key === currentOrder?.Status);
  const safeStepIndex = currentStepIndex >= 0 ? currentStepIndex : 0;
  const currentColor = steps[safeStepIndex]?.color ?? 'amber';
  const colors = colorMap[currentColor];

  const isCompleted = currentOrder?.Status?.toLowerCase() === 'completed';
  const isServed = currentOrder?.Status?.toLowerCase() === 'served' || currentOrder?.Status === 'Выдан';

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${day}.${month}, ${hours}:${minutes}`;
  };

  return (
    <div className="min-h-screen pb-10 animate-fade-in flex flex-col">

      {}
      <div className="sticky top-0 z-20 bg-[#0a0a0a] pt-4 pb-6 px-4 shadow-lg rounded-b-3xl border-b border-white/5">
        <div className="flex items-center relative mb-8">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full active:bg-white/10 transition-colors absolute z-10">
            <ArrowLeft size={24} className="text-white" />
          </button>
          <div className="w-full text-center flex flex-col">
            <h1 className="text-lg font-bold text-white">Заказ</h1>
            <span className="text-xs text-muted/70">{currentOrder?.TableNumber ? 'В заведении' : 'Самовывоз'}</span>
          </div>
        </div>

        {isCompleted ? (
          <div className="flex flex-col items-center justify-center pt-2 pb-2 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-3 ring-4 ring-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <CheckCircle2 size={32} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Заказ завершен</h2>
            <p className="text-sm text-white/70 text-center">Спасибо за заказ!</p>
          </div>
        ) : (
          <div className="relative px-2 max-w-sm mx-auto animate-fade-in">
            <div className="absolute top-[18px] left-[10%] right-[10%] h-[2px] bg-white/10 z-0 rounded-full" />
            <div
              className={`absolute top-[18px] left-[10%] h-[2px] ${colors.line} z-0 transition-all duration-500 rounded-full`}
              style={{ width: `calc(${(safeStepIndex / (steps.length - 1)) * 80}%)` }}
            />
            <div className="flex items-start justify-between relative z-10">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const stepColors = colorMap[step.color];
                const isActive = idx <= safeStepIndex;
                const isCurrent = idx === safeStepIndex;
                return (
                  <div key={step.key} className="flex flex-col items-center gap-2 w-[70px]">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? `${stepColors.bg} text-white shadow-lg`
                          : 'bg-[#2a2a2a] text-white/30 border border-white/5'
                      } ${isCurrent ? `ring-4 ${stepColors.ring} scale-110` : ''}`}
                    >
                      <Icon size={18} strokeWidth={isActive ? 3 : 2} />
                    </div>
                    <span className={`text-[10px] font-medium text-center leading-tight ${
                      isActive ? stepColors.text : 'text-muted/50'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {isLoading && !currentOrder && (
        <div className="flex-1 flex flex-col items-center justify-center py-10">
          <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted text-sm font-medium">Загрузка заказа...</p>
        </div>
      )}

      {!isLoading && !currentOrder && (
        <div className="flex-1 flex items-center justify-center text-muted font-medium">Заказ не найден</div>
      )}

      {currentOrder && (
        <div className="flex-1 px-4 mt-6 flex flex-col gap-5">

          {}
          {isServed && !isCompleted && (
            <div className="glass rounded-2xl p-4 text-center animate-fade-in">
              <p className="text-sm text-white/80 mb-3">Заказ выдан. Оплатите, чтобы завершить.</p>
              <button
                onClick={() => setShowPayment(true)}
                className="w-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <CreditCard size={18} />
                Оплатить {currentOrder.items?.reduce((s, i) => s + Number(i.Price) * i.Quantity, 0).toFixed(0) || '0'} ₽
              </button>
            </div>
          )}

          <div className="text-center mb-2">
            <h2 className="text-4xl font-black text-white tracking-wide drop-shadow-md">
              Заказ <span className="text-gold-gradient">{currentOrder.OrderID}</span>
            </h2>
          </div>

          {}
          {isCompleted && (
            <div className="glass rounded-3xl p-5 shadow-lg relative overflow-hidden animate-fade-in">
              <h3 className="text-lg font-bold text-white mb-2">Оцените заказ</h3>
              <p className="text-sm text-white/60 mb-5">Пожалуйста, оставьте нам оценку</p>

              <div className="flex items-center gap-3 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => !review && setRating(star)}
                    className="transition-transform active:scale-90 hover:scale-110"
                    disabled={!!review}
                  >
                    <Star
                      size={36}
                      className={star <= rating ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" : "text-white/10"}
                      strokeWidth={1}
                    />
                  </button>
                ))}
              </div>

              <div>
                <p className="text-sm font-semibold text-white/60 mb-2">Комментарий</p>
                {!review ? (
                  <>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Напишите ваш отзыв..."
                      className="w-full glass rounded-xl p-3 text-sm text-white placeholder-white/30 resize-none focus:outline-none focus:border-gold min-h-[80px] mb-3"
                    />
                    <button
                      onClick={handleSubmitReview}
                      disabled={rating === 0 || submitting}
                      className="bg-gold-gradient text-charcoal font-bold px-6 py-2.5 rounded-xl text-sm active:scale-[0.98] transition-transform disabled:opacity-50"
                    >
                      {submitting ? 'Отправка...' : 'Отправить'}
                    </button>
                  </>
                ) : (
                  <div className="glass rounded-xl p-3">
                    <p className="text-xs text-white/40 mb-1">Ваш комментарий</p>
                    <p className="text-sm text-white/70">{review.Comment}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {}
          <div className="glass rounded-3xl p-5 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4">Состав заказа</h3>
            {currentOrder.items && currentOrder.items.length > 0 ? (
              <div className="space-y-4">
                {currentOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-white/10 text-gold text-xs font-bold flex items-center justify-center shadow-inner">
                        {item.Quantity}
                      </span>
                      <span className="text-sm font-medium text-white/90">{item.MenuItemName}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{(Number(item.Price) * item.Quantity).toFixed(0)} ₽</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-sm">Пусто...</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-2 px-2">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="text-white/60" />
                <span className="text-sm font-bold text-white">Время заказа</span>
              </div>
              <span className="text-sm text-white/70 ml-6">
                {formatDate(currentOrder.OrderDateTime)}
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                {currentOrder.TableNumber ? <MapPin size={16} className="text-white/60" /> : <ShoppingBag size={16} className="text-white/60" />}
                <span className="text-sm font-bold text-white">Сервировка</span>
              </div>
              <span className="text-sm text-white/70 ml-6">
                {currentOrder.TableNumber ? `Стол ${currentOrder.TableNumber}` : 'В пакете с собой'}
              </span>
            </div>
          </div>

          <div className="h-px w-full bg-white/10 my-2" />

          <div className="px-2 space-y-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-base text-white/80 font-medium">Итого:</span>
              <span className="text-lg font-bold text-white">
                {currentOrder.items?.reduce((s, i) => s + Number(i.Price) * i.Quantity, 0).toFixed(0) || "0"} ₽
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-white/80 font-medium">Оплата рублями:</span>
              <span className="text-lg font-bold text-white">
                {currentOrder.items?.reduce((s, i) => s + Number(i.Price) * i.Quantity, 0).toFixed(0) || "0"} ₽
              </span>
            </div>
          </div>

        </div>
      )}
      {showPayment && currentOrder && (
        <PaymentModal
          amount={currentOrder.items?.reduce((s, i) => s + Number(i.Price) * i.Quantity, 0) || 0}
          onClose={() => setShowPayment(false)}
          onPay={handlePay}
        />
      )}
    </div>
  );
}
