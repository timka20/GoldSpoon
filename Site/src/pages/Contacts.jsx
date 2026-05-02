import React from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const COORDS = [55.7908, 49.1146];

const ContactsPage = () => {
  return (
    <div className="bg-[#0b0c10] min-h-screen font-sans selection:bg-[#D4AF37] selection:text-black">
      <section
        className="relative pt-32 pb-16 md:pt-48 md:pb-24 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1541410769850-84a29a0f447f?q=80&w=2070&auto=format&fit=crop')",
        }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/80 to-[#0b0c10]"></div>
        <div className="relative z-10 container mx-auto px-4 md:px-20 text-white text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#D4AF37] mb-4">
            Контакты
          </h1>
          <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Мы всегда рады ответить на ваши вопросы, принять бронирование или выслушать ваши пожелания.
          </p>
        </div>
      </section>

      <main className="py-20 px-4">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-serif text-white mb-8 border-b border-[#D4AF37]/50 pb-2">
              Свяжитесь с нами
            </h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4 text-gray-400">
                <MapPin size={24} className="text-[#D4AF37] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium text-lg mb-1">Наш адрес</h3>
                  <p>ул. Баумана, 21, Казань</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-gray-400">
                <Phone size={24} className="text-[#D4AF37] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium text-lg mb-1">Телефон</h3>
                  <p>+7 (495) 123-45-67</p>
                  <p className="text-xs text-gray-500">Для бронирования и заказов</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-gray-400">
                <Mail size={24} className="text-[#D4AF37] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium text-lg mb-1">Электронная почта</h3>
                  <p>info@golden-spoon.ru</p>
                  <p className="text-xs text-gray-500">Для общих вопросов и сотрудничества</p>
                </div>
              </div>
              <div className="flex items-start gap-4 text-gray-400">
                <Clock size={24} className="text-[#D4AF37] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-medium text-lg mb-1">Часы работы</h3>
                  <p className="text-[#D4AF37] text-lg font-semibold">Ежедневно: 09:00 – 03:00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#13141a] p-8 rounded-xl shadow-2xl shadow-black/50 border border-white/10">
            <h2 className="text-3xl font-serif text-[#D4AF37] mb-8">Отправить сообщение</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Имя</label>
                <input type="text" id="name" className="w-full bg-[#0b0c10] border border-white/10 text-white p-3 rounded focus:border-[#D4AF37] focus:ring focus:ring-[#D4AF37]/50 transition" placeholder="Ваше имя" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input type="email" id="email" className="w-full bg-[#0b0c10] border border-white/10 text-white p-3 rounded focus:border-[#D4AF37] focus:ring focus:ring-[#D4AF37]/50 transition" placeholder="name@example.com" required />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Сообщение</label>
                <textarea id="message" rows={4} className="w-full bg-[#0b0c10] border border-white/10 text-white p-3 rounded focus:border-[#D4AF37] focus:ring focus:ring-[#D4AF37]/50 transition" placeholder="Ваше сообщение или вопрос" required />
              </div>
              <button type="submit" className="flex items-center justify-center gap-2 w-full bg-[#D4AF37] text-black px-8 py-3 rounded font-medium hover:bg-[#b5952f] transition text-lg">
                <Send size={20} />Отправить
              </button>
            </form>
          </div>
        </div>
      </main>

      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-serif text-[#D4AF37] mb-6 border-b border-[#D4AF37]/50 pb-2">
            Наше местоположение
          </h2>
          <div className="h-96 w-full rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
            <YMaps>
              <Map
                defaultState={{ center: COORDS, zoom: 16 }}
                width="100%"
                height="100%"
                options={{ suppressMapOpenBlock: true }}
              >
                <Placemark
                  geometry={COORDS}
                  options={{
                    preset: 'islands#icon',
                    iconColor: '#D4AF37',
                  }}
                  properties={{
                    hintContent: 'Золотая ложка Казань',
                    balloonContentHeader: 'Золотая ложка Казань',
                    balloonContentBody: 'Казань<br/>ул. Баумана, 21<br/><br/><b>Часы работы</b><br/>Понедельник<br/>09:00–03:00<br/>Вторник<br/>09:00–03:00<br/>Среда<br/>09:00–03:00<br/>Четверг<br/>09:00–03:00<br/>Пятница<br/>09:00–03:00<br/>Суббота<br/>09:00–03:00<br/>Воскресенье<br/>09:00–03:00',
                  }}
                />
              </Map>
            </YMaps>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactsPage;
