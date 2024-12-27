import { type Repository } from 'typeorm';
import { type Favorite } from '../entity/Favorite.entity';

export class FavoriteRepository {
	private readonly repository: Repository<Favorite>;

	public constructor(repository: Repository<Favorite>) {
		this.repository = repository;
	}

	async findAll(): Promise<Favorite[]> {
		return await this.repository.find();
	}

	async findFavoritesByUser(userId: number): Promise<Favorite[]> {
		return await this.repository
			.createQueryBuilder('favorite')
			.select(['favorite.id as id', 'favorite.userId', 'favorite.productId', 'product.name AS productName'])
			.innerJoin('favorite.user', 'user')
			.innerJoin('favorite.product', 'product')
			.where('user.id = :userId', { userId })
			.getRawMany();
	}

	async isProductFavoriteByUser(userId: number, productId: number): Promise<Favorite | null> {
		return await this.repository.findOne({
			where: { user: { id: userId }, product: { id: productId } }
		});
	}

	async addFavorite(userId: number, productId: number): Promise<Favorite> {
		const favorite = this.repository.create({
			user: { id: userId },
			product: { id: productId }
		});
		return await this.repository.save(favorite);
	}

	async removeFavorite(favoriteId: number): Promise<void> {
		await this.repository.delete(favoriteId);
	}
}
