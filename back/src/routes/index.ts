import { Router } from 'express';
import { AccountController } from '../ controllers/account.controller';
import { ProductController } from '../ controllers/product.controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class AppRoutes {
	static get routes(): Router {
		const router = Router();

		const accountController = new AccountController();
		const productController = new ProductController();

		router.post('/account', accountController.create);
		router.post('/token', accountController.login);

		router.get('/products', AuthMiddleware.verifyToken, productController.getAll);
		router.post('/products', AuthMiddleware.verifyToken, productController.create);
		router.get('/products/:id', AuthMiddleware.verifyToken, productController.getOne);
		router.patch('/products/:id', AuthMiddleware.verifyToken, productController.update);
		router.delete('/products/:id', AuthMiddleware.verifyToken, productController.delete);

		return router;
	}
}
