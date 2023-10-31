import { APIGatewayProxyHandler } from 'aws-lambda';
import {SQS} from "@aws-sdk/client-sqs";
import { SQSHandler, SQSMessageAttributes } from 'aws-lambda';

const sqs = new SQS();

export const sender: APIGatewayProxyHandler = async (event, context) => {
    let statusCode: number = 200;
    let message: string;

    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'No body was found',
            }),
        };
    }

    const region = context.invokedFunctionArn.split(':')[3];
    const accountId = context.invokedFunctionArn.split(':')[4];
    const queueName: string = process.env.SQS_QUEUE;

    const queueUrl: string = `https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`

    try {
        await sqs.sendMessage({
            QueueUrl: queueUrl,
            MessageBody: event.body,
            MessageAttributes: {
                AttributeNameHere: {
                    StringValue: 'Products',
                    DataType: 'String',
                },
            },
        });

        message = 'Message placed in the Queue!';

    } catch (error) {
        console.log(error);
        message = error;
        statusCode = 500;
    }

    return {
        statusCode,
        body: JSON.stringify({
            message,
        }),
    };
};

export const receiver: SQSHandler = async (event) => {
    try {
        for (const record of event.Records) {
            const messageAttributes: SQSMessageAttributes = record.messageAttributes;
            console.log('Message Attributtes -->  ', messageAttributes.AttributeNameHere.stringValue);
            console.log('Message Body -->  ', record.body);
            // Do something
        }
    } catch (error) {
        console.log(error);
    }
};
