import { type Repository, type EntityManager, type DeleteResult } from 'typeorm';
import { type Product } from '../entity/Product.entity';

export class ProductRepository {
	private readonly repository: Repository<Product>;

	public constructor(repository: Repository<Product>) {
		this.repository = repository;
	}

	public async save(product: Product): Promise<Product> {
		return await this.repository.save(product);
	}

	public async findById({ id }: { id: number }): Promise<Product | null> {
		return await this.repository.createQueryBuilder('product').where('product.id = :id', { id }).getOne();
	}

	public async findAll(): Promise<Product[]> {
		return await this.repository.find();
	}

	public async delete(id: number): Promise<DeleteResult> {
		return await this.repository.delete(id);
	}

	public getManager(): EntityManager {
		return this.repository.manager;
	}
}
