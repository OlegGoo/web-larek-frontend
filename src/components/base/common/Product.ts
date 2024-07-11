import { IProduct } from '../../../types/index';
import { Model } from '../base/Model';
export class Product extends Model<IProduct[]> {
	products: IProduct[] = [];

	getProducts(items: IProduct[]) {
		items.map((item) => this.products.push(item));
		this.emitChanges('items:changed', { products: this.products });
	}
}