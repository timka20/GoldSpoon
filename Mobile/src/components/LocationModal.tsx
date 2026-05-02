import { useState } from 'react';
import { X, ZoomIn, ZoomOut, MapPin, Clock } from 'lucide-react';

const MAP_IMAGES = [
  'https://upload.timka20.ru/files/d85ecf566aa6.png',
  'https://upload.timka20.ru/files/2998b77f8e49.png',
  'https://upload.timka20.ru/files/bf618eff343a.png',
];

const SCHEDULE = [
  { day: 'Понедельник', hours: '09:00–03:00' },
  { day: 'Вторник', hours: '09:00–03:00' },
  { day: 'Среда', hours: '09:00–03:00' },
  { day: 'Четверг', hours: '09:00–03:00' },
  { day: 'Пятница', hours: '09:00–03:00' },
  { day: 'Суббота', hours: '09:00–03:00' },
  { day: 'Воскресенье', hours: '09:00–03:00' },
];

export default function LocationModal({ onClose }: { onClose: () => void }) {
  const [zoomIndex, setZoomIndex] = useState(1);
  const [loading, setLoading] = useState(true);

  const zoomIn = () => {
    setLoading(true);
    setZoomIndex((i) => Math.min(i + 1, MAP_IMAGES.length - 1));
  };
  const zoomOut = () => {
    setLoading(true);
    setZoomIndex((i) => Math.max(i - 1, 0));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-[#111] rounded-3xl border border-white/10 shadow-2xl max-h-[85vh] overflow-y-auto p-6">
        {}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-gold" />
            <h3 className="text-base font-bold text-white">Наш адрес</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-white/10 transition-colors">
            <X size={20} className="text-white/60" />
          </button>
        </div>

        {}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 mb-5">
          {loading && (
            <div className="absolute inset-0 z-10 bg-[#1a1a1a] flex flex-col items-center justify-center gap-2">
              <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-muted">Карта загружается...</p>
            </div>
          )}
          <img
            src={MAP_IMAGES[zoomIndex]}
            alt="Карта"
            className="w-full h-52 object-cover"
            onLoad={() => setLoading(false)}
          />
          {}
          <div className="absolute bottom-3 right-3 flex flex-col gap-2 z-20">
            <button
              onClick={zoomIn}
              disabled={zoomIndex >= MAP_IMAGES.length - 1}
              className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform disabled:opacity-30"
            >
              <ZoomIn size={20} />
            </button>
            <button
              onClick={zoomOut}
              disabled={zoomIndex <= 0}
              className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white active:scale-90 transition-transform disabled:opacity-30"
            >
              <ZoomOut size={20} />
            </button>
          </div>
        </div>

        {}
        <div className="flex items-start gap-3 mb-5">
          <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
            <MapPin size={18} className="text-gold" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Казань</p>
            <p className="text-sm text-white/70">ул. Баумана, 21</p>
          </div>
        </div>

        {}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-gold" />
            <p className="text-sm font-semibold text-white">Часы работы</p>
          </div>
          <div className="glass rounded-xl overflow-hidden">
            {SCHEDULE.map((s, idx) => (
              <div
                key={s.day}
                className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                  idx !== SCHEDULE.length - 1 ? 'border-b border-white/10' : ''
                }`}
              >
                <span className="text-white/70">{s.day}</span>
                <span className="font-medium text-white">{s.hours}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
