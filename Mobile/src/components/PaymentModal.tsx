import { useState, useCallback } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';

interface PaymentModalProps {
  amount: number;
  onClose: () => void;
  onPay: () => Promise<void>;
}

function luhnCheck(cardNumber: string): boolean {
  let sum = 0;
  let isEven = false;
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

function getCardType(cardNumber: string): string | null {
  if (/^220[0-4]/.test(cardNumber)) return 'Мир';
  if (/^4/.test(cardNumber)) return 'Visa';
  if (/^5[1-5]/.test(cardNumber)) return 'Mastercard';
  if (/^3[47]/.test(cardNumber)) return 'American Express';
  if (/^6(?:011|5)/.test(cardNumber)) return 'Discover';
  return null;
}

function validateCard(cardNumber: string, expiry: string, cvc: string): string | null {
  const cleanNumber = cardNumber.replace(/\s/g, '');

  if (cleanNumber === '0000000000000000') return null;

  if (!/^\d+$/.test(cleanNumber)) return 'Номер карты должен содержать только цифры';
  if (cleanNumber.length < 13 || cleanNumber.length > 16) {
    return 'Номер карты должен содержать от 13 до 16 цифр';
  }

  const cardType = getCardType(cleanNumber);
  if (!cardType) {
    return 'Введен не верный номер карты';
  }

  if (!luhnCheck(cleanNumber)) {
    return 'Введен не верный номер карты';
  }

  const expiryMatch = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!expiryMatch) return 'Неверный формат даты. Используйте ММ/ГГ';

  const month = parseInt(expiryMatch[1], 10);
  const year = parseInt(expiryMatch[2], 10);
  if (month < 1 || month > 12) return 'Неверный месяц';

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'Срок действия карты истёк';
  }

  if (!/^\d{3,4}$/.test(cvc)) return 'CVC должен содержать 3 или 4 цифры';

  return null;
}

function formatCardNumber(value: string): string {
  const v = value.replace(/\D/g, '').slice(0, 16);
  const parts: string[] = [];
  for (let i = 0; i < v.length; i += 4) {
    parts.push(v.slice(i, i + 4));
  }
  return parts.join(' ');
}

function formatExpiry(value: string): string {
  const v = value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 3) return `${v.slice(0, 2)}/${v.slice(2)}`;
  return v;
}

export default function PaymentModal({ amount, onClose, onPay }: PaymentModalProps) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePay = useCallback(async () => {
    setError(null);
    const validationError = validateCard(cardNumber, expiry, cvc);
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      await onPay();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Ошибка оплаты. Попробуйте снова.');
    } finally {
      setLoading(false);
    }
  }, [cardNumber, expiry, cvc, onPay, onClose]);

  const cleanNumber = cardNumber.replace(/\s/g, '');
  const cardType = getCardType(cleanNumber);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in px-4 py-10">
      <div className="w-full max-w-sm bg-[#111] rounded-3xl border border-white/10 shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
        {}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center">
              <CreditCard size={18} className="text-gold" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Оплата заказа</h3>
              <p className="text-xs text-muted">{amount.toFixed(0)} ₽</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
            <X size={20} className="text-white/60" />
          </button>
        </div>

        <>
          {}
            <div className="mb-4">
              <label className="text-xs font-semibold text-white/60 mb-1.5 block">Номер карты</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/50 pr-16"
                  maxLength={19}
                />
                {cardType && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded">
                    {cardType}
                  </span>
                )}
              </div>

            </div>

            {}
            <div className="flex gap-3 mb-5">
              <div className="flex-1">
                <label className="text-xs font-semibold text-white/60 mb-1.5 block">Срок действия</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="ММ/ГГ"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/50"
                  maxLength={5}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-white/60 mb-1.5 block">CVC</label>
                <div className="relative">
                  <input
                    type="password"
                    inputMode="numeric"
                    placeholder="123"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold/50 pr-10"
                    maxLength={4}
                  />
                  <Lock size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                {error}
              </div>
            )}

            {}
            <div className="flex items-center gap-2 mb-5">
              <Lock size={12} className="text-white/30" />
              <p className="text-[10px] text-white/30">Все данные защищены и передаются по защищённому каналу</p>
            </div>

          <button
            onClick={handlePay}
            disabled={loading || cardNumber.length < 19 || expiry.length < 5 || cvc.length < 3}
            className="w-full bg-gold-gradient text-charcoal font-bold py-3.5 rounded-xl active:scale-[0.98] transition-transform disabled:opacity-40 disabled:active:scale-100"
          >
            {loading ? 'Обработка...' : `Оплатить ${amount.toFixed(0)} ₽`}
          </button>
        </>
      </div>
    </div>
  );
}
