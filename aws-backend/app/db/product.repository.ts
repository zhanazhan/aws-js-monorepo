import {Product} from "../model";
import {BaseRepository} from "./client";
import {UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {IdGenerator} from "../utils/id-generator";

export class ProductRepository extends BaseRepository<Product> {

  constructor() {
    super(process.env.PRODUCTS_TABLE);
  }

  async create(product: Product): Promise<Product> {
    const preparedProduct = {
      "id": product.id ?? IdGenerator.generateUUID(),
      "title": product.title,
      "description": product.description,
      "price": product.price.toString()
    };
    return (await this.insert(preparedProduct)).Item;
  }

  async update(product: Product): Promise<Product> {
    return (await this.updatePartial(new UpdateCommand({
      TableName: this.tableName,
      Key: {
        "id": product.id
      },
      UpdateExpression: "set title = :title, description = :description, price = :price",
      ExpressionAttributeValues: {
        ":title": product.title,
        ":description": product.description,
        ":price": product.price,
      },
      ReturnValues: "ALL_NEW",
    }))).Item;
  }

  async get(id: string) {
    return this.findOne({id});
  }
}
