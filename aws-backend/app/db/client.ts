import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
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
import {v4 as uuidv4} from 'uuid';
import {GetCommandOutput} from "@aws-sdk/lib-dynamodb/dist-types/commands/GetCommand";
import {PutCommandOutput} from "@aws-sdk/lib-dynamodb/dist-types/commands/PutCommand";
import {QueryCommandOutput} from "@aws-sdk/lib-dynamodb/dist-types/commands/QueryCommand";
import {ScanCommandOutput} from "@aws-sdk/lib-dynamodb/dist-types/commands/ScanCommand";
import {UpdateCommandOutput} from "@aws-sdk/lib-dynamodb/dist-types/commands/UpdateCommand";
import {DeleteCommandOutput} from "@aws-sdk/lib-dynamodb/dist-types/commands/DeleteCommand";
import {BatchWriteCommandOutput} from "@aws-sdk/lib-dynamodb/dist-types/commands/BatchWriteCommand";

export abstract class BaseRepository {
  client = new DynamoDBClient({});
  dbClient = DynamoDBDocumentClient.from(this.client);
  readonly tableName;

  protected constructor(tableName) {
    this.tableName = tableName;
  }

  protected id(): string {
    return uuidv4();
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

  private async execute(command): Promise<any> {
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
      Key: {
        id: { S: id },
      },
    }));
  }

  async findOneByKey(param): Promise<GetCommandOutput> {
    return this.execute(new GetCommand({
      TableName: this.tableName,
      Key: param,
    }));
  }

  async findById(id: string): Promise<GetCommandOutput> {
    return this.execute(new GetCommand({
      TableName: this.tableName,
      Key: {
        "id": { S: id }
      },
    }));
  }

  async insert(updateObject): Promise<PutCommandOutput> {
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
      Item: updateObject,
    }));
  }

  async query(query): Promise<QueryCommandOutput> {
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

  async scan(query): Promise<ScanCommandOutput> {
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


  async update(query): Promise<UpdateCommandOutput> {
    /*
    {
      TableName: "Dogs",
      Key: {
        Breed: "Labrador",
      },
      UpdateExpression: "set Color = :color",
      ExpressionAttributeValues: {
        ":color": "black",
      },
      ReturnValues: "ALL_NEW",
    }
    */
    return this.execute(new UpdateCommand(Object.assign({
      TableName: this.tableName,
      ReturnValues: "ALL_NEW",
    }, query)));
  }

}

