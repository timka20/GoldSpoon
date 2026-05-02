import { Clock, ChefHat, Package, CheckCircle2 } from 'lucide-react';

export const ORDER_STATUS_MAP = {
  new: { label: 'В обработке', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', Icon: Clock },
  preparing: { label: 'Готовится', color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', Icon: ChefHat },
  ready: { label: 'Готов', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', Icon: Package },
  served: { label: 'Выдан', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', Icon: CheckCircle2 },
  completed: { label: 'Завершен', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', Icon: CheckCircle2 },
};

export function getOrderStatus(status) {
  const key = (status || '').toLowerCase();
  return ORDER_STATUS_MAP[key] || {
    label: status || 'Неизвестно',
    color: 'text-gray-400',
    bg: 'bg-gray-400/10',
    border: 'border-gray-400/20',
    Icon: Clock,
  };
}
