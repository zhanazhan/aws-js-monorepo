import {StockRepository} from "../db/stock.repository";
import {Stock} from "../model";
import {BaseService} from "./base.service";
import {DeleteCommand, GetCommand} from "@aws-sdk/lib-dynamodb";

export class StockService implements BaseService<Stock> {
  private repository: StockRepository;

  constructor(repository: StockRepository) {
    this.repository = repository;
  }

  get table() {
    return this.repository.tableName;
  }

  /**
   * Create stock
   * @param stock
   */
  async create(stock: Stock): Promise<Stock> {
    try {
      const result = await this.repository.create(stock);
      console.log('stock created');
      return result;
    } catch (err) {
      console.error(err);

      throw err;
    }
  }

  /**
   * Update a stock
   * @param data
   */
  async update(data: Stock) {
    return this.repository.update(data);
  }

  /**
   * Find stocks
   */
  async findAll() {
    return this.repository.findAll();
  }

  /**
   * Query stock by id
   * @param id
   */
  async findOneById(id: string): Promise<Stock> {
    return this.repository.execute(new GetCommand({
      TableName: this.table,
      Key: {
        product_id: { S: id }
      },
    }));
  }

  /**
   * Delete stock by id
   * @param id
   */
  async deleteOneById(id: string) {
    await this.repository.execute(new DeleteCommand({
      TableName: this.table,
      Key: {
        product_id: { S: id },
      },
    }));
  }
}
