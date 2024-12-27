import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Favorite } from './Favorite.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	firstname: string;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@OneToMany(() => Favorite, (favorite) => favorite.user)
	favorites: Favorite[];

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}
