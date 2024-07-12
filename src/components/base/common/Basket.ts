import { IBasket,  IEvents  } from '../../../types/index';
import { createElement } from '../../../utils/utils';
import { Component } from '../base/Components';

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(protected blockName: string, container: HTMLElement, protected events: IEvents) {
		super(container);

		this._button = container.querySelector(`.${blockName}__button`);
		this._total = container.querySelector(`.${blockName}__price`);
		this._list = container.querySelector(`.${blockName}__list`);

		if (this._button) {
			this._button.addEventListener('click', () => events.emit('basket:order'));
			this.toggleButton(true); 
			this.emptyBasket();
		}
	}
	
	set total(price: number) {
		this.setText(this._total, `${price} синапсов`);
	}
	
	toggleButton(state: boolean) {
		this.setDisabled(this._button, state);    
	} 
	
	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this.toggleButton(false);
		} else {
			this.toggleButton(true); 
			this.emptyBasket();
		} 
	}

	emptyBasket() {
		this._list.replaceChildren(
			createElement<HTMLParagraphElement>('p', {
				textContent: 'Корзина пуста'})
		);
	}
} 