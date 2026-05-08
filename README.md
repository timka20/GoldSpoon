# Курсовая работа: Автоматизированная система управления рестораном "Золотая ложка"

Репозиторий: https://github.com/timka20/GoldSpoon

## Авторы

- Тимофей -- https://github.com/timka20
- Яна -- https://github.com/KramarovskayaYE
- Владислав -- https://github.com/Blaze2070

## Демонстрационные стенды

- Главный сайт -- https://rpm.timka20.ru/
- Мобильное PWA-приложение -- https://mobile.rpm.timka20.ru/
- Административная панель -- https://admin.rpm.timka20.ru/
- API сервер -- https://api.rpm.timka20.ru/
- Документация по API -- https://docs.rpm.timka20.ru/

## Стек технологий

### Серверная часть (API)

- Node.js
- Express
- MySQL2
- bcrypt
- jsonwebtoken
- Swagger UI Express + YAMLjs
- Nodemon (dev)

### Клиентская часть

**Главный сайт (Site)**
- React
- Vite
- Tailwind CSS
- PostCSS + Autoprefixer
- ESLint
- @pbe/react-yandex-maps
- @react-google-maps/api

**Мобильное приложение (Mobile)**
- React + TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- React Router DOM
- Lucide React + React Icons
- vite-plugin-pwa (PWA)
- serve (production)

**Админ-панель (PC_application)**
- React + TypeScript
- Vite
- Tailwind CSS + tailwind-merge + class-variance-authority
- Radix UI (полный набор компонентов)
- Recharts (графики)
- React Hook Form
- Sonner (уведомления)
- Next Themes
- Vaul
- Embla Carousel
- Lucide React

### База данных

- MySQL

### Процесс-менеджер

- PM2 (конфигурации ecosystem.config.js / ecosystem.config.cjs)

## Структура проекта

```
GoldSpoon/
|-- API/
|   |-- api/
|   |   |-- index.js          # Основной сервер API (порт 2379)
|   |   |-- package.json
|   |-- server.js             # Сервер документации Swagger (порт 7363)
|   |-- swagger.yaml          # Спецификация OpenAPI / Swagger
|   |-- swagger.json
|   |-- package.json
|-- Mobile/                   # Мобильное PWA-приложение
|   |-- src/
|   |   |-- pages/            # Страницы: Home, Menu, Cart, Orders, Profile и др.
|   |   |-- store/            # Zustand-сторы: auth, cart, menu, orders, reservation
|   |   |-- api/client.ts     # HTTP-клиент к API
|   |-- vite.config.ts
|   |-- tailwind.config.js
|   |-- postcss.config.js
|   |-- tsconfig.json
|   |-- ecosystem.config.cjs   # PM2 конфигурация для production
|   |-- package.json
|-- PC_application/            # Административная панель
|   |-- src/
|   |   |-- components/        # UI-компоненты, панели по ролям
|   |   |-- components/ui/     # Библиотека UI-компонентов (Radix + Tailwind)
|   |-- vite.config.ts
|   |-- ecosystem.config.js    # PM2 конфигурация (API + AdminPanel)
|   |-- package.json
|-- Site/                      # Главный сайт ресторана
|   |-- src/
|   |   |-- pages/             # Главная, меню, контакты, профиль и др.
|   |   |-- components/        # Header, Footer, Auth, ModalAuth и др.
|   |   |-- api/client.js      # HTTP-клиент к API
|   |-- vite.config.js
|   |-- package.json
|-- .env                       # Переменные окружения (пустой файл)
|-- README.md
```

## Где находится сервер

Основной API-сервер расположен в директории `API/api/` и запускается файлом `index.js`.
Сервер работает на порту `2379`.

Сервер документации Swagger расположен в директории `API/` и запускается файлом `server.js`.
Сервер работает на порту `7363`.

Конфигурация подключения к базе данных указана в `API/api/index.js`:
- хост, пользователь, пароль и имя базы данных задаются в объекте `dbConfig`.

## Как запускать

### Требования

- Node.js (рекомендуется LTS)
- MySQL-сервер с созданной базой данных `Restoranchiki`

### Установка зависимостей

```bash
# API (основной сервер)
cd API/api
npm install

# API (документация Swagger)
cd ../../API
npm install

# Главный сайт
cd ../Site
npm install

# Мобильное приложение
cd ../Mobile
npm install

# Админ-панель
cd ../PC_application
npm install
```

### Запуск в режиме разработки

```bash
# API сервер (порт 2379)
cd API/api
npm run dev

# Swagger UI (порт 7363)
cd ../../API
npm run dev

# Главный сайт (порт по умолчанию Vite)
cd ../Site
npm run dev

# Мобильное приложение (порт 5173)
cd ../Mobile
npm run dev

# Админ-панель (порт 37466)
cd ../PC_application
npm run dev
```

### Сборка production

```bash
# Главный сайт
cd Site
npm run build

# Мобильное приложение
cd ../Mobile
npm run build

# Админ-панель
cd ../PC_application
npm run build
```

### Запуск через PM2

Для мобильного приложения (production через `serve`):
```bash
cd Mobile
pm2 start ecosystem.config.cjs
```

Для API и админ-панели (конфигурация из `PC_application/ecosystem.config.js` требует корректировки путей `cwd` под ваш сервер):
```bash
cd PC_application
pm2 start ecosystem.config.js
```

## Переменные окружения

Файл `.env` находится в корне проекта. На текущий момент файл пустой; при необходимости в него можно вынести параметры подключения к БД, секретный ключ JWT и адрес API.
