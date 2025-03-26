export interface IEventEmitter {
	on<T extends object>(event: string, callback: (data: T) => void): void;
	off(event: string, callback: Function): void;
	emit<T extends object>(event: string, data: T): void;
}

export interface IBaseView {
	readonly container: HTMLElement;
	render(): HTMLElement;
	show(): void;
	hide(): void;
}

export interface IModalView extends IBaseView {
	close(): void;
	open(): void;
}

export interface IBaseFormView extends IBaseView {
	showValidation(errors: Record<string, string>): void;
	clear(): void;
}
