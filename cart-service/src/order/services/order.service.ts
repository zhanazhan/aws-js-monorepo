import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { Order } from '../models';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UpdateResult} from "typeorm/query-builder/result/UpdateResult";

@Injectable()
export class OrderService {

  constructor(@InjectRepository(Order)
              private readonly repository: Repository<Order>) {
  }

  findById(orderId: string): Promise<Order | null> {
    return this.repository.findOneBy({id: orderId});
  }

  create(data: any): Promise<Order> {
    const id = v4(v4())
    const order = {
      ...data,
      id,
      status: 'PROCESSING',
    };

    return this.repository.save(order);
  }

  update(orderId, data): Promise<UpdateResult> {
    return this.repository.update({id: orderId}, data);
  }
}
