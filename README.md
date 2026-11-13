# UltraPlitkaShop — бэкенд интернет-магазина плитки

Бэкенд на **NestJS + Prisma + PostgreSQL**. Сейчас реализован модуль аутентификации.

## Что реализовано

- Регистрация и вход (`POST /auth/register`, `POST /auth/login`)
- JWT: пара access / refresh токенов, обновление access-токена (`POST /auth/login/access-token`)
- Хеширование паролей через **argon2**
- Passport JWT-стратегия, декоратор `@Auth()` для защиты роутов и `@CurrentUser()` для получения пользователя
- Валидация входных данных через DTO (`class-validator`, `class-transformer`)
- Prisma-схема пользователя (email, имя, телефон, аватар); имя по умолчанию генерируется через Faker

## Стек

NestJS · TypeScript · Prisma · PostgreSQL · Passport · JWT · argon2 · Jest

## Запуск

```bash
cd back
npm install
# создайте .env: DATABASE_URL, JWT_SECRET, PORT
npx prisma migrate dev
npm run start:dev
```

## Планы

Каталог товаров, корзина, заказы, загрузка изображений.
