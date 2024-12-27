import { Router } from 'express';
import { AccountController } from '../ controllers/account.controller';
import { ProductController } from '../ controllers/product.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { FavoriteController } from '../ controllers/favorite.controller';

export class AppRoutes {
	static get routes(): Router {
		const router = Router();

		const accountController = new AccountController();
		const favoriteController = new FavoriteController();
		const productController = new ProductController();
		const authMiddleware = new AuthMiddleware();

		// router.get('/accounts', accountController.findAll);  // for debug and testing
		router.post('/account', accountController.create);
		router.post('/token', accountController.login);

		// manage products
		router.get('/products', authMiddleware.verifyToken, productController.getAll);
		router.post('/products', authMiddleware.verifyToken, productController.create);
		router.get('/products/:id', authMiddleware.verifyToken, productController.getOne);
		router.patch('/products/:id', authMiddleware.verifyToken, productController.update);
		router.delete('/products/:id', authMiddleware.verifyToken, productController.delete);

		// manage user favorites
		router.get('/favorites', authMiddleware.verifyToken, favoriteController.getAll); // for debug and testing
		router.get('/:userId/favorites', authMiddleware.verifyToken, favoriteController.findFavoritesByUser);
		router.post('/:userId/favorites', authMiddleware.verifyToken, favoriteController.create);
		router.delete('/:userId/favorites/:id', authMiddleware.verifyToken, favoriteController.delete);

		return router;
	}
}
