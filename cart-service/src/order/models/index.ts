import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";

import { CartItem } from '../../cart/models';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  userId: string;
  @Column()
  cartId: string;
  @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true })
  items: CartItem[];
  @Column({ type: 'json', nullable: true })
  payment: {
    type: string,
    address?: any,
    creditCard?: any,
  };
  @Column({ type: 'json', nullable: true })
  delivery: {
    type: string,
    address: any,
  };
  @Column()
  comments: string;
  @Column()
  status: string;
  @Column()
  total: number;
}
