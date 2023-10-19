import {Product} from "../model";
import {BaseRepository} from "./client";

export class ProductRepository extends BaseRepository {

  constructor() {
    super("products");
  }

  async create(product: Product) {
    product.id = this.id();
    const preparedProduct = {
      id: { S: product.id },
      title: { S: product.title },
      description: { S: product.description },
      price: { N: product.price.toString() }
    };
    return this.insert(preparedProduct);
  }

  async findOneAndUpdate(query: { id: string }, update: { $set: object }, upsert: { new: boolean }) {
    console.log({query, update, upsert});
    const product = await this.findOne(query);
    console.log('update product');
    return product;
  }

  async findAll() {
    return this.scan({});
  }

  async findOne(param: { id: string }): Promise<Product> {
    const product = await this.findById(param.id);
    if (!product || !product.Item) {
      throw {code: 404, message: `Product not found`};
    }
    return product.Item as Product;
  }

  async deleteOne(param: { id: string }) {
    return this.deleteById(param.id);
  }
}
