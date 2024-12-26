import { type Repository, type EntityManager, type DeleteResult } from 'typeorm';
import { type User } from '../entity/User.entity';

export class AccountRepository {
	private readonly repository: Repository<User>;

	public constructor(repository: Repository<User>) {
		this.repository = repository;
	}

	public async save(user: User): Promise<User> {
		return await this.repository.save(user);
	}

	public async findById({ id }: { id: number }): Promise<User | null> {
		return await this.repository.createQueryBuilder('user').where('user.id = :id', { id }).getOne();
	}

	public async findOneBy<T extends keyof User>(criteria: { [P in T]?: User[P] }): Promise<User | null> {
		return await this.repository.findOne({ where: criteria });
	}

	public async findAll(): Promise<User[]> {
		return await this.repository.find();
	}

	public async delete(id: number): Promise<DeleteResult> {
		return await this.repository.delete(id);
	}

	public getManager(): EntityManager {
		return this.repository.manager;
	}
}
