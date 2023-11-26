import {Column, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";

export class Product {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  price: number;
}


export class CartItem {
  product: Product;
  @Column()
  count: number;
  @ManyToOne(() => Cart, cart => cart.items)
  cart: Cart;
}

export class Cart {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  userId: string;
  @OneToMany(() => CartItem, cartItem => cartItem.cart, { cascade: true })
  items: CartItem[];
}
