import { IEvents, IPayment, PaymentMethods } from '../../../types/index';
import { ensureElement } from '../../../utils/utils';
import { Form } from './Form';

export class FormPayment extends Form<IPayment> {
	protected _card: HTMLButtonElement;
	protected _cash: HTMLButtonElement;
	protected _address: HTMLInputElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._address = ensureElement<HTMLInputElement>('.form__input[name=address]', container);
		this._address.addEventListener('click', () => {
			this.onInputChange('address', this._address.value)
		})

		this._card = ensureElement<HTMLButtonElement>('.button_alt[name=card]', container);
		this._card.addEventListener('click', () => {
			this.payment = 'онлайн';
			this.onInputChange('payment', 'онлайн');
		});

		this._cash = ensureElement<HTMLButtonElement>('.button_alt[name=cash]', container);
		this._cash.addEventListener('click', () => {
			this.payment = 'при получении';
			this.onInputChange('payment', 'при получении');
		});
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value = value;
	}

	set payment(value: PaymentMethods) {
		this._card.classList.toggle('button_alt-active', value === 'онлайн');
		this._cash.classList.toggle('button_alt-active', value === 'при получении');
	}
}