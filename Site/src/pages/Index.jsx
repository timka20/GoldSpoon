import React, { useState, useEffect } from 'react';
import { Award, Star, Users, Clock, Quote } from 'lucide-react';
import { Link } from "react-router-dom";
import { api } from '../api/client';
import { useAvailableTables } from '../hooks/useAvailableTables';

const ReservationHeroModal = ({ isOpen, onClose }) => {
  const { availableForReservation, loading: tablesLoading } = useAvailableTables();
  const [tableId, setTableId] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [people, setPeople] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const suitableTables = availableForReservation.filter(t => {
    const min = Number(people);
    const max = min >= 5 ? Infinity : min + 1;
    return t.Capacity >= min && t.Capacity <= max;
  });

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
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
      setSuccess(true);
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
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={32} className="text-green-400" />
            </div>
            <h4 className="text-white text-lg font-medium mb-2">Бронирование успешно!</h4>
            <p className="text-gray-400 text-sm">Ваш стол забронирован. Вы можете управлять бронированиями в личном кабинете.</p>
            <button onClick={onClose} className="mt-6 bg-[#D4AF37] hover:bg-[#b5952f] text-black font-medium py-2 px-6 rounded-lg transition text-sm">
              Закрыть
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">Количество человек</label>
              <input
                type="number"
                // min={1}
                min="1"
                max={20}
                value={people}
                onChange={e => setPeople(e.target.value)}
                className="w-full bg-[#3a3a4e] text-white px-4 py-3 rounded-lg border border-transparent focus:border-[#D4AF37] focus:outline-none transition text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">Стол</label>
              {tablesLoading ? (
                <div className="text-gray-400 text-sm">Загрузка столов...</div>
              ) : (
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
              )}
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
        )}
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getReviews().then(data => {
      setReviews(data || []);
      setLoading(false);
    }).catch(() => {
      setReviews([]);
      setLoading(false);
    });
  }, []);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={18}
        className={`${i < (rating || 5) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-600'}`}
      />
    ));
  };

  const topReviews = reviews.slice(0, 3);
  const blurredReviews = reviews.slice(3, 6);

  return (
    <section className="py-24 px-4 bg-[#0b0c10] relative overflow-hidden">

      <div className="absolute -right-20 top-20 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -left-20 bottom-20 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-serif font-semibold text-[#D4AF37] mb-4 drop-shadow-lg">
            Отзывы наших гостей
          </h2>
          <p className="text-[#A39D8F] text-lg max-w-2xl mx-auto">
            Мы гордимся тем, что каждый визит в «Золотую Ложку» оставляет незабываемые впечатления.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Загрузка отзывов...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-400">Пока нет отзывов</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {topReviews.map((review) => (
                <div
                  key={review.ReviewID}
                  className="group bg-[#13141a]/80 backdrop-blur-sm border border-white/5 p-8 rounded-2xl hover:border-[#D4AF37]/40 transition-all duration-300 hover:-translate-y-2 shadow-xl relative"
                >
                  <Quote className="absolute top-4 right-6 text-[#D4AF37]/20 w-11 h-11 group-hover:text-[#D4AF37]/40 transition-colors" />

                  <div className="flex gap-1 mb-6">
                    {renderStars(review.Rating)}
                  </div>

                  <p className="text-white text-base leading-relaxed mb-8 italic font-light">
                    "{review.Comment || 'Отличное место!'}"
                  </p>

                  <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-black font-bold font-serif text-lg shadow-lg">
                      {(review.UserUsername || 'Г').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-sm">{review.UserUsername || 'Гость'}</h4>
                      <span className="text-[#A39D8F] text-xs uppercase tracking-wide">Гость</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {blurredReviews.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 relative">
                {blurredReviews.map((review) => (
                  <div
                    key={review.ReviewID}
                    className="group bg-[#13141a]/80 backdrop-blur-sm border border-white/5 p-8 rounded-2xl shadow-xl relative select-none"
                  >
                    <Quote className="absolute top-4 right-6 text-[#D4AF37]/20 w-11 h-11" />

                    <div className="flex gap-1 mb-6">
                      {renderStars(review.Rating)}
                    </div>

                    <p className="text-white text-base leading-relaxed mb-8 italic font-light">
                      "{review.Comment || 'Отличное место!'}"
                    </p>

                    <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-black font-bold font-serif text-lg shadow-lg">
                        {(review.UserUsername || 'Г').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">{review.UserUsername || 'Гость'}</h4>
                        <span className="text-[#A39D8F] text-xs uppercase tracking-wide">Гость</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div
                  className="absolute inset-0 rounded-2xl z-10"
                  style={{
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 4%, rgba(0,0,0,0.25) 20%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,1) 80%, rgba(0,0,0,1) 100%)',
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 4%, rgba(0,0,0,0.25) 20%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,1) 80%, rgba(0,0,0,1) 100%)',
                    background: 'linear-gradient(to top, #0b0c10 0%, rgba(11,12,16,0.95) 25%, rgba(11,12,16,0.6) 50%, rgba(11,12,16,0.15) 75%, transparent 95%)',
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-10 rounded-b-2xl z-20 h-1/2">
                  <Link to="/reviews">
                    <button className="bg-[#D4AF37] hover:bg-[#b5952f] text-black font-medium py-3.5 px-10 rounded-xl transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(212,175,55,0.7)] border border-[#D4AF37]/30">
                      Посмотреть все отзывы
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

const HeroSection = () => {
  const [reservationOpen, setReservationOpen] = useState(false);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center z-0" style={{ backgroundImage: "url('/hero.png')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/23 via-black/50 to-[#0b0c10]"></div>
        <div className="relative z-10 text-center max-w-3xl px-4 mt-80 ml-135 ">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4 drop-shadow-xl">
            <span className="text-[#D4AF37]">Золотая</span> Ложка
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-normal mb-10 max-w-2xl mx-auto tracking-wide drop-shadow-md">
            <span className="text-[#D4AF37]">Изысканная европейская кух</span><span className="text-[#FFFFFF]">ня в атмосфере роскоши и <br /> </span><span className="text-[#D4AF37]">комф</span><span className="text-[#FFFFFF]">орта</span>
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-6 relative z-20">
          <Link to="/menu">
            <button className="bg-[#D4AF37] text-black px-8 py-3 rounded-xl transition-all duration-500 font-medium cursor-pointer tracking-wide hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] hover:scale-105">
              Посмотреть меню
            </button>
          </Link>
          <button
            onClick={() => setReservationOpen(true)}
            className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-xl transition-all duration-500 font-medium tracking-wide cursor-pointer hover:border-[#D4AF37] hover:text-[#D4AF37] hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
          >
            Забронировать стол
          </button>
        </div>
      </div>
      <ReservationHeroModal isOpen={reservationOpen} onClose={() => setReservationOpen(false)} />
    </section>
  );
};

const AboutSection = () => (
  <section className="py-20 cursor-pointer px-4 bg-[#0b0c10]">
    <div className="container mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-serif font-semibold text-[#D4AF37] mb-6">О ресторане</h2>
        <p className="text-[#A39D8F] text-lg max-w-4xl mx-auto leading-relaxed">
          Ресторан "Золотая Ложка" — это место, где каждое блюдо становится произведением искусства,
          а каждый визит превращается в незабываемое гастрономическое путешествие по Европе.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="border border-white/10 rounded-lg p-8 text-center bg-[#13141a] hover:border-[#D4AF37]/50 transition duration-300 group">
          <Award className="mx-auto text-[#D4AF37] mb-6 group-hover:scale-110 transition" size={42} />
          <h3 className="text-white font-serif text-xl mb-3">Мишленовские повара</h3>
          <p className="text-base leading-relaxed text-[#A39D8F]">Наша команда поваров имеет международные награды</p>
        </div>
        <div className="border border-white/10 rounded-lg p-8 text-center bg-[#13141a] hover:border-[#D4AF37]/50 transition duration-300 group">
          <Star className="mx-auto text-[#D4AF37] mb-6 group-hover:scale-110 transition" size={42} />
          <h3 className="text-white font-serif text-xl mb-3">Премиальные продукты</h3>
          <p className="text-base leading-relaxed text-[#A39D8F]">Только лучшие ингредиенты от проверенных поставщиков</p>
        </div>
        <div className="border border-white/10 rounded-lg p-8 text-center bg-[#13141a] hover:border-[#D4AF37]/50 transition duration-300 group">
          <Users className="mx-auto text-[#D4AF37] mb-6 group-hover:scale-110 transition" size={42} />
          <h3 className="text-white font-serif text-xl mb-3">Безупречный сервис</h3>
          <p className="text-base leading-relaxed text-[#A39D8F]">Индивидуальный подход к каждому гостю ресторана</p>
        </div>
      </div>
    </div>
  </section>
);

const MenuSection = () => (
  <section className="py-20 px-4 bg-[#0F1014]">
    <div className="container mx-auto">
      <h2 className="text-5xl font-serif font-semibold text-[#D4AF37] text-center mb-4">Наше меню</h2>
      <p className="text-[#A39D8F] text-lg text-center mb-16">Откройте для себя вкусы Европы с нашими фирменными блюдами</p>
      <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
        <div className="w-full lg:w-1/2 overflow-hidden rounded-xl shadow-2xl shadow-black/50">
          <img src="/image_10.png" alt="Авторская кухня" className="w-full h-full object-cover hover:scale-105 transition duration-700" />
        </div>
        <div className="w-full lg:w-1/2">
          <h3 className="text-3xl text-white font-serif mb-6">Авторская кухня</h3>
          <p className="text-[#A39D8F] text-lg mb-6 leading-relaxed">
            Каждое блюдо в нашем ресторане — это результат творческого подхода наших поваров
            и многолетнего опыта работы с европейской кухней. Мы сочетаем традиции и инновации,
            чтобы удивить вас.
          </p>
          <div className="flex items-center gap-3 text-[#D4AF37] mb-8 font-medium">
            <Clock size={20} />
            <span>Среднее время подачи: 25 минут</span>
          </div>
          <Link to="/menu">
            <button className="bg-[#D4AF37] text-black px-8 py-3 rounded-xl cursor-pointer duration-500 font-medium tracking-wide relative z-20 hover:shadow-[0_0_20px_rgba(212,175,55,0.6)]">
              Посмотреть полное меню
            </button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const IndexPage = () => (
  <div className="bg-[#0b0c10] min-h-screen font-sans selection:bg-[#D4AF37] selection:text-black">
    <HeroSection />
    <AboutSection />
    <MenuSection />
    <TestimonialsSection />
  </div>
);

export default IndexPage;
