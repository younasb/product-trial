import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Favorite } from './Favorite.entity';

@Entity()
export class Product {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	code: string;

	@Column()
	name: string;

	@Column({ nullable: true })
	description: string;

	@Column({ nullable: true })
	image: string;

	@Column()
	category: string;

	@Column('decimal', { precision: 10, scale: 2 })
	price: number;

	@Column()
	quantity: number;

	@Column({ nullable: true })
	internalReference: string;

	@Column()
	shellId: number;

	@Column({
		type: 'enum',
		enum: ['INSTOCK', 'LOWSTOCK', 'OUTOFSTOCK'],
		default: 'INSTOCK'
	})
	inventoryStatus: 'INSTOCK' | 'LOWSTOCK' | 'OUTOFSTOCK';

	@Column('float', { nullable: true })
	rating: number;

	@OneToMany(() => Favorite, (favorite) => favorite.product)
	favorites: Favorite[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
