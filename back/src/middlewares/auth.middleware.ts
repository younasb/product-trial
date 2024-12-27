import { type NextFunction, type Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { AccountRepository } from '../repositories/account.repositories';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User.entity';
import { AppError } from '../core/custom.error';
import { envs } from '../core/envs';
import { type CustomRequest } from '../core/types';

export class AuthMiddleware {
	private readonly specialAccessRoutes = [
		{
			route: '/products',
			methods: ['POST', 'PATCH', 'DELETE']
		}
	];

	private readonly allowedUserEmailForSpecialAccess = envs.ADMIN_USER;

	public verifyToken = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
		const accountRepository = new AccountRepository(AppDataSource.getRepository(User));
		const header = req.headers.authorization;
		if (!header) {
			next(AppError.forbidden('Unauthorized', 'UNAUTHORIZED'));
			return;
		}
		const token = header.split(' ')[1];
		if (!token) {
			res.status(401).json({ message: 'Unauthorized' });
			next(AppError.forbidden('Token not found ', 'UNAUTHORIZED'));
			return;
		}
		try {
			const decoded = jwt.verify(token, envs.JWT_SECRET) as { id: number };

			if (!decoded) {
				next(AppError.forbidden('Invalid token', 'UNAUTHORIZED'));
				return;
			}

			const user = await accountRepository.findOneBy({ id: decoded.id });
			if (!user) {
				next(AppError.forbidden('User not found', 'UNAUTHORIZED'));
				return;
			}
			req.userId = decoded.id;
			req.userEmail = user.email;

			const allow = this.allowAccess(req);
			if (!allow) {
				next(AppError.forbidden('You account are not authorized', 'UNAUTHORIZED'));

				return;
			}
		} catch (error) {
			next(AppError.forbidden('Invalid token', 'UNAUTHORIZED'));
			return;
		}

		next();
	};

	private readonly allowAccess = (req: CustomRequest): boolean => {
		const { route, methods } = this.specialAccessRoutes.find((routeConfig) => req.path.includes(routeConfig.route)) ?? {
			route: '',
			methods: []
		};
		if (!route) return true;
		if (!methods.includes(req.method)) return true;
		return req.userEmail === this.allowedUserEmailForSpecialAccess;
	};
}
