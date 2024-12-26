import { type NextFunction, type Request, type Response } from 'express';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User.entity';
import { AccountRepository } from '../repositories/account.repositories';
import { Encrypt } from '../helpers/encrypt';
import { AppError } from '../core/custom.error';
import { HttpCode } from '../core/constants';

export class AccountController {
	private readonly accountRepository = new AccountRepository(AppDataSource.getRepository(User));

	public create = async (
		req: Request<unknown, unknown, { username: string; firstname: string; email: string; password: string }>,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const { username, firstname, email, password } = req.body;
			const user = new User();
			const encryptedPassword = await Encrypt.passwordEncrypt(password);
			const userData = {
				username,
				firstname,
				email,
				password: encryptedPassword
			};
			Object.assign(user, userData);

			const checkUser = await this.accountRepository.findOneBy({ email });

			if (checkUser) {
				next(AppError.badRequest('Email already exists please', 'USER_ALREADY_EXISTS'));

				return;
			}
			const savedUser = await this.accountRepository.save(user);

			res.status(HttpCode.CREATED).json({ ...savedUser, password: undefined });
		} catch (error) {
			console.log('[ERROR_CREATE_USER]: ', error);
			next(AppError.internalServer('Failed to create user', 'CREATE_USER_FAILED'));
		}
	};

	public login = async (
		req: Request<unknown, unknown, { email: string; password: string }>,
		res: Response,
		next: NextFunction
	): Promise<void> => {
		try {
			const { email, password } = req.body;
			const user = await this.accountRepository.findOneBy({ email });
			if (!user) {
				next(AppError.forbidden('Invalid credentials', 'INVALID_CREDENTIALS'));
				return;
			}

			const isPasswordValid = await Encrypt.comparePass(password, user.password);

			if (!isPasswordValid) {
				next(AppError.forbidden('Invalid credentials', 'INVALID_CREDENTIALS'));
				return;
			}

			const token = await Encrypt.generateToken({ id: user.id });

			res.status(HttpCode.CREATED).json({ token, user: { ...user, password: undefined } });
		} catch (error) {
			next(AppError.internalServer('Failed to login', 'LOGIN_FAILED'));
		}
	};
}
