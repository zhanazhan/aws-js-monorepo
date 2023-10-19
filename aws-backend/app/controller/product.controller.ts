import {Context} from 'aws-lambda';
import {MessageUtil} from '../utils/message';
import {CreateProductDTO} from '../model/dto/createProductDTO';
import {ProductRepository} from "../db/product.repository";
import {IdGenerator} from "../utils/id-generator";
import {StockRepository} from "../db/stock.repository";
import {ProductService} from "../service/product.service";
import {StockService} from "../service/stock.service";
import {Product} from "../model";

export class ProductController {
  service: ProductService;

  constructor() {
    const productRepository = new ProductRepository();
    const stockRepository = new StockRepository()
    this.service = new ProductService(productRepository, new StockService(stockRepository));
  }

  /**
   * Create product
   * @param {*} event
   * @param context
   */
  async create(event: any, context?: Context) {
    console.log('functionName', context.functionName);
    const params: CreateProductDTO = JSON.parse(event.body);

    try {
      const result = await this.service.createFromJson({
        id: IdGenerator.generateUUID(),
        title: params.title,
        description: params.description,
        price: params.price,
        count: params.count
      });

      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);

      return MessageUtil.error(err.code, err.message);
    }
  }

  /**
   * Update a product by id
   * @param event
   */
  async update(event: any) {
    const id: string = event.pathParameters.id;
    const body: Product = JSON.parse(event.body);
    try {
      if (id !== body.id) {
        throw {code: 401, message: `Bad Request`};
      }
      const result = await this.service.update(body);
      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);

      return MessageUtil.error(err.code, err.message);
    }
  }

  /**
   * Find product list
   */
  async find() {
    try {
      const result = await this.service.findAllJson();
      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);

      return MessageUtil.error(err.code, err.message);
    }
  }

  /**
   * Query product by id
   * @param event
   * @param context
   */
  async findOne(event: any, context: Context) {
    console.log('functionName', context.functionName);
    try {
      if (!event.pathParameters?.id) {
        throw {code: 400, message: `Provide ID of the requested resource`};
      }

      const id: string = event.pathParameters.id;

      console.log(`request item id: ${id}`);
      const result = await this.service.findOneJson(id);
      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);

      return MessageUtil.error(err.code || 404, err.message);
    }
  }

  /**
   * Delete product by id
   * @param event
   */
  async deleteOne(event: any) {
    const id: string = event.pathParameters.id;

    try {
      await this.service.deleteOneById(id);
      return MessageUtil.success({product: `product with ${id} is deleted`});
    } catch (err) {
      console.error(err);

      return MessageUtil.error(err.code || "401", err.message);
    }
  }
}
