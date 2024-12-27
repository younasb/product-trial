import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User.entity';
import { Product } from './entity/Product.entity';
import { Favorite } from './entity/Favorite.entity';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: 'localhost',
	port: 5432,
	username: 'test',
	password: 'test',
	database: 'test',
	synchronize: true,
	logging: false,
	entities: [User, Product, Favorite],
	migrations: [],
	subscribers: []
});
