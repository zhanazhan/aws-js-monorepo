import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { User } from '../models';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User)
              private readonly userRepository: Repository<User>) {
  }

  findOne(userId: string): Promise<User | null> {
    return this.userRepository.findOneBy({id: userId});
  }

  createOne({ name, password }: Partial<User>): Promise<User> {
    const id = v4(v4());
    const newUser = { id: name || id, name, password };
    return this.userRepository.save(newUser);
  }

}
