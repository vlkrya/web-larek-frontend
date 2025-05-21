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

Компоненты и описание классов

AppState
Назначение: модель состояния приложения, хранит каталог товаров, текущий заказ и предпросмотр товара
Конструктор constructor (api: IProductAPI, events: EventEmitter)
api: IProductAPI - интерфейс для обращения к серверу
events: EventEmitter - брокер событий

Поля:
catalog: IProduct[] - список товаров
preview: IProduct | null - товар, выбранный для предпросмотра
order: IOrder | null - текущий заказ

Методы
setCatalog(items: IProduct[]) - сохраняет каталог товаров
getProduct(productId: string) - возвращает товар по ID
addToOrder(product: IProduct) - добавляет товар в заказ
removeFromOrder(product: IProduct) - устанавливает товар для предпросмотра
cleatOrder() - очищает заказ
setPreview(product: IProduct) - устанавливает товар для предпросмотра
setOrderField(field: keyof IContactInform | 'address', value: string) - изменяет поле заказа
setPaymentMethod(value: PaymentMethod) - задает способ оплаты
validateOrder() - валидирует заказ

ProductAPi
Назначение: предоставляет методы для загрузки каталога и оформления заказа

Методы
getProducts(): Promise<IProduct[]> - получает список товаров
order(data: IOrder): Promise<void> - отправляет заказ на сервер

Component
Назначение: базовый класс компонентов UI
Конструктор: constructor(protected element: HTMLElement)
Поля: element: HTMLElement - корневой элемент компонента
Методы: render(dataa: unknown): HTMLElement - отрисовывает компонент

Modal
Назначение: универсальное модальное окно, отображающее произвольный контент
Наследует: Compoent
Поля:
closeButton: HTMLButtonElement
content: HTMLElement
Методы:
setContent(content: HTMLElement) - задает контент
open() / close () - отображение / скрытие окна

Basket
Назначение: отображает корзину с товарами
Наследует: Component
Поля: items: BasketItem[] - компоненты с товарами
total: number - сумма заказа

Методы
render(data: IProduct[]) - отрисовывает содержимое корзины

Form, Order, Contacts

Назначение: компоненты форм заказа и контактов
Наследуют: Form
Поля:
fields: Record<string, HTMLInputElement> - инпуты формы
errors: Record<string, string> - ошиибки валидации

Методы
setField(name: string, value: string) - обновляет значение поля
validate() - проверка полей формы

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
