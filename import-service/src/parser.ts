import {Responses} from './common/api.response';
import S3 from './common/s3';
import {parseStream} from "@fast-csv/parse";
import {Readable} from "stream";
import {csvSender} from "./sqs";

export const handler = async (event, context) => {
    console.log('event', event);

    const {Records} = event;

    try {
        const promArray = Records.map((record) => {
            const bucket = record.s3.bucket.name;
            const file = record.s3.object.key;
            return processFile({bucket, file}, context);
        });

        await Promise.all(promArray);

        return Responses._200({message: 'file processing succeeded'});
    } catch (error) {
        console.error(error);
        return Responses._400({
            message: error.message || 'failed to process file',
        });
    }
};

const processFile = async ({bucket, file}, context) => {
    const s3file = await S3.get(bucket, file);
    const readableStream = new Readable().wrap(s3file.Body as any);

    return new Promise((resolve, reject) => {
        parseStream(readableStream, {
            headers: true
        }).on('csv data', async (data) => {
            console.log(data);
            await csvSender(data, context);
        }).on('error', (error) => {
            console.error(error);
            reject(error);
        }).on('end', (rows) => {
            console.log(`Parsed ${rows} rows`);
            resolve(rows);
        });
    });
};
