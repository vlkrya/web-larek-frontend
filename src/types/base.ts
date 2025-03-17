export interface IEventEmitter {
	on<T extends object>(event: string, callback: (data: T) => void): void;
	off(event: string, callback: Function): void;
	emit<T extends object>(event: string, data: T): void;
}

export interface IBaseComponent {
	readonly container: HTMLElement;
	show(): void;
	hide(): void;
	toggle(): void;
}

export interface IModalComponent extends IBaseComponent {
	close(): void;
}

export interface IFormComponent extends IBaseComponent {
	validate(): boolean;
	clear(): void;
}
