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
    this.productSeed.getProducts()
      .forEach((item) => {
        this.createFromJson(item);
      });
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
  async update(data: Product) {
    return this.repository.update(data);
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
    const stocks = await this.stockService.findAll();
    return (await this.repository.findAll())
      .map((item) => {
        const stock = stocks.find((s) => s.product_id = item.id);
        return {
          ...item,
          count: stock.count
        }
      });
  }

  async findOneJson(id: string): Promise<ProductJson> {
    const item = await this.repository.findOne({id});
    const stock = await this.stockService.findOneById(id);
    return {
      ...item,
      count: stock.count
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
