import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { Cart } from '../models';
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository} from "typeorm";
import {InsertResult} from "typeorm/query-builder/result/InsertResult";
import {UpdateResult} from "typeorm/query-builder/result/UpdateResult";

@Injectable()
export class CartService {

  constructor(@InjectRepository(Cart)
              private readonly repository: Repository<Cart>) {
  }


  findByUserId(userId: string): Promise<Cart> {
    return this.repository.findOneBy({ userId });
  }

  createByUserId(userId: string) {
    const id = v4(v4());
    const userCart = {
      id,
      userId,
      items: [],
    };
    return this.repository.save(userCart);
  }

  findOrCreateByUserId(userId: string): Promise<Cart> {
    const userCart = this.findByUserId(userId);

    if (userCart) {
      return userCart;
    }

    return this.createByUserId(userId);
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const { id, ...rest } = await this.findOrCreateByUserId(userId);

    const updatedCart = {
      id,
      userId,
      items: [ ...items ],
    }

    await this.repository.update({userId: userId}, updatedCart);
    return this.findOrCreateByUserId(userId);
  }

  removeByUserId(userId): Promise<DeleteResult> {
    return this.repository.delete({userId});
  }

}
