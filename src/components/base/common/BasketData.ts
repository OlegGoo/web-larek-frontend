import { IProduct } from '../../../types/index';
import { Model } from '../base/Model';

export class BasketData extends Model<IProduct> {
	products: IProduct[] = [];
	total: number | null;

	private getTotalPrice() {
		return this.products.reduce((sum, next) => sum + next.price, 0);
	}
	
	addItem(product: IProduct) {
		product.inBasket = true;
		this.products.push(product);
		this.total = this.getTotalPrice();
	}

	deleteItem(product: IProduct) {
		product.inBasket = false;
		this.products = this.products.filter((item) => item.id !== product.id);
		this.total = this.getTotalPrice();
	}

	clearBasket() {
		this.products = [];
		this.total = this.getTotalPrice();
	}
}