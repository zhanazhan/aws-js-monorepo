import {APIGatewayProxyHandler, SQSHandler} from 'aws-lambda';
import {SQS} from "@aws-sdk/client-sqs";

const sqs = new SQS();

export const queueUrl = (context) => {
    const region = context.invokedFunctionArn.split(':')[3];
    const accountId = context.invokedFunctionArn.split(':')[4];
    const queueName: string = process.env.SQS_QUEUE;
    return `https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`;
}

export const sqsSend = async (queueUrl: string, body: string) => {
    await sqs.sendMessage({
        QueueUrl: queueUrl,
        MessageBody: body,
        MessageAttributes: {
            AttributeNameHere: {
                StringValue: 'Products',
                DataType: 'String',
            },
        },
    });
}

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

    try {
        await sqsSend(queueUrl(context), JSON.stringify(event.body));
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

export const receiver: SQSHandler = async (event, content) => {
    try {
        for (const record of event.Records) {
            await sqsSend(queueUrl(content), JSON.stringify(record.body));
        }
    } catch (error) {
        console.log(error);
    }
};


export const csvSender = async (data, content) => {
    try {
        await sqsSend(queueUrl(content), JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
};
