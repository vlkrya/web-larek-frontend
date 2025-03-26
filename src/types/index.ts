export interface IModel {
	emitChanges(): void;
}

export interface IApiClient {
	getProductList(): Promise<IProductItem[]>;
	getProductItem(id: string): Promise<IProductItem>;
	orderProducts(order: IOrderForm): Promise<IOrderResult>;
}

export type ProductCategory =
	| 'софт-скил'
	| 'хард-скил'
	| 'другое'
	| 'дополнительное';

export interface IProductItem {
	id: string;
	title: string;
	description: string;
	category: ProductCategory;
	image: string;
	price: number | null;
}

export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
	items: string[];
}

export interface IOrderResult {
	id: string;
	total: number;
}

export interface ICartModel extends IModel {
	items: string[];
	add(itemId: string): void;
	remove(itemId: string): void;
	clear(): void;
	getItems(): string[];
	getTotal(products: IProductItem[]): number;
}

export interface IOrderModel extends IModel {
	payment: string;
	address: string;
	email: string;
	phone: string;

	validate(): Record<string, string>;
	isValid(): boolean;
	setPayment(payment: string): void;
	setAddress(address: string): void;
	setContact(email: string, phone: string): void;
}

export interface ICatalogView extends IBaseView {
	items: HTMLElement[];
	cardTemplate: HTMLTemplateElement;
	renderItem(item: IProductItem): HTMLElement;
	render(items: IProductItem[]): HTMLElement;
}

export interface IBasketButtonView extends IBaseView {
	updateCounter(count: number): void;
	setEnabled(enabled: boolean): void;
}

export interface ICartView extends IModalView {
	itemsContainer: HTMLElement;
	totalElement: HTMLElement;
	submitButton: HTMLElement;
	render(items: IProductItem[]): HTMLElement;
	updateTotal(total: number): void;
	setSubmitEnabled(enabled: boolean): void;
}

export interface IPaymentFormView extends IBaseFormView {
	paymentInput: HTMLInputElement;
	addressInput: HTMLInputElement;
}

export interface IContactFormView extends IBaseFormView {
	emailInput: HTMLInputElement;
	phoneInput: HTMLInputElement;
}

export interface ISuccessView extends IModalView {
	render(orderNumber: string): HTMLElement;
}

export interface IAppPresenter {
	eventEmitter: IEventEmitter;
	api: IApiClient;
	cart: ICartModel;
	order: IOrderModel;
	catalog: ICatalogView;
	cartButton: IBasketButtonView;
	cartView: ICartView;
	paymentView: IPaymentFormView;
	contactView: IContactFormView;
	successView: ISuccessView;

	init(): void;
}

export enum Events {
	OPEN_MODAL = 'modal:open',
	CLOSE_MODAL = 'modal:close',
	UPDATE_CATALOG = 'catalog:update',
	ADD_TO_CART = 'cart:add',
	REMOVE_FROM_CART = 'cart:remove',
	SUBMIT_PAYMENT = 'payment:submit',
	SUBMIT_CONTACTS = 'contacts:submit',
	ORDER_SUCCESS = 'order:success',
}
