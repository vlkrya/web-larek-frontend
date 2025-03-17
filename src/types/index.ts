export interface IModel {
	emitChanges(): void;
}

export interface IAppAPI {
	getProductList: () => Promise<IProductItem[]>;
	getProductItem: (id: string) => Promise<IProductItem>;
	orderProducts: (order: IOrderForm) => Promise<IOrderResult>;
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

export interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export interface IComponent {
	readonly container: HTMLElement;
	render(): HTMLElement;
}

export enum Events {
	OPEN_MODAL = 'modal:open',
	CLOSE_MODAL = 'modal:close',
	UPDATE_CATALOG = 'catalog:update',
}
