# Проект "Веб-ларёк"

**Веб-ларёк** — это одностраничное приложение интернет-магазина, в котором пользователь может просматривать каталог товаров, добавлять их в корзину и оформлять заказ.

---

## 🧱 Архитектура проекта (MVP)

Архитектура реализована по принципу **Model–View–Presenter (MVP)**:

- **Model** — управляет состоянием и бизнес-логикой приложения (каталог товаров, корзина, заказ).
- **View** — отвечает за отрисовку интерфейса и генерацию событий при действиях пользователя.
- **Presenter** — связывает Model и View: реагирует на действия пользователя, обновляет модель и инициирует перерисовку.

В данной реализации роль Presenter выполняет файл index.ts, который организует логику взаимодействия между компонентами и данными через систему событий EventEmitter.

Компоненты общаются друг с другом через шину событий, реализованную на основе класса EventEmitter. Это позволяет избежать жёсткой связности между модулями и упрощает масштабирование.

---

## ⚙️ Стек технологий

- HTML, SCSS
- TypeScript
- Webpack

API: `https://larek-api.nomoreparties.co`

---

## 🚀 Установка и запуск

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

## 📂 Структура проекта

- `src/index.ts` — инициализация приложения.
- `src/pages/index.html` — точка входа в интерфейс.
- `src/components/` — основные UI-компоненты и презентеры.
- `src/components/base/` — базовые классы: `EventEmitter`, `Api`, `Component`, `Model`.
- `src/types/` — типы и интерфейсы TypeScript.
- `src/utils/` — вспомогательные утилиты и константы.
- `src/scss/` — стили приложения.

---

## 🔧 Классы и компоненты

### Базовые классы (`/components/base/`)

#### `EventEmitter`

Реализация шаблона Observer. Позволяет подписываться на события и генерировать их.

- Методы: `on`, `off`, `emit`, `trigger`
- Используется всеми модулями для связи между Presenter, Model и View.

#### `Api`

Обёртка над `fetch` с преднастроенным базовым URL и обработкой ошибок.

- Используется в `ProductListPresenter`, `OrderPresenter`

#### `Model`

Универсальный абстрактный класс, который хранит данные и рассылает события об их изменении.

- Методы: `emitChanges`
- Реализуется в моделях каталога, корзины, заказа

#### `Component`

Базовый UI-класс, предоставляющий методы для работы с DOM.

- Методы: `render`, `setText`, `setImage`, `toggleClass`, `setDisabled`

---

### Компоненты (`/components/`)

#### `Card`

Отображает карточку товара. Использует `IProductItem`.

- Инициирует `item:add` при добавлении в корзину

#### `Page`

Отображает основной экран, список карточек и счётчик корзины.

#### `Basket`

Список добавленных товаров и итоговая сумма заказа.

- Инициирует `item:remove`

#### `Modal`

Модальное окно для отображения любого контента (предпросмотр товара, успешный заказ).

#### `OrderForm`, `ContactsForm`

Формы ввода данных доставки и контактов.

- Используют типы `IOrderForm`, `IContactsForm`
- Валидируют поля, инициируют `order:submit`

#### `Success`

Экран успешного завершения заказа.

- Использует интерфейс `ISuccess`

---

### Презентеры

#### `ProductListPresenter`

- Загружает товары с API (`getCardsList`)
- Обновляет модель каталога и запускает отрисовку карточек

#### `CartPresenter`

- Управляет состоянием корзины (добавление/удаление товаров)

#### `OrderPresenter`

- Обрабатывает оформление заказа: собирает данные, вызывает `orderProducts`, очищает форму и корзину, инициирует `order:success`

---

## 🔄 События и взаимодействие

| Событие           | Источник       | Обработчик           | Описание действия                |
| ----------------- | -------------- | -------------------- | -------------------------------- |
| `products:loaded` | Model          | ProductListPresenter | Получение и отрисовка каталога   |
| `item:add`        | Card           | CartPresenter        | Добавление товара в корзину      |
| `item:remove`     | Basket         | CartPresenter        | Удаление товара из корзины       |
| `cart:updated`    | CartModel      | Basket, Page         | Обновление корзины и счётчика    |
| `order:submit`    | OrderForm      | OrderPresenter       | Отправка данных заказа           |
| `order:success`   | OrderPresenter | Success              | Отображение подтверждения заказа |

---

## 🧾 Типы и интерфейсы (`src/types/index.ts`)

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

export interface IOrder extends IOrderForm, IContactsForm {
	items: string[];
	total: number;
}

export interface IOrderSuccess {
	id: string;
	total: number;
}
```

Использование по компонентам:

- `IProductItem` — карточки товаров, корзина, каталог
- `IOrderForm`, `IContactsForm` — формы заказа
- `IOrder` — данные для отправки на API
- `IOrderSuccess` — успешный ответ API (в `Success`)
