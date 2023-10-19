import {DeleteItemCommand, DynamoDBClient, GetItemCommand} from "@aws-sdk/client-dynamodb";
import {
  BatchWriteCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand
} from "@aws-sdk/lib-dynamodb";
import {GetCommandOutput} from "@aws-sdk/lib-dynamodb";
import {PutCommandOutput} from "@aws-sdk/lib-dynamodb";
import {QueryCommandOutput} from "@aws-sdk/lib-dynamodb";
import {ScanCommandOutput} from "@aws-sdk/lib-dynamodb";
import {UpdateCommandOutput} from "@aws-sdk/lib-dynamodb";
import {DeleteCommandOutput} from "@aws-sdk/lib-dynamodb";
import {BatchWriteCommandOutput} from "@aws-sdk/lib-dynamodb";
import {unmarshall} from "@aws-sdk/util-dynamodb";

export abstract class BaseRepository<T> {
  client = new DynamoDBClient({});
  dbClient = DynamoDBDocumentClient.from(this.client);
  readonly tableName;

  protected constructor(tableName) {
    this.tableName = tableName;
  }

  async batchWrite(insertItems): Promise<BatchWriteCommandOutput> {
    /*
    {
      RequestItems: {
        // Each key in this object is the name of a table. This example refers
        // to a Coffees table.
        Coffees: [
          // Each entry in Coffees is an object that defines either a PutRequest or DeleteRequest.
          {
            // Each PutRequest object defines one item to be inserted into the table.
            PutRequest: {
              // The keys of Item are attribute names. Each attribute value is an object with a data type and value.
              // For more information about data types,
              // see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes
              Item: {
                Name: { S: "Donkey Kick" },
                Process: { S: "Wet-Hulled" },
                Flavors: { SS: ["Earth", "Syrup", "Spice"] },
              },
            },
          },
          {
            PutRequest: {
              Item: {
                Name: { S: "Flora Ethiopia" },
                Process: { S: "Washed" },
                Flavors: { SS: ["Stone Fruit", "Toasted Almond", "Delicate"] },
              },
            },
          },
        ],
      },
    }
     */
    return this.execute(new BatchWriteCommand({
      RequestItems: insertItems
    }));
  }

  async execute(command): Promise<any> {
    return this.dbClient.send(command);
  }

  async delete(keyObject): Promise<DeleteCommandOutput> {
    /*
    {
      TableName: "Sodas",
      Key: {
        Flavor: "Cola",
      },
    }
     */
    return this.execute(new DeleteCommand({
      TableName: this.tableName,
      Key: keyObject,
    }));
  }

  async deleteById(id: string): Promise<DeleteCommandOutput> {
    return this.execute(new DeleteItemCommand({
      TableName: this.tableName,
      Key: {
        id: {S: id},
      },
    }));
  }

  protected async findOneByKey(param): Promise<GetCommandOutput> {
    return this.execute(new GetCommand({
      TableName: this.tableName,
      Key: param,
    }));
  }

  protected async findById(id: string): Promise<GetCommandOutput> {
    const query = {
      TableName: this.tableName,
      Key: {
        "id": {S: id}
      },
    };
    console.log("db query", query);
    return this.execute(new GetItemCommand(query));
  }

  protected async insert(newItem): Promise<PutCommandOutput & { Item: T }> {
    /*
    {
      TableName: "HappyAnimals",
      Item: {
        CommonName: "Shiba Inu",
      },
    })
     */
    return this.execute(new PutCommand({
      TableName: this.tableName,
      Item: newItem,
    }));
  }

  protected async query(query): Promise<QueryCommandOutput> {
    /*
    {
      TableName: "CoffeeCrop",
      KeyConditionExpression:
        "OriginCountry = :originCountry AND RoastDate > :roastDate",
      ExpressionAttributeValues: {
        ":originCountry": "Ethiopia",
        ":roastDate": "2023-05-01",
      },
      ConsistentRead: true,
    }
     */
    const extendedQuery = new QueryCommand(Object.assign({
      TableName: this.tableName,
      ConsistentRead: true,
    }, query));
    return this.query(extendedQuery);
  }

  protected async scan(query): Promise<ScanCommandOutput> {
    /*
    {
      ProjectionExpression: "#Name, Color, AvgLifeSpan",
      ExpressionAttributeNames: { "#Name": "Name" },
      TableName: "Birds",
    }
    */
    return this.execute(new ScanCommand(Object.assign({
      TableName: this.tableName,
    }, query)));
  }


  protected async updatePartial(query: UpdateCommand): Promise<UpdateCommandOutput & { Item: T }> {
    return this.execute(query);
  }

  async findOne(param: { id: string }): Promise<T> {
    const item = await this.findById(param.id);
    if (!item || !item.Item) {
      throw {code: 404, message: `${this.tableName} not found`};
    }
    return unmarshall(item.Item) as T;
  }

  async findAll(): Promise<T[]> {
    return (await this.scan({})).Items as T[];
  }

}

