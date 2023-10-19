import {Product, ProductJson, Stock} from "../model";
import {v4 as uuidv4} from 'uuid';

const PRODUCTS: ProductJson[] = [
  {
    "id": "1",
    "title": "Burberry Classic Trench Coat",
    "description": "Iconic trench coat by Burberry, made from premium materials.",
    "price": 1499.99,
    "count": 10
  },
  {
    "id": "2",
    "title": "Burberry Plaid Scarf",
    "description": "Luxurious plaid scarf in Burberry's signature pattern.",
    "price": 299.99,
    "count": 15
  },
  {
    "id": "3",
    "title": "Burberry Leather Wallet",
    "description": "High-quality leather wallet with Burberry branding.",
    "price": 499.99,
    "count": 20
  },
  {
    "id": "4",
    "title": "Burberry Checkered Shirt",
    "description": "Classic checkered shirt by Burberry, perfect for any occasion.",
    "price": 399.99,
    "count": 12
  },
  {
    "id": "5",
    "title": "Burberry Perfume - My Burberry",
    "description": "Elegant fragrance for women with notes of rose and patchouli.",
    "price": 89.99,
    "count": 25
  },
  {
    "id": "6",
    "title": "Burberry Men's Polo Shirt",
    "description": "Stylish polo shirt for men with the Burberry logo.",
    "price": 249.99,
    "count": 18
  },
  {
    "id": "7",
    "title": "Burberry Nova Check Tote Bag",
    "description": "Fashionable tote bag featuring the iconic Nova check pattern.",
    "price": 799.99,
    "count": 8
  },
  {
    "id": "8",
    "title": "Burberry Women's Watch",
    "description": "Elegant women's watch with a stainless steel band.",
    "price": 1199.99,
    "count": 14
  },
  {
    "id": "9",
    "title": "Burberry Men's Belt",
    "description": "High-quality leather belt for men with Burberry's distinctive style.",
    "price": 349.99,
    "count": 22
  },
  {
    "id": "10",
    "title": "Burberry Cashmere Sweater",
    "description": "Luxurious cashmere sweater by Burberry for ultimate comfort.",
    "price": 599.99,
    "count": 11
  },
  {
    "id": "11",
    "title": "Burberry Crossbody Bag",
    "description": "Chic crossbody bag with a detachable shoulder strap.",
    "price": 699.99,
    "count": 7
  },
  {
    "id": "12",
    "title": "Burberry Aviator Sunglasses",
    "description": "Stylish aviator sunglasses with Burberry branding.",
    "price": 299.99,
    "count": 16
  },
  {
    "id": "13",
    "title": "Burberry Cashmere Scarf",
    "description": "Warm and cozy cashmere scarf in Burberry's iconic plaid pattern.",
    "price": 449.99,
    "count": 9
  },
  {
    "id": "14",
    "title": "Burberry Leather Jacket",
    "description": "Classic leather jacket with a modern twist from Burberry.",
    "price": 1799.99,
    "count": 6
  },
  {
    "id": "15",
    "title": "Burberry Chelsea Boots",
    "description": "Elegant Chelsea boots made with premium materials.",
    "price": 799.99,
    "count": 13
  },
  {
    "id": "16",
    "title": "Burberry Checkered Dress",
    "description": "Sophisticated checkered dress for women by Burberry.",
    "price": 649.99,
    "count": 10
  },
  {
    "id": "17",
    "title": "Burberry Leather Briefcase",
    "description": "Professional leather briefcase with multiple compartments.",
    "price": 999.99,
    "count": 5
  },
  {
    "id": "18",
    "title": "Burberry Men's Cologne - Burberry London",
    "description": "Masculine fragrance",
    "price": 79.99,
    "count": 30
  },
  {
    "id": "19",
    "title": "Burberry Knit Sweater",
    "description": "Cozy knit sweater in classic Burberry style.",
    "price": 349.99,
    "count": 18
  },
  {
    "id": "20",
    "title": "Burberry Silk Scarf",
    "description": "Elegant silk scarf with Burberry's signature pattern.",
    "price": 199.99,
    "count": 20
  }
];

export class ProductSeed {

  public getProducts(): ProductJson[] {
    return PRODUCTS;
  }
  public getDataItem(item: ProductJson): { product: Product, stock: Stock } {
    const {title, description, price, count} = item;
    const product_id = uuidv4();
    return {
      product: {
        id: product_id, title, description, price
      },
      stock: {product_id, count}
    };
  }
}
