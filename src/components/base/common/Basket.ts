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
		}
	}
  set total(price: number) {
		this.setText(this._total, `${price} синапсов`);
	}
  
	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this._button.disabled = false;
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this._button.disabled = true;
		}
	}
}