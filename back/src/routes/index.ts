import { Router } from 'express';
import { AccountController } from '../ controllers/account.controller';
import { ProductController } from '../ controllers/product.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class AppRoutes {
	static get routes(): Router {
		const router = Router();

		const accountController = new AccountController();
		const productController = new ProductController();
		const authMiddleware = new AuthMiddleware();

		// router.get('/accounts', accountController.findAll);
		router.post('/account', accountController.create);
		router.post('/token', accountController.login);

		router.get('/products', authMiddleware.verifyToken, productController.getAll);
		router.post('/products', authMiddleware.verifyToken, productController.create);
		router.get('/products/:id', authMiddleware.verifyToken, productController.getOne);
		router.patch('/products/:id', authMiddleware.verifyToken, productController.update);
		router.delete('/products/:id', authMiddleware.verifyToken, productController.delete);

		return router;
	}
}
