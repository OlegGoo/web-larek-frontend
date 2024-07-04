# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Базовый код

### Класс Component<T> 
  Является дженериком, обеспечивает базовый функционал работы с DOM-элементами.
  В конструктор принимает элемент разметки, являющийся основным родительским контейнером компонента.
#### Поля:
  - protected constructor(protected readonly container: HTMLElement)
#### Методы:
  - toggleClass(element: HTMLElement, className: string, force?: boolean) - переключает класс HTML-элемента, который указывается в параметрах, вместе с именем класса, на который нужно переключиться.
  - protected setText(element: HTMLElement, value: unknown) -  устанавливает текстовое содержимое HTML-элемента. 
  - setDisabled(element: HTMLElement, state: boolean) - изменяет статус блокировки для переданного элемента.
  - protected setHidden(element: HTMLElement) - скрывает переданный элемент.
  - protected setVisible(element: HTMLElement) -  отоброжает переданный элемент.
  - render(data?: Partial<T>): HTMLElement - Вернуть корневой DOM-элемент.

### Класс EventEmmiter
  Реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события.
#### Поля:
  `_events: Map<EventName, Set<Subscriber>>`
#### Конструктор:
  `this._events = new Map<EventName, Set<Subscriber>>()`
#### Методы:
  <b>on , off , emit</b> — для подписки на событие, отписки от события и уведомления подписчиков о наступлении события соответственно.
  Дополнительно реализованы методы <b>onAll и offAll</b> — для подписки на все события и сброса всех подписчиков. Интересным дополнением является метод <b>trigger</b> , генерирующий заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса EventEmitter.

### Класс Api
  Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект для запросов.
#### Поля:
  - readonly baseUrl: string - свойство, принимающее на вход строку, содержащую адрес сервера
  - protected options: RequestInit - свойство с специальными свойствами отправки запроса.
#### Конструктор:
  `constructor(baseUrl: string, options: RequestInit = {})`- принимает базовый URL и глобальные опции для всех запросов(опционально).
#### Методы:
  - `protected handleResponse(response: Response): Promise<object>` - принимает ответ сервера и возвращает промис с данными в случае успеха, в ином случае возвращает промис с причиной неудачного запроса.  
  - get(uri: string) -  позволяет получить данные с сервера.
  - post(uri: string, data: object, method: ApiPostMethods = 'POST') - позволяет отправить данные на сервер. 

### Класс Model 
  Базовый класс модели данных.
#### Конструктор:
  - constructor(data: Partial<T>, protected events: IEvents) -  принимает данные и экземпляр EventEmitter
#### Методы:
  - emitChanges(event: string, payload?: object) - ообщает об изменении модели

## Компоненты модели данных
### Класс Product
Класс отвечает за хранение и логику работы с данными товаров.
#### Поля:
  - products: IProduct[] - публичное свойство, хранящее массив товаров
#### Методы:
- get products(): IProduct[] - Получение всех продуктов

### Класс Order
Отвечает за хранение и логику работы с данными при оформлении заказа 
#### Поля:
  - payment: IPayment - способ оплаты заказа;
  - address: string - адрес доставки;
  - email: string - почта пользователя;
  - phone: string - телефон пользователя;
  - total: number | null - общая сумма заказа;
  - items: ICard[] - массив товаров в заказе;
#### Методы:
  validateContacts() и validateDeliveryDetails() - методы валидации введенных пользователем данных. 

### Класс BasketData
  Отвечает за хранение и логику работы с данными о товарах в корзине. 
#### Поля: 
  - products: IProduct[] - публичное свойство, хранящее массив товаров
  - total: number | null - публичное свойство, хранящее сумму к оплате
#### Методы:
  - addItem(product: IProduct) - добавление товара в корзину,
  - deleteItem(product: IProduct) - удаление товара из корзины,
  - clearBasket() - очистка корзины,
  - getTotalItems() - получить обшее коллическво товаров, добавленных в корзину
  - getTotalPice() - получить сумму всех товаров, добавленных в корзину

## Компоненты представления
### Класс Page
  Это класс отображения страницы, содержащей логотип, корзину с колличесвом товаров  и каталог товаров.
#### Поля: 
  - protected _counter: HTMLElement - элемент счетчика корзины
  - protected _catalog: HTMLElement - контейнер для товаров
  - protected _wrapper: HTMLElement - обертка всей страницы
  - protected _basket: HTMLElement - корзина
#### Методы:
- set catalog(items: HTMLElement[]) - записывает товары в каталог
- set counter(value: number) - записывает количество товаров в корзине
- set locked(value: boolean) - позволяет заблокировать страницу для прокрутки

### Класс Basket
  Класс используется для управления отображением данных в корзины.
#### Поля:
  - protected _list: HTMLElement -  список товаров
  - protected _total: HTMLElement - общая сумма заказа
  - protected _button: HTMLElement - кнопка
#### Сеттеры:
  - set total(price: number) - сеттер для установки стоимости товаров в корзине
  - set items(items: HTMLElement[]) - для установки отображаемых в корзине товаров; здесь же в зависимости от наличия товаров в корзине активируется/деактивируется кнопка оформления заказа

### Класс Card
  Класс отображения карточки. 
#### Поля:
  - protected _title: HTMLElement - DOM-элемент для отображения названия товара
  - protected _image?: HTMLImageElement -  DOM-элемент для отображения картинки
  - protected _description?: HTMLElement - DOM-элемент для отображения описания товара
  - protected _button?: HTMLButtonElement - DOM-элемент для отображения кнопки "В коризну"
#### Конструктор:
  `constructor(container: HTMLElement, actions?: IAuctionActions)`- В качестве аргументов принимает контейнер для поиска и опционально объект действий.
#### Методы:
  - set id(value: string) \ get id(): string - запись и поулчение id карточки товара
  - set title(value: string) \ get title(): string - запись и получение названия карточки товара
  - set image(value: string) - позволяет установить изображение товара
  - set description(value: string | string[]) - запись описание товара

### Класс Form
 Класс отображения элементов формы.
#### Поля:
  - protected _submit: HTMLButtonElement - кнопка отправки данных формы
  -  protected _errors: HTMLElement - DOM-элемент, ошибок
#### Конструктор: 
  `constructor(protected container: HTMLFormElement, protected events: IEvents)` - в качестве аргументов принимает контейнер для поиска и объект для работы с событиями. В конструкторе инициализируются защищенные свойства, а также добавляется слушатели на сабмит и инпут формы.
#### Методы:
  - onInputChange(field: keyof T, value: string) - защищенный метод для события введения данных пользователем
  - set valid(value: boolean) - разблокирует или заблокирует кнопку отправки
  - set errors(value: string) - добавляет ошибки валидации
  - render(state: Partial<T> & IFormState) - отрисовка формы

### Класс Modal
  Реализует модальное окно.
#### Поля:
  - protected _closeButton: HTMLButtonElement - DOM-элемент кнопки закрытия модального окна
  - protected _content: HTMLElement - DOM-элемент для отображения контента
#### Конструктор: 
  - constructor(container: HTMLElement, protected events: IEvents) - В качестве аргументов принимает контейнер для поиска и обект для работы с событиями. В конструкторе инициализируются защищенные свойства, а также доабвляются слушатели на клики.
#### Методы:
  - set content(value: HTMLElement)- сеттер для установки контента
  - open - позволяет открыть модальное окно
  - close - закрывает модальное окно либо при клике по кнопке с крестиком, либо ко клику на оверлей
  - render(data: IModalData): HTMLElement - публичный метод для отрисовки 

## Об архитектуре 
Взаимодействия внутри приложения происходят через события. Модели инициализируют события, слушатели событий в основном коде выполняют передачу данных компонентам отображения, а также вычислениями между этой передачей, и еще они меняют значения в моделях.
## Основные типы/интерфейсы проекта
```
interface IProduct{
  id: string; 
  title: string; 
  image: string; 
  price: number | null; 
  description: string;  
}

interface IModal {
  content: HTMLElement;
  closeButton: HTMLButtonElement;
  open(): void;
  close(): void; 
}

interface IPage {
  catalog: HTMLElement[];
}

interface IBasket {
  total: number;
  items: HTMLElement[];
}

interface IForm {
  valid: boolean;
  errors: string[];
}

interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;
}