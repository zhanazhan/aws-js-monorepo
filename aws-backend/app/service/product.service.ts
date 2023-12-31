import {Product, ProductJson} from '../model';
import {ProductRepository} from '../db/product.repository';
import {ProductSeed} from "../db/product.seed";
import {BaseService} from "./base.service";
import {StockService} from "./stock.service";

export class ProductService implements BaseService<Product> {
  private repository: ProductRepository;
  private stockService: StockService;
  private productSeed = new ProductSeed();

  constructor(repository: ProductRepository, stockService: StockService) {
    this.repository = repository;
    this.stockService = stockService;
  }

  async seedData(): Promise<void> {
    const products = this.productSeed.getProducts();
    for (let i = 0, len = products.length;  i < len; i++) {
      await this.createFromJson(products[i]);
    }
  }

  /**
   * Create product
   * @param item
   */
  async createFromJson(item: ProductJson): Promise<Product> {
    try {
      const {product, stock} = this.productSeed.getDataItem(item);
      const result = await this.repository.create(product);
      await this.stockService.create(stock);
      console.log('product and stock created');
      return result;
    } catch (err) {
      console.error(err);

      throw err;
    }
  }

  /**
   * Create product
   * @param item
   */
  async create(item: Product): Promise<Product> {
    try {
      const result = await this.repository.create(item);
      console.log('product and stock created');
      return result;
    } catch (err) {
      console.error(err);

      throw err;
    }
  }

  /**
   * Update a product
   * @param data
   */
  async update(data: ProductJson) {
    const {product, stock} = this.productSeed.getDataItem(data, true);
    const updatedProduct = this.repository.update(product);
    console.log("updatedProduct", updatedProduct);
    await this.stockService.update(stock);
    return updatedProduct;
  }

  /**
   * Find products
   */
  async findAll() {
    return this.repository.findAll();
  }

  /**
   * Find products
   */
  async findAllJson(): Promise<ProductJson[]> {
    const products = (await this.repository.findAll());
    if (products.length === 0) {
      await this.seedData();
    }
    const stocks = await this.stockService.findAll();
    console.log({products, stocks});
    return (await this.repository.findAll())
      .map((item) => {
        const stock = stocks.find((s) => s.product_id === item.id);
        return {
          ...item,
          count: stock?.count || 0
        }
      });
  }

  async findOneJson(id: string): Promise<ProductJson> {
    const item = await this.findOneById(id);
    const stock = await this.stockService.findOneById(id);
    console.log({item, stock});
    return {
      ...item,
      count: stock?.count || 0
    }
  }

  /**
   * Query product by id
   * @param id
   */
  async findOneById(id: string): Promise<Product> {
    return this.repository.findOne({id});
  }

  /**
   * Delete product by id
   * @param id
   */
  async deleteOneById(id: string): Promise<void> {
    await this.repository.deleteById(id);
    await this.stockService.deleteOneById(id);
  }
}
