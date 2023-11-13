import {Responses} from './common/api.response';
import S3 from './common/s3';
import {getBoundary, Parse} from 'parse-multipart';
import {v4 as uuid} from 'uuid';

const allowedMimeTypes = ['text/csv'];

export const handler = async (event) => {
    console.log('event', event);
    // const { fileTypeFromBuffer } = await import('file-type');
    try {
        const boundary = getBoundary(event.headers['Content-Type']);
        const bufferedBody = new Buffer(event.body,'utf-8');
        const parts = Parse(bufferedBody, boundary);

        const urls = [];
        console.log('event data', boundary, parts.length);
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            // { filename: 'A.txt', type: 'text/plain', data: <Buffer 41 41 41 41 42 42 42 42> }

            if (!part || !part.data || !part.type) {
                return Responses._400({message: 'incorrect body'});
            }

            if (allowedMimeTypes.includes(part.type) === false) {
                return Responses._400({message: 'incorrect mime type'});
            }

            const detectedExt = 'csv';
            const name = uuid();
            const key = `uploaded/${name}.${detectedExt}`;

            console.log(
                `writing file to bucket ${process.env.IMAGE_UPLOAD_BUCKET} with key ${key}`
            );

            await S3.write(process.env.IMAGE_UPLOAD_BUCKET, key, part.data, part.type);

            // const url = `https://${process.env.IMAGE_UPLOAD_BUCKET}.s3.${process.env.REGION}.amazonaws.com/${key}`;

            const url = await S3.getPreSignedURL(
                process.env.IMAGE_UPLOAD_BUCKET,
                key,
                30
            );

            urls.push({filename: part.filename, url});
        }
        if (urls.length === 0) {
            throw {message: "no files detected"};
        }
        return Responses._200({
            message: 'file uploaded',
            urls
        });
    } catch (error) {
        // error handling
        console.error(error);
        return Responses._500({message: error.message || 'failed to upload file(s)'});
    }
};
