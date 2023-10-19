import { Handler, Context } from 'aws-lambda';
import dotenv from 'dotenv';
import path from 'path';

const dotenvPath = path.join(__dirname, '../', `config/.env.${process.env.NODE_ENV}`);
dotenv.config({
  path: dotenvPath,
});

import { ProductController } from './controller/product.controller';
const productsController = new ProductController();

export const create: Handler = (event: any, context: Context) => {
  return productsController.create(event, context);
};

export const update: Handler = (event: any) => productsController.update(event);

export const find: Handler = () => productsController.find();

export const findOne: Handler = (event: any, context: Context) => {
  return productsController.findOne(event, context);
};

export const deleteOne: Handler = (event: any) => productsController.deleteOne(event);
