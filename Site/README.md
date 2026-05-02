# React + Vite + Tailwind CSS Example

Простой тестовый проект на React с использованием Vite и Tailwind CSS.

## Структура проекта

```
src/
├── App.jsx              # Маршрутизатор страниц
├── main.jsx             # Точка входа
├── index.css            # Глобальные стили + Tailwind
├── components/          # Переиспользуемые компоненты
│   ├── Navbar.jsx       # Навигационное меню
│   ├── Footer.jsx       # Подвал сайта
│   ├── Hero.jsx         # Баннер главной страницы
│   └── Card.jsx         # Карточка для контента
└── pages/               # Страницы приложения
    ├── Home.jsx         # Главная страница
    ├── About.jsx        # О нас
    ├── Contact.jsx      # Контакты (с формой)
    └── NotFound.jsx     # 404 страница
```

## Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка для production
npm run build

# Предпросмотр production-сборки
npm run preview
```

## Технологии

- **React 19** — библиотека для создания UI
- **Vite** — быстрый инструмент сборки
- **Tailwind CSS** — утилитарный CSS-фреймворк
- **React Router** — маршрутизация

## Доступные страницы

- `/` — Главная страница
- `/about` — О проекте
- `/contact` — Форма обратной связи
- `*` — Страница 404
