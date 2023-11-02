import {SQSEvent} from "aws-lambda";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import {ProductService} from "../service/product.service";
import {ProductRepository} from "../db/product.repository";
import {StockRepository} from "../db/stock.repository";
import {StockService} from "../service/stock.service";
import {ProductJson} from "../model";

const snsClient = new SNSClient({ region: "ca-central-1" });
export const catalogBatchProcess = async (event: SQSEvent): Promise<void> => {
  const productRepository = new ProductRepository();
  const stockRepository = new StockRepository()
  const service = new ProductService(productRepository, new StockService(stockRepository));
  console.log('SQS event:', event);

  for (const record of event.Records) {
    const item: ProductJson = JSON.parse(record.body);

    try {
      await service.createFromJson(item);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  }

  const message = `Product list has been successfully updated.`;
  const params = {
    Message: message,
    TopicArn: process.env.CREATE_PRODUCT_TOPIC_ARN
  };

  await snsClient.send(new PublishCommand(params));
};
