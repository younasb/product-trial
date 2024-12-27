import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User.entity';
import { Product } from './Product.entity';

@Entity()
export class Favorite {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
	user: User;

	@ManyToOne(() => Product, (product) => product.favorites, { onDelete: 'CASCADE' })
	product: Product;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
