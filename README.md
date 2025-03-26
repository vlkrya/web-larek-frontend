# Web-ларёк

Проект интернет-магазина товаров для веб-разработчиков. В приложении реализован каталог товаров, корзина и оформление заказа с пошаговой валидацией данных.

## Стек технологий

- TypeScript
- HTML
- CSS
- Webpack
- EventEmitter

## Установка и запуск

1. Установите зависимости:

```bash
npm install
```

2. Создайте в корне проекта файл `.env` и добавьте в него:

API_ORIGIN=https://larek-api.nomoreparties.co

3. Запустите проект командой:

```bash
npm run start
```

## Архитектура проекта

Проект реализован на основе паттерна **MVP (Model-View-Presenter)**, что позволяет достичь слабой связности компонентов и гибкости при масштабировании.

MVP - это архитектурный паттерн, который разделяет приложение на три основных слоя:

- **Model (Модель)** - отвечает за данные и бизнес-логику приложения
- **View (Представление)** - отвечает за отображение данных пользователю
- **Presenter (Представитель)** - связующее звено между Model и View, которое реагирует на действия пользователя из View и обновляет Model, а также следит за изменениями в Model и обновляет View

### Взаимодействие между слоями

В данном проекте взаимодействие между слоями организовано через событийно-ориентированный подход с использованием EventEmitter. Это позволяет:

- Достичь слабой связанности между компонентами (компоненты не знают друг о друге)
- Организовать асинхронное взаимодействие
- Легко добавлять новые компоненты без изменения существующего кода

Схема взаимодействия:

1. View генерирует события при действиях пользователя
2. Presenter подписывается на эти события и реагирует на них
3. Presenter обновляет Model в ответ на действия
4. Model генерирует события при изменении данных
5. Presenter подписывается на события Model и обновляет View

### Классы проекта

#### Базовые классы

##### EventEmitter

Базовый класс для организации событийной модели.

Методы:

- on<T extends object>(event: string, callback: (data: T) => void): void - подписка на событие
- off(event: string, callback: Function): void - отписка от события
- emit<T extends object>(event: string, data: T): void - генерация события

##### BaseView

Базовый класс для всех представлений.

Конструктор:

```typescript
constructor(container: HTMLElement)
```

Поля:

- protected container: HTMLElement - корневой элемент компонента

Методы:

- render(): HTMLElement - отрисовка компонента
- show(): void - показать компонент
- hide(): void - скрыть компонент

##### Modal

Базовый класс для модальных окон. Наследуется от BaseView.

Методы:

- close(): void - закрытие модального окна
- open(): void - открытие модального окна

#### Коммуникационный слой

##### ApiClient

Класс для работы с API сервера.

Конструктор:

```typescript
constructor(baseUrl: string)
```

Методы:

- getProductList(): Promise<IProductItem[]> - получение списка товаров
- getProductItem(id: string): Promise<IProductItem> - получение информации о товаре
- orderProducts(order: IOrderForm): Promise<IOrderResult> - отправка заказа

#### Модели (Models)

##### CartModel

Класс для управления корзиной товаров.

Конструктор:

```typescript
constructor();
```

Поля:

- private \_items: string[] - массив ID товаров в корзине

Методы:

- add(itemId: string): void - добавляет товар в корзину
- remove(itemId: string): void - удаляет товар из корзины
- clear(): void - очищает корзину
- getItems(): string[] - возвращает список ID товаров
- getTotal(products: IProductItem[]): number - вычисляет общую стоимость

##### OrderModel

Класс для управления данными заказа.

Конструктор:

```typescript
constructor();
```

Поля:

- private \_payment: string - способ оплаты
- private \_address: string - адрес доставки
- private \_email: string - email покупателя
- private \_phone: string - телефон покупателя

Методы:

- validate(): Record<string, string> - проверяет корректность данных заказа
- isValid(): boolean - проверяет валидность всех полей
- setPayment(payment: string): void - устанавливает способ оплаты
- setAddress(address: string): void - устанавливает адрес доставки
- setContact(email: string, phone: string): void - устанавливает контактные данные

#### Представления (Views)

##### CatalogView

Класс для отображения каталога товаров. Наследуется от BaseView.

Конструктор:

```typescript
constructor(container: HTMLElement)
```

Поля:

- private \_items: HTMLElement[] - элементы каталога
- private \_cardTemplate: HTMLTemplateElement - шаблон карточки

Методы:

- renderItem(item: IProductItem): HTMLElement - отрисовка карточки товара
- render(items: IProductItem[]): HTMLElement - отрисовка каталога

##### BasketButtonView

Класс для управления кнопкой корзины. Наследуется от BaseView.

Конструктор:

```typescript
constructor(container: HTMLElement)
```

Поля:

- private \_button: HTMLElement - кнопка корзины
- private \_counter: HTMLElement - счетчик товаров

Методы:

- updateCounter(count: number): void - обновление счетчика
- setEnabled(enabled: boolean): void - управление активностью кнопки

##### CartView

Класс для отображения корзины. Наследуется от Modal.

Конструктор:

```typescript
constructor(container: HTMLElement)
```

Поля:

- private \_itemsContainer: HTMLElement - контейнер списка товаров
- private \_totalElement: HTMLElement - элемент общей стоимости
- private \_submitButton: HTMLElement - кнопка оформления заказа

Методы:

- render(items: IProductItem[]): HTMLElement - отрисовка корзины
- updateTotal(total: number): void - обновление общей стоимости
- setSubmitEnabled(enabled: boolean): void - управление кнопкой оформления

##### PaymentFormView

Класс для отображения формы оплаты. Наследуется от BaseFormView.

Конструктор:

```typescript
constructor(container: HTMLElement)
```

Поля:

- private \_paymentInput: HTMLInputElement - поле способа оплаты
- private \_addressInput: HTMLInputElement - поле адреса

Методы:

- render(): HTMLElement - отрисовка формы
- showValidation(errors: Record<string, string>): void - отображение ошибок
- clear(): void - очистка формы

##### ContactFormView

Класс для отображения формы контактных данных. Наследуется от BaseFormView.

Конструктор:

```typescript
constructor(container: HTMLElement)
```

Поля:

- private \_emailInput: HTMLInputElement - поле email
- private \_phoneInput: HTMLInputElement - поле телефона

Методы:

- render(): HTMLElement - отрисовка формы
- showValidation(errors: Record<string, string>): void - отображение ошибок
- clear(): void - очистка формы

##### SuccessView

Класс для отображения успешного оформления заказа. Наследуется от Modal.

Конструктор:

```typescript
constructor(container: HTMLElement)
```

Методы:

- render(orderNumber: string): HTMLElement - отрисовка сообщения об успехе

#### Presenter

##### AppPresenter

Класс-представитель, связывающий модели и представления.

Конструктор:

```typescript
constructor(
    eventEmitter: IEventEmitter,
    api: ApiClient
)
```

Поля:

- private \_eventEmitter: IEventEmitter - брокер событий
- private \_api: ApiClient - API клиент
- private \_cart: CartModel - модель корзины
- private \_order: OrderModel - модель заказа
- private \_catalog: CatalogView - представление каталога
- private \_cartButton: BasketButtonView - кнопка корзины
- private \_cartView: CartView - представление корзины
- private \_paymentView: PaymentFormView - форма оплаты
- private \_contactView: ContactFormView - форма контактов
- private \_successView: SuccessView - окно успешного заказа

Методы:

- init(): void - инициализация приложения
- private \_handleProductSelect(id: string): void - обработка выбора товара
- private \_handleCartAdd(id: string): void - обработка добавления в корзину
- private \_handleCartRemove(id: string): void - обработка удаления из корзины
- private \_handleOrderSubmit(): void - обработка отправки заказа

### События приложения

- modal:open - открытие модального окна
- modal:close - закрытие модального окна
- update:catalog - обновление каталога
- cart:add - добавление товара в корзину
- cart:remove - удаление товара из корзины
- payment:submit - отправка формы оплаты
- contacts:submit - отправка формы контактов
- order:success - успешное оформление заказа
