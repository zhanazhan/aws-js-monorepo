import { ResponseVO } from '../model/vo/responseVo';

enum StatusCode {
  success = 200,
  not_found = 404,
  bad_request = 400,
  server_error = 500,
}

class Result {
  private statusCode: number;
  private code: number;
  private message: string;
  private data?: any;

  constructor(statusCode: number, code: number, message: string, data?: any) {
    this.statusCode = statusCode;
    this.code = code;
    this.message = message;
    this.data = data;
  }

  /**
   * Serverless: According to the API Gateway specs, the body content must be stringified
   */
  bodyToString () {
    return {
      statusCode: this.statusCode,
      headers: {
        'Access-Control-Allow-Origin': 'https://node-in-aws-web-bucket.s3.eu-west-1.amazonaws.com',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        code: this.code,
        message: this.message,
        data: this.data,
      }),
    };
  }
}

export class MessageUtil {
  static success(data: object, code = 200): ResponseVO {
    const result = new Result(StatusCode.success, code, 'success', data);

    return result.bodyToString();
  }

  static error(code: number = 1000, message: string) {
    const result = new Result(code === 404 ? StatusCode.not_found : StatusCode.bad_request, code, message);

    console.log(result.bodyToString());
    return result.bodyToString();
  }
}
