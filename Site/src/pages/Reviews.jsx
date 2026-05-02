import React, { useState, useEffect } from 'react';
import { Star, Quote, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

const CATEGORY_MAP = [
  { id: 'all', label: 'Все', min: 0, max: 5 },
  { id: 'positive', label: 'Положительные', min: 5, max: 5 },
  { id: 'good', label: 'Хорошие', min: 4, max: 4 },
  { id: 'satisfactory', label: 'Удовлетворительные', min: 3, max: 3 },
  { id: 'bad', label: 'Плохие', min: 2, max: 2 },
  { id: 'very_bad', label: 'Очень плохие', min: 1, max: 1 },
];

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    api.getReviews().then(data => {
      setReviews(data || []);
      setLoading(false);
    }).catch(() => {
      setReviews([]);
      setLoading(false);
    });
  }, []);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.Rating || 0), 0) / reviews.length).toFixed(1)
    : '0.0';

  const distribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.Rating === star).length,
  }));

  const filtered = activeCategory === 'all'
    ? reviews
    : reviews.filter(r => {
        const cat = CATEGORY_MAP.find(c => c.id === activeCategory);
        return r.Rating >= cat.min && r.Rating <= cat.max;
      });

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={18}
        className={`${i < (rating || 5) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'text-gray-600'}`}
      />
    ));
  };

  return (
    <div className="bg-[#0b0c10] min-h-screen font-sans text-white">
      {/* Hero Header */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1920')",
        }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-[#0b0c10]"></div>

        <div className="relative z-10 container mx-auto px-4 md:px-20">
          <Link to="/" className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white transition mb-6 text-sm font-medium">
            <ArrowLeft size={18} />
            На главную
          </Link>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#D4AF37] mb-6 drop-shadow-lg">
            Отзывы гостей
          </h1>
          <p className="text-white text-lg md:text-xl max-w-3xl leading-relaxed font-light">
            Узнайте, что говорят о нас наши посетители. Каждый отзыв помогает нам становиться лучше.
          </p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-[#13141a] rounded-2xl border border-white/5 p-6 md:p-10">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="flex flex-col items-center">
                <span className="text-6xl md:text-7xl font-serif font-bold text-[#D4AF37]">{avgRating}</span>
                <div className="flex gap-1 my-3">
                  {renderStars(Math.round(Number(avgRating)))}
                </div>
                <span className="text-gray-400 text-sm">{reviews.length} отзывов</span>
              </div>

              <div className="flex-1 w-full space-y-3">
                {distribution.map(({ star, count }) => {
                  const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-gray-400 text-sm w-3">{star}</span>
                      <Star size={14} className="text-[#D4AF37] fill-[#D4AF37]" />
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#D4AF37] rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-gray-400 text-sm w-8 text-right">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-8">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-wrap gap-3">
            {CATEGORY_MAP.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                  activeCategory === cat.id
                    ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                    : 'bg-transparent text-gray-300 border-white/10 hover:border-[#D4AF37]/50 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 px-4 pb-24">
        <div className="container mx-auto max-w-7xl">
          {loading ? (
            <div className="text-center py-20 text-gray-400">Загрузка отзывов...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">В этой категории пока нет отзывов</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((review) => (
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
                      <span className="text-[#A39D8F] text-xs uppercase tracking-wide">
                        {new Date(review.CreatedAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ReviewsPage;
