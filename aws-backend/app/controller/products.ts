import { Context } from 'aws-lambda';
import { MessageUtil } from '../utils/message';
import { ProductService } from '../service/products';
import { CreateProductDTO } from '../model/dto/createProductDTO';
import {ProductRepository} from "../db/products";
import {IdGenerator} from "../utils/id-generator";

export class ProductsController extends ProductService {
  constructor (productRepository: ProductRepository) {
    super(productRepository);
  }

  /**
   * Create product
   * @param {*} event
   * @param context
   */
  async create (event: any, context?: Context) {
    console.log('functionName', context.functionName);
    const params: CreateProductDTO = JSON.parse(event.body);

    try {
      const result = await this.createProduct({
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
  async update (event: any) {
    const id: string = event.pathParameters.id;
    const body: object = JSON.parse(event.body);

    try {
      const result = await this.updateProduct(id, body);
      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);

      return MessageUtil.error(err.code, err.message);
    }
  }

  /**
   * Find product list
   */
  async find () {
    try {
      const result = await this.findProducts();

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
  async findOne (event: any, context: Context) {
    // The amount of memory allocated for the function
    console.log('memoryLimitInMB: ', context.memoryLimitInMB);

    const id: string = event.pathParameters.id;

    try {
      const result = await this.findOneProductById(id);

      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);

      return MessageUtil.error(err.code, err.message);
    }
  }

  /**
   * Delete product by id
   * @param event
   */
  async deleteOne (event: any) {
    const id: string = event.pathParameters.id;

    try {
      const result = await this.deleteOneProductById(id);

      if (result.deletedCount === 0) {
        return MessageUtil.error(1010, 'The data was not found! May have been deleted!');
      }

      return MessageUtil.success(result);
    } catch (err) {
      console.error(err);

      return MessageUtil.error(err.code, err.message);
    }
  }
}
