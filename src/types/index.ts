export interface IProduct {
  id: string; 
  title: string; 
  image: string; 
  price: number | null; 
  description: string;  
  inBasket: boolean;
}

export enum CategoryProduct {
  soft = 'софт-скил',
  hard = 'хард-скил',
  additional = 'дополнительное',
  other = 'другое',
  button = 'кнопка',
}

export interface IEvents {
  on<T extends object>(event: EventName, callback: (data: T) => void): void;
  emit<T extends object>(event: string, data?: T): void;
  trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
  eventName: string,
  data: unknown
};

export interface ApiResponse {
	items: IProduct[];
}

export interface IBasket {
  total: number;
  items: IProduct[];
}

export interface IPayment {
  payment: PaymentMethods;
  address: string;
}

export interface IContacts {
  email: string;
  phone: string;
}

export interface IForm {
	valid: boolean;
	errors: {};
}

export interface IFormValidation {
  valid: boolean;
	errors: Partial<Record<keyof IOrder, string>>;
}

export type PaymentMethods = 'онлайн' | 'при получении';

export type IOrder = IBasket & IPayment & IContacts & IFormValidation;

export interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface IModal {
  content: HTMLElement;
}

export interface ISuccess {
	total: number;
}

export interface ISuccessActions {
	onClick: () => void;
}