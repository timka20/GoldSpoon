import React from 'react';

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const InfoOrder = ({ isOpen, onClose, order }) => {
  if (!isOpen) return null;

  const items = order?.items || [
    { id: 1, name: 'Название блюда', image: '/cat.png' },
    { id: 2, name: 'Название блюда', image: '/cat.png' },
    { id: 3, name: 'Название блюда', image: '/cat.png' },
    { id: 4, name: 'Название блюда', image: '/cat.png' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-[#1a1a2e] rounded-2xl w-full max-w-lg border border-white/10 shadow-2xl overflow-hidden">
        
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <h2 className="text-white text-lg font-medium">Информация о заказе</h2>
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
              <span className="text-gray-500">Дата заказа:</span> {order?.date || '25.12.2026 год.'}
            </p>
            <p className="text-gray-300 text-sm">
              <span className="text-gray-500">Сумма заказа:</span> {order?.total || '4569 ₽'}
            </p>
            <p className="text-gray-500 text-sm">Позиции заказа:</p>
          </div>

          <div className="bg-[#13141a] rounded-xl border border-white/5 p-3 max-h-[320px] overflow-y-auto space-y-3">
            {items.map(item => (
              <div 
                key={item.id} 
                className="flex items-center gap-4 bg-[#1a1b22] rounded-lg p-3 border border-white/5"
              >
                <div className="w-12 h-12 rounded-lg bg-[#2a2b32] overflow-hidden flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-gray-300 text-sm">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default InfoOrder;