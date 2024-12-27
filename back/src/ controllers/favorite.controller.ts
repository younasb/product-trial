import { type NextFunction, type Request, type Response } from 'express';
import { AppDataSource } from '../data-source';
import { AppError } from '../core/custom.error';
import { HttpCode } from '../core/constants';
import { FavoriteRepository } from '../repositories/favorite.repositories';
import { Favorite } from '../entity/Favorite.entity';
import { type CustomRequest } from '../core/types';

export class FavoriteController {
	private readonly favoriteRepository = new FavoriteRepository(AppDataSource.getRepository(Favorite));

	public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const favorites = await this.favoriteRepository.findAll();
			res.json(favorites);
		} catch (error) {
			next(AppError.internalServer('Failed to fetch favorites', 'FETCH_FAVORITES_FAILED'));
		}
	};

	public findFavoritesByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const userId = parseInt(req.params.userId);
		try {
			const favorites = await this.favoriteRepository.findFavoritesByUser(userId);
			res.status(HttpCode.OK).json(favorites);
		} catch (error) {
			next(AppError.internalServer('Failed to fetch users', 'FETCH_USERS_FAILED'));
		}
	};

	public create = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
		const userId = req.userId;
		const productId = parseInt(req.body.productId);
		if (!userId) {
			next(AppError.badRequest('User id not provided', 'INVALID_INPUT'));
			return;
		}
		try {
			const favorite = await this.favoriteRepository.addFavorite(userId, productId);
			res.status(HttpCode.CREATED).json(favorite);
		} catch (error) {
			next(AppError.internalServer('Failed to create favorite', 'CREATE_FAVORITE_FAILED'));
		}
	};

	public delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const favoriteId = parseInt(req.params.id);
		// Todo: add access validation by user id
		try {
			await this.favoriteRepository.removeFavorite(favoriteId);
			res.status(HttpCode.NO_CONTENT).send();
		} catch (error) {
			next(AppError.internalServer('Failed to delete favorite', 'DELETE_FAVORITE_FAILED'));
		}
	};
}
