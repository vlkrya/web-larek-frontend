import './scss/styles.scss';

import { AppStatus, CatalogChangeEvent } from './components/AppData';
import { EventEmitter } from './components/base/events';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Page } from './components/Page';
import { Card } from './components/Card';
import { LarekApi } from './components/LarekApi';
import { API_URL, CDN_URL } from './utils/constants';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';
import { OrdersDelivery, paymentMethod } from './components/OrdersDelivery';
import { OrdersContacts } from './components/OrdersContacts';
import { Success } from './components/Success';
import { ICard, IOrdersContacts, IOrdersDelivery } from './types';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const ordersDeliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const ordersContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appStatus = new AppStatus({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const ordersDelivery = new OrdersDelivery(
	cloneTemplate(ordersDeliveryTemplate),
	events,
	{
		onClick: (event: Event) => {
			events.emit('payment:changed', event.target);
		},
	}
);
const ordersContacts = new OrdersContacts(
	cloneTemplate(ordersContactsTemplate),
	events
);

events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appStatus.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});
		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

events.on('card:select', (item: ICard) => {
	appStatus.setPreview(item);
});

events.on('preview:changed', (item: ICard) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('item:check', item);
			card.buttonText =
				appStatus.basket.indexOf(item) < 0 ? 'Add to cart' : 'Remove from cart';
		},
	});

	modal.render({
		content: card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			description: item.description,
			price: item.price,
			buttonText:
				appStatus.basket.indexOf(item) < 0 ? 'Add to cart' : 'Remove from cart',
		}),
	});
});

events.on('item:check', (item: ICard) => {
	appStatus.basket.indexOf(item) < 0
		? events.emit('item:add', item)
		: events.emit('item:delete', item);
});

events.on('item:add', (item: ICard) => {
	appStatus.addItemToBasket(item);
});

events.on('item:delete', (item: ICard) => {
	appStatus.deleteItemFromBasket(item);
});

events.on('basket:changed', (items: ICard[]) => {
	basket.items = items.map((item, index) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('item:delete', item),
		});
		return card.render({
			title: item.title,
			price: item.price,
			count: String(index),
		});
	});

	const total = items.reduce((sum, item) => sum + item.price, 0);
	basket.total = total;
	appStatus.order.total = total;
});

events.on('count:changed', () => {
	page.counter = appStatus.basket.length;
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render({}),
	});
});

events.on('order:open', () => {
	modal.render({
		content: ordersDelivery.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
	appStatus.order.items = appStatus.basket.map((item) => item.id);
});

events.on('payment:changed', (target: HTMLElement) => {
	if (!target.classList.contains('button_alt-active')) {
		const methodKey = target.getAttribute('name');
		const methodValue = methodKey ? paymentMethod[methodKey] : undefined;
		if (methodValue) {
			ordersDelivery.changeButtonsClasses();
			appStatus.order.payment = methodValue;
		}
	}
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrdersDelivery; value: string }) => {
		appStatus.setOrdersDelivery(data.field, data.value);
	}
);

events.on('deliveryForm:changed', (errors: Partial<IOrdersDelivery>) => {
	const { payment, address } = errors;
	ordersDelivery.valid = !payment && !address;
	ordersDelivery.errors = Object.values({ payment, address })
		.filter(Boolean)
		.join('; ');
});

events.on('ordersDelivery:changed', () => {
	ordersDelivery.valid = true;
});

events.on('order:submit', () => {
	modal.render({
		content: ordersContacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
	appStatus.order.items = appStatus.basket.map((item) => item.id);
});

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrdersContacts; value: string }) => {
		appStatus.setOrdersContacts(data.field, data.value);
	}
);

events.on('contactsForm:changed', (errors: Partial<IOrdersContacts>) => {
	const { email, phone } = errors;
	ordersContacts.valid = !email && !phone;
	ordersContacts.errors = Object.values({ email, phone })
		.filter(Boolean)
		.join('; ');
});

events.on('ordersContacts:changed', () => {
	ordersContacts.valid = true;
});

events.on('contacts:submit', () => {
	api.orderProducts(appStatus.order).then((result) => {
		appStatus.clearBasket();
		const success = new Success(cloneTemplate(successTemplate), {
			onClick: () => {
				modal.close();
			},
		});
		success.total = result.total.toString();
		modal.render({
			content: success.render({}),
		});
	});
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api.getCardsList().then(appStatus.setCards.bind(appStatus));
