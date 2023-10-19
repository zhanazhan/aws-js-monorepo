export interface BaseService<T> {
  create(item: T): Promise<T>;

  update(data: T): Promise<T>;

  findAll(): Promise<T[]>;

  findOneById(id: string): Promise<T>;

  deleteOneById(id: string): Promise<void>;
}
