import React from "react";
import { 
  Utensils, 
  Instagram, 
  Send, 
  MapPin, 
  Phone, 
  Mail 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#191721] text-[#FFFFFF] py-10 font-sans">
      <div className="container mx-auto px-8 md:px-20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[#C59C22] text-xl font-serif font-bold">
              <Utensils size={24} className="text-[#C59C22]" />
              <span>Золотая ложка</span>
            </div>
            
            <p className="text-sm text-[#FFFFFF] leading-relaxed max-w-[250px]">
              Изысканная европейская кухня в самом сердце города. Каждое блюдо — произведение искусства.
            </p>

            <div className="flex gap-4 mt-2">
              <a href="#" className="text-[#C59C22] hover:text-gray-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-[#C59C22] hover:text-gray-400 transition-colors">
                <Send size={20} />
              </a>
              <a href="#" className="text-[#C59C22] hover:text-gray-400 transition-colors">
                <Send size={20}  />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[#C59C22] text-lg font-serif font-bold mb-4">Навигация</h3>
            <ul className="space-y-2">
              {['Главная', 'Меню', 'О нас', 'Контакты'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#FFFFFF] hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[#C59C22] text-lg font-serif font-bold mb-4">Услуги</h3>
            <ul className="space-y-2">
              {['Банкеты и мероприятия', 'Доставка на дом', 'Бронирование столиков', 'Корпоративные заказы'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[#FFFFFF] hover:text-white transition-colors inline-block">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>


          <div>
            <h3 className="text-[#C59C22] text-lg font-serif font-bold mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-[#FFFFFF]">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-[#C59C22]" />
                <span>ул. Пушкина, д. 15, Москва</span>
              </li>
              <li className="flex items-center gap-3 text-[#FFFFFF]">
                <Phone size={16} className="flex-shrink-0 text-[#C59C22]" />
                <a href="tel:+74951234567" className="transition-colors">+7 (495) 123-45-67</a>
              </li>
              <li className="flex items-center gap-3 text-[#FFFFFF]">
                <Mail size={16} className="flex-shrink-0 text-[#C59C22]" />
                <a href="mailto:info@golden-spoon.ru" className="transition-colors">info@golden-spoon.ru</a>
              </li>
              <li className="text-s text-gray-500 mt-1">
                Пн-Вс: 11:00 - 23:00
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-[#374151] text-center text-s text-gray-500">
          © 2026 Золотая Ложка. Все права защищены.
        </div>

      </div>
    </footer>
  );
};

export default Footer;