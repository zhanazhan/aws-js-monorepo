import {Stock} from "../model";
import {BaseRepository} from "./client";

export class StockRepository extends BaseRepository {

  constructor() {
    super("stocks");
  }

  async create(product: Stock) {
    return product;
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
    const product = PRODUCTS.filter((item) => item.id === param.id);
    if (!product || product.length === 0) {
      throw {code: 404, message: `Product not found`};
    }
    return product[0];
  }

  async deleteOne(param: { id: string }) {
    // PRODUCTS = PRODUCTS.filter((item) => item.id !== param.id);
    console.log('remove product from db', param.id);
    return {
      deletedCount: 1
    }
  }
}
