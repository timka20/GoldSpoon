import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="bg-[#0b0c10] min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-[#D4AF37] blur-3xl opacity-10 rounded-full"></div>
        <Utensils size={64} className="relative text-[#D4AF37]" />
      </div>
      <h1 className="text-8xl md:text-9xl font-serif font-bold text-[#D4AF37] mb-4 drop-shadow-lg">
        404
      </h1>
      <p className="text-white text-xl md:text-2xl font-medium mb-2">
        Страница не найдена
      </p>
      <p className="text-[#A39D8F] text-base md:text-lg max-w-md mb-10">
        К сожалению, такой страницы не существует. Возможно, она была удалена или вы ввели неверный адрес.
      </p>
      <Link to="/">
        <button className="flex items-center gap-3 bg-[#D4AF37] hover:bg-[#b5952f] text-black px-8 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(212,175,55,0.6)]">
          <ArrowLeft size={20} />
          Вернуться на главную
        </button>
      </Link>
    </div>
  );
};

export default NotFound;
