# Проект "Веб-ларёк"

## 📦 Стек технологий

- HTML
- SCSS
- TypeScript
- Webpack
- Node.js (npm/yarn)

## 🚀 Установка и запуск

1. Установите зависимости и запустите дев-сервер:

```bash
npm install && npm start
# или
yarn && yarn start
```

2. Для сборки продакшн-версии:

```bash
npm run build
# или
yarn build
```

---

## 🧱 Архитектура проекта (MVP)

Приложение построено по паттерну **Model–View–Presenter**:

- **Model** — управляет данными и бизнес-логикой
- **View** — отображает интерфейс и генерирует пользовательские события
- **Presenter** — обрабатывает бизнес-логику и координирует Model и View

Компоненты взаимодействуют через `EventEmitter`, что обеспечивает слабую связанность и модульность.

---

## 🔬 Базовые классы

### `Model`

- Абстрактный класс для управления состоянием
- Метод: `emitChanges(event: string, payload?: object): void`

### `Component`

- Базовый класс UI-компонентов
- Содержит методы для манипуляции DOM: `render`, `setText`, `setImage`, `toggleClass`, `setHidden`, `setVisible` и др.

### `EventEmitter`

- Универсальный брокер событий
- Методы: `on`, `off`, `emit`, `trigger`

### `Api`

- Класс для HTTP-запросов
- Методы: `get`, `post`, `handleResponse`

---

## 🗺 Компоненты View

### `Card`

- Отображает карточку товара
- Свойства: `id`, `title`, `image`, `category`, `price`, `description`, `buttonText`
- Генерирует событие `item:add`

### `Form<T>` (абстрактный)

- Управляет формами
- Методы: `onInputChange`, `render`
- Свойства: `valid`, `errors`

### `OrderForm`

- Наследуется от `Form<IOrderForm>`
- Свойства: `address`, `payment`
- Метод: `selectPaymentMethod`

### `ContactsForm`

- Наследуется от `Form<IContactsForm>`
- Свойства: `phone`, `email`

### `Page`

- Главный UI-контейнер
- Свойства: `counter`, `catalog`, `locked`

### `Basket`

- Отображает корзину
- Свойства: `items`, `selected`, `total`

### `Modal`

- Модальное окно
- Методы: `open`, `close`, `render`

### `Success`

- Отображает успешный заказ
- Свойства: `id`, `total`

---

## 🪄 Презентеры

### `ProductListPresenter`

- Загружает товары с сервера через `Api`
- Вызывает метод `render` карточек товаров
- Слушает `card:click` и вызывает `CartModel.addItem(...)`

### `CartPresenter`

- Реагирует на `item:add` и `item:remove`
- Обновляет `CartModel` и оповещает `Basket` и `Page`

### `OrderPresenter`

- Слушает `order:submit`
- Собирает данные из `OrderForm`, `ContactsForm` и `CartModel`
- Отправляет заказ через `Api`
- Генерирует `order:success`

---

## 🔔 События

| Событие           | Генерирует       | Обрабатывает           | Действие                         |
| ----------------- | ---------------- | ---------------------- | -------------------------------- |
| `products:loaded` | `ProductModel`   | `ProductListPresenter` | Отрисовка каталога               |
| `item:add`        | `Card`           | `CartPresenter`        | Добавление товара в корзину      |
| `item:remove`     | `Basket`         | `CartPresenter`        | Удаление товара                  |
| `cart:updated`    | `CartModel`      | `Basket`, `Page`       | Обновление корзины и счётчика    |
| `order:submit`    | `OrderForm`      | `OrderPresenter`       | Отправка формы заказа            |
| `order:success`   | `OrderPresenter` | `Success`              | Отображение подтверждения заказа |

---

## 📋 Интерфейсы данных (TypeScript)

Все интерфейсы определены в `src/types/index.ts`:

```ts
export interface IProductItem {
	id: string;
	title: string;
	description: string;
	price: number;
	category: string;
	image: string;
}

export interface IOrderForm {
	address: string;
	payment: string;
}

export interface IContactsForm {
	phone: string;
	email: string;
}

export interface IOrder {
	items: IProductItem[];
	total: number;
	address: string;
	payment: string;
	phone: string;
	email: string;
}

export interface ISuccess {
	id: string;
	total: number;
}

export interface IModalData {
	content: HTMLElement;
}
```

---
