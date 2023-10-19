import {Stock} from "../model";
import {BaseRepository} from "./client";
import {UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {IdGenerator} from "../utils/id-generator";

export class StockRepository extends BaseRepository<Stock> {

  constructor() {
    super(process.env.STOCKS_TABLE);
  }

  async create(item: Stock) {
    const preparedProduct = {
      "id": item.id ?? IdGenerator.generateUUID(),
      "product_id": item.product_id,
      "count": item.count.toString()
    };
    return (await this.insert(preparedProduct)).Item;
  }

  async update(stock: Stock): Promise<Stock> {
    return (await this.updatePartial(new UpdateCommand({
      TableName: this.tableName,
      Key: {
        product_id: stock.product_id
      },
      UpdateExpression: "set count = :count",
      ExpressionAttributeValues: {
        ":count": stock.count
      },
      ReturnValues: "ALL_NEW",
    }))).Item;
  }

  async get(id: string) {
    return this.findOne({id});
  }
}
