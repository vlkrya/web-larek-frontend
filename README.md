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

#### Модели (Models)

##### ProductModel

Класс для управления данными товара.

Конструктор:

```typescript
constructor(data: IProductItem)
```

Поля:

- private \_id: string - уникальный идентификатор товара
- private \_title: string - название товара
- private \_description: string - описание товара
- private \_category: ProductCategory - категория товара
- private \_image: string - ссылка на изображение
- private \_price: number | null - стоимость товара

Методы:

- getId(): string - возвращает ID товара
- getTitle(): string - возвращает название товара
- getPrice(): number | null - возвращает цену товара
- setPrice(price: number): void - устанавливает цену товара

##### CartModel

Класс для управления корзиной товаров.

Конструктор:

```typescript
constructor();
```

Поля:

- private \_items: ProductModel[] - массив товаров в корзине
- private \_total: number - общая стоимость товаров

Методы:

- add(item: ProductModel): void - добавляет товар в корзину
- remove(id: string): void - удаляет товар из корзины
- clear(): void - очищает корзину
- getItems(): ProductModel[] - возвращает список товаров
- getTotal(): number - возвращает общую стоимость

##### OrderModel

Класс для управления данными заказа.

Конструктор:

```typescript
constructor(cart: CartModel)
```

Поля:

- private \_payment: string - способ оплаты
- private \_address: string - адрес доставки
- private \_email: string - email покупателя
- private \_phone: string - телефон покупателя
- private \_items: string[] - список ID товаров
- private \_total: number - сумма заказа

Методы:

- validate(): Record<string, string> - проверяет корректность данных заказа
- isValid(): boolean - проверяет валидность всех полей
- setPayment(payment: string): void - устанавливает способ оплаты
- setAddress(address: string): void - устанавливает адрес доставки
- setContact(email: string, phone: string): void - устанавливает контактные данные

#### Представления (Views)

##### ProductView

Класс для отображения карточки товара. Наследуется от BaseView.

Конструктор:

```typescript
constructor(container: HTMLElement)
```

Поля:

- private \_titleElement: HTMLElement - элемент заголовка
- private \_priceElement: HTMLElement - элемент цены
- private \_buttonElement: HTMLElement - кнопка действия

Методы:

- render(data: ProductModel): HTMLElement - отрисовывает карточку товара
- setButtonState(isInCart: boolean): void - меняет состояние кнопки

##### CartView

Класс для отображения корзины. Наследуется от BaseView.

Конструктор:

```typescript
constructor(container: HTMLElement)
```

Поля:

- private \_itemsContainer: HTMLElement - контейнер списка товаров
- private \_totalElement: HTMLElement - элемент общей стоимости

Методы:

- render(items: ProductModel[]): HTMLElement - отрисовывает корзину
- updateTotal(total: number): void - обновляет общую стоимость

##### OrderView

Класс для отображения формы заказа. Наследуется от BaseView.

Конструктор:

```typescript
constructor(container: HTMLElement)
```

Поля:

- private \_form: HTMLFormElement - форма заказа
- private \_paymentInput: HTMLInputElement - поле способа оплаты
- private \_addressInput: HTMLInputElement - поле адреса
- private \_emailInput: HTMLInputElement - поле email
- private \_phoneInput: HTMLInputElement - поле телефона

Методы:

- render(): HTMLElement - отрисовывает форму заказа
- showValidation(errors: Record<string, string>): void - отображает ошибки валидации
- clear(): void - очищает форму

#### Presenter

##### AppPresenter

Класс-представитель, связывающий модели и представления.

Конструктор:

```typescript
constructor(
    container: HTMLElement,
    eventEmitter: IEventEmitter,
    api: IAppAPI
)
```

Поля:

- private \_container: HTMLElement - корневой элемент приложения
- private \_eventEmitter: IEventEmitter - брокер событий
- private \_api: IAppAPI - API клиент
- private \_cart: CartModel - модель корзины
- private \_order: OrderModel - модель заказа
- private \_catalog: ProductView - представление каталога
- private \_cartView: CartView - представление корзины
- private \_orderView: OrderView - представление формы заказа

Методы:

- init(): void - инициализация приложения
- private \_handleProductSelect(id: string): void - обработка выбора товара
- private \_handleCartAdd(product: ProductModel): void - обработка добавления в корзину
- private \_handleCartRemove(id: string): void - обработка удаления из корзины
- private \_handleOrderSubmit(data: IOrderForm): void - обработка отправки заказа
