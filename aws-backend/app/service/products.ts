import {CreateProductDTO} from '../model/dto/createProductDTO';
import {Product} from '../model';
import {ProductRepository} from '../db/products';

export class ProductService {
    private productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Create product
     * @param params
     */
    protected async createProduct(params: CreateProductDTO): Promise<Product> {
        try {
            const result = await this.productRepository.create({
                id: params.id,
                title: params.title,
                description: params.description,
                price: params.price,
                count: params.count
            });
            console.log('product created');
            return result;
        } catch (err) {
            console.error(err);

            throw err;
        }
    }

    /**
     * Update a product by id
     * @param id
     * @param data
     */
    protected updateProduct(id: string, data: object) {
        return this.productRepository.findOneAndUpdate(
            {id},
            {$set: data},
            {new: true},
        );
    }

    /**
     * Find products
     */
    protected findProducts() {
        return this.productRepository.findAll();
    }

    /**
     * Query product by id
     * @param id
     */
    protected findOneProductById(id: string): Promise<Product> {
        return this.productRepository.findOne({id});
    }

    /**
     * Delete product by id
     * @param id
     */
    protected deleteOneProductById(id: string) {
        return this.productRepository.deleteOne({id});
    }
}
