# Проект "Веб-ларёк"

**Веб-ларёк** — это одностраничное приложение интернет-магазина, в котором пользователь может просматривать каталог товаров, добавлять их в корзину и оформлять заказ.

---

## Стек технологий

- HTML, SCSS
- TypeScript
- Webpack

API: `https://larek-api.nomoreparties.co`

---

## Установка и запуск

```bash
npm install
npm start
```

или

```bash
yarn
yarn start
```

Для сборки:

```bash
npm run build
# или
yarn build
```

---

## Архитектура проекта (MVP)

Model - логика состояние приложения класс AppState
View - визуально представление и взаимодействие с DOM
Presenter - связывает Model и View через события (в index.ts)

Взаимодействие:

Компоненты View генерируют события через EventEmitter
Event-обработчик в index.ts реагируют на эти события и вызывают методы модели
Модель генерирует события об изменениях, которые обновляют View

---

Компоненты и классы

Model:
AppState - управляет каталогом, заказом, предпросмотром, форм-валидацией
Model - базовый класс моделей
ProductAPI - загрузка данных с сервера и оформление заказа

View:

Page - главная страница, отображает каталог и счетчик корзины
Modal - универсальное модальное окно
CatalogItem/ ProductCard/ BasketItem - карточки товара в катологе, предпросмотре и корзине
Basket - модальное окно корзины
Order = форма адреса и способа оплаты
Contacts - форма контактной информации
Success - окно успешного закзаа

Базовые

Component - базовый класс всех View-компонентов
Form - базовый класс для форм Order и Contacts
EventEmitter - брокер событий

## Типы данных и интерфейсы

IProduct - товар: id, title, description, price, image, category
IOrderForm - способ оплаты и адрес доставки
IContactInForm - email и phone
IOrder - объединяет IOrderForm и IContactInfoForm + items: IProduct[]
PaymentMethod - card, cash
FormErrors - объект ошибок валидации формы

## События

'items: changed' - обновление каталога
'basket: changed' - изменения в корзине
'priview: changed' - открытие предпросмотра товара
'basket: open' - клик на иконку корзины
'order:open' - переход к оформлению заказа
'order: submit' - отправка формы заказа
'formErrors:change' - результат валидации полей формы
'order.payment:change', 'order.address:change' - изменения в Order
'contacts.email: change','contacts.phone: change' - изменения в Contacts
