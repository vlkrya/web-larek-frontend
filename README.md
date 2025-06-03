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

## Классы приложения

- **EventEmitter** — брокер событий. Методы `on`, `off`, `emit`. Внутри хранится `Map<string, Set<Function>>`.
- **Api** — базовый HTTP-клиент (`constructor(baseUrl: string, options?)`, методы `get<T>` и `post<T>`).
- **ProductAPI** — наследник `Api`, работает с сервером Ларька: `getProductList`, `getProductItem`, `orderProducts`.
- **Model<T>** — абстрактная модель (`constructor(data, events)` и защищённый `emitChanges`).
- **AppState** — модель состояния приложения. Методы: `setCatalog`, `addToOrder`, `removeFromOrder`, `clearOrder`, `setPreview`, `setOrderField`, `setPaymentMethod`, `validateOrder`.
- **Component<T>** — базовый класс представления (`render`, `setText`, `setImage`, `toggleClass`).
- **Page** — верхний контейнер приложения; сеттеры `catalog`, `counter`, `locked`.
- **CardView** — абстрактная карточка товара; сеттеры `id`, `title`, `price`.
- **CatalogItem** — карточка в списке каталога; добавляет поля `_image`, `_category`.
- **ProductCard** — детальная карточка товара; добавляет `_description` и кнопку `buttonAddToCart`.
- **BasketItem** — карточка товара в корзине; дополнительный сеттер `index`.
- **Basket** — компонент корзины; сеттеры `items` и `total`.
- **Modal** — универсальное модальное окно (`open`, `close`, сеттер `content`).
- **Form<T>** — базовый компонент формы (`onInputChange`, сеттеры `valid`, `errors`).
- **Order** — форма доставки и способа оплаты; сеттеры `payment`, `address`, метод `disableButtons`.
- **Contacts** — форма контактных данных; сеттеры `phone`, `email`.
- **Success** — окно «Заказ оформлен»; сеттер `total`.

## Типы данных

- **IProduct** — `id`, `title`, `description`, `category`, `price`, `image`.
- **PaymentMethod** — перечисление: `'card'` или `'cash'`.
- **IOrderForm** — `address`, `payment`.
- **IContactInfoForm** — `email`, `phone`.
- **IOrder** — объединяет `IOrderForm`, `IContactInfoForm` и массив `items: IProduct[]`.
- **FormErrors** — объект вида `{ [ключ поля]: сообщение об ошибке }`.

## События

- `items:changed` — генерирует `AppState.setCatalog`; слушает `Page`, чтобы перерисовать каталог.
- `basket:changed` — вызывается при добавлении или удалении товаров; обновляет счётчик (`Page`) и содержимое (`Basket`).
- `preview:changed` — генерирует `AppState.setPreview`; `Modal` показывает `ProductCard`.
  `basket:open` — генерирует `Page` при клике на иконку корзины; `Modal` открывает компонент `Basket`.
- `order:open` — создаёт `Basket`; `Modal` открывает форму `Order`.
- `order:submit` — отправляет форма `Order`; `AppState` валидирует заказ.
- `contacts:submit` — отправляет форма `Contacts`; `ProductAPI` делает POST `/order`.
- `formErrors:change` — генерирует `AppState.validateOrder`; формы выводят сообщения об ошибках.
- `modal:open` и `modal:close` — управляют блокировкой фона в `Page`.
