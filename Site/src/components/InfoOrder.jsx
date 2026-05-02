import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { getOrderStatus } from '../utils/orderStatus';

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const InfoOrder = ({ isOpen, onClose, order }) => {
  const [menuMap, setMenuMap] = useState(new Map());

  useEffect(() => {
    if (isOpen) {
      api.getMenu().then(data => {
        const map = new Map();
        (data || []).forEach(item => {
          if (item.MenuItemID) {
            map.set(item.MenuItemID, item.Image);
          }
        });
        setMenuMap(map);
      }).catch(() => setMenuMap(new Map()));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const items = order?.items || [];
  const total = items.reduce((sum, i) => sum + (i.Price * i.Quantity), 0);

  const getImage = (menuItemId) => {
    return menuMap.get(menuItemId) || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#1a1a2e] rounded-2xl w-full max-w-lg border border-white/10 shadow-2xl overflow-hidden">

        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-white text-lg font-medium">Информация о заказе #{order?.OrderID}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#2a2a3e] text-gray-400 hover:text-white transition"
          >
            <CloseIcon/>
          </button>
        </div>

        <div className="p-5">
          <div className="space-y-2 mb-5">
            <p className="text-gray-300 text-sm">
              <span className="text-gray-500">Дата заказа:</span> {order?.OrderDateTime ? new Date(order.OrderDateTime).toLocaleString('ru-RU') : '-'}
            </p>
            <p className="text-gray-300 text-sm">
              <span className="text-gray-500">Стол:</span> {order?.TableNumber || '-'}
            </p>
            <p className="text-gray-300 text-sm flex items-center gap-2">
              <span className="text-gray-500">Статус:</span>
              {(() => {
                const s = getOrderStatus(order?.Status);
                const Icon = s.Icon;
                return (
                  <span className={`flex items-center gap-1.5 ${s.color}`}>
                    <Icon size={14} />
                    {s.label}
                  </span>
                );
              })()}
            </p>
            <p className="text-gray-300 text-sm">
              <span className="text-gray-500">Сумма заказа:</span> {total.toLocaleString()} ₽
            </p>
            <p className="text-gray-500 text-sm">Позиции заказа:</p>
          </div>

          <div className="bg-[#13141a] rounded-xl border border-white/5 p-3 max-h-[320px] overflow-y-auto space-y-3">
            {items.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">Нет данных о позициях</p>
            ) : (
              items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-[#1a1b22] rounded-lg p-3 border border-white/5"
                >
                  <div className="w-14 h-14 rounded-lg bg-[#2a2b32] overflow-hidden flex-shrink-0 flex items-center justify-center">
                    <img
                      src={getImage(item.MenuItemID)}
                      alt={item.MenuItemName || 'Блюдо'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-gray-300 text-sm block truncate">{item.MenuItemName || 'Блюдо'}</span>
                    <span className="text-[#D4AF37] text-xs">{item.Price?.toLocaleString()} ₽ / шт · {item.Quantity} шт</span>
                  </div>
                  <div className="text-white font-medium text-sm">
                    {(item.Price * item.Quantity).toLocaleString()} ₽
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default InfoOrder;
