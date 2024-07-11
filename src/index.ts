import './scss/styles.scss';

import { EventEmitter } from './components/base/base/events';
import { Api } from './components/base/base/api';

import { Product } from './components/base/common/Product';
import { Order } from './components/base/common/Order';
import { BasketData } from './components/base/common/BasketData';

import { Page } from './components/base/common/Page';
import { Basket } from './components/base/common/Basket';
import { Card } from './components/base/common/Card';
import { FormPayment } from './components/base/common/FormPayment';
import { FormContacts } from './components/base/common/FormContacts';
import { Modal } from './components/base/common/Modal';
import { Success } from './components/base/common/Success';

import { IProduct, IOrder, PaymentMethods, ApiResponse } from './types';
import { ensureElement, cloneTemplate} from './utils/utils';
import { API_URL } from './utils/constants';

const events = new EventEmitter();
const api = new Api(API_URL);

// Все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const modalTemplate = ensureElement<HTMLElement>('#modal-container');
const paymentTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const product = new Product([], events);
const basketData = new BasketData({}, events);
const order = new Order({}, events);

// Компоненты представления
const page = new Page(document.body, events);
const modal = new Modal(modalTemplate, events);
const basket = new Basket('basket', cloneTemplate(basketTemplate), events);
const formPayment = new FormPayment(cloneTemplate(paymentTemplate),events);
const formContacts = new FormContacts(cloneTemplate(contactsTemplate), events);
const success = new Success('order-success', cloneTemplate(successTemplate), {
	onClick: () => events.emit('success:close')
});

// Получаем данные с сервера
api.get('/product')
  .then((res: ApiResponse) => {
		product.getProducts(res.items as IProduct[]);
	})
	.catch((err) => {
		console.error(err);
	});

// отображаем товары в каталоге
events.on('items:changed', () => {
	page.catalog = product.products.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('catalog:selectCard', item)
		});
		return card.render(item);
	});
});

// открыть карточку
events.on('catalog:selectCard', (item: IProduct) => {
	const cardPreview = new Card('card', cloneTemplate(cardPreviewTemplate), {
    onClick: () => {
			events.emit('modal:toBasket', item); //создаем действие добавления в корзину из карточки товара
			cardPreview.switchButtonText(item); //меняем текст кнопки "в корзину" при нажатии
		},
	});
	cardPreview.switchButtonText(item); //меняем текст кнопки в отображении, когда карточку закрыли и повторно открыли
	
	modal.render({
		content: cardPreview.render(item),
	});
});

//Добавляем продукт в корзину, удаляем продукт из корзины 
events.on('modal:toBasket', (item: IProduct) => {
	basketData.products.some((product) => product.id === item.id) ? basketData.deleteItem(item) : basketData.addItem(item);
	// меняем счетчик товаров в корзине
	page.counter = basketData.products.length;
	getBasketItems();
});

// получить актуальные отображения товаров, добавленных в корзину
function getBasketItems() {
	basket.items = basketData.products.map((item, index) => {
		const basketItem = new Card('card', cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('basket:delete', item); 
			},
		});
		basketItem.basketIndex = index + 1; 
		return basketItem.render(item);
	});
}

// открыть корзину
events.on('basket:open', () => {
  modal.render({
    content: basket.render(basketData),
  });
});

// удалить из корзины (находясь в корзине)
events.on('basket:delete', (itemDelete: IProduct) => {
	basketData.deleteItem(itemDelete);
	//переопределяем сумму корзины и счетчик на странице
	basket.total = basketData.total;
	page.counter = basketData.products.length;
	//перерисовываем список товаров
	getBasketItems();
});

// перейти к оформлению заказа
events.on('basket:order', () => {
	order.items = basketData.products.map((item) => item.id);
	order.total = basketData.total;

	if (order.validateDeliveryDetails()) {
		order.valid = true;
	}
	modal.render({
		content: formPayment.render(order)
	});
});

// // изменение данных об оплате
events.on('payment:change',(data: { field: keyof IOrder; value: PaymentMethods }) => {
		order.payment = data.value;
		order.validateDeliveryDetails();
	}
);

// изменение данных об адресе
events.on('address:change', (data: { field: keyof IOrder; value: string }) => {
	order.address = data.value;
	order.validateDeliveryDetails();
});

// Обрабатываем ввод адреса 
events.on('deliveryDetailsErrors:change', (errors: Partial<IOrder>) => {
	formPayment.valid = !Object.keys(errors).length; 
	const error = Object.values(errors).join(' и ');
  formPayment.errors = error.charAt(0).toUpperCase() + error.slice(1); 
});

// Перейти к заполнению контактов
events.on('order:submit', () => {
	if (order.validateContacts()) {
		order.valid = true;
	}
	modal.render({
		content: formContacts.render(order),
	});
});

//Изменение данных о почте
events.on('email:change', (data: { field: keyof IOrder; value: string }) => {
	order.email = data.value;
	order.validateContacts();
});

// Именение данных о телефоне
events.on('phone:change', (data: { field: keyof IOrder; value: string }) => {
	order.phone = data.value;
	order.validateContacts();
});

// Обрабатываем ошибки формы контактов
events.on('contactsErrors:change', (errors: Partial<IOrder>) => {
	formContacts.valid = !Object.keys(errors).length; 
	const error = Object.values(errors).join(' и ');
  formContacts.errors = error.charAt(0).toUpperCase() + error.slice(1); 
});

// отправляем на сервер
events.on('contacts:submit', () => {
	api.post('/order', order)
		.then((res) => {
			modal.render({
				content: success.render({
					total: order.total,
				}),
			});
			order.removeOrderData();
			basketData.clearBasket();
			basket.items = [];
			product.products.map((item) => (item.inBasket = false));
			page.counter = basketData.products.length;
		})
		.catch((err) => {
			console.log(err);
		});
});

events.on('success:close', () => {
	modal.close();
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
  page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
  page.locked = false;
});