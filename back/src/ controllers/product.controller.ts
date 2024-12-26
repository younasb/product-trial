import { type NextFunction, type Request, type Response } from 'express';
import { Product } from '../entity/Product.entity';
import { ProductRepository } from '../repositories/product.repositories';
import { AppDataSource } from '../data-source';
import { HttpCode } from '../core/constants';
import { AppError } from '../core/custom.error';

export class ProductController {
	private readonly productRepository = new ProductRepository(AppDataSource.getRepository(Product));

	public getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const products = await this.productRepository.findAll();
			res.json(products);
		} catch (error) {
			next(AppError.internalServer('Failed to fetch products ', 'PRODUCTS_FETCH_FAILED'));
		}
	};

	getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const id = parseInt(req.params.id);
		try {
			const product = await this.productRepository.findById({ id });
			if (!product) {
				next(AppError.notFound('Product not found ', 'PRODUCT_NOT_FOUND'));

				return;
			}
			res.json(product);
		} catch (error) {
			next(AppError.internalServer('Failed to fetch product ', 'PRODUCT_FETCH_FAILED'));
		}
	};

	create = async (req: Request<unknown, unknown, Product>, res: Response, next: NextFunction): Promise<void> => {
		const product = new Product();
		const productData = {
			code: req.body.code,
			name: req.body.name,
			description: req.body.description,
			image: req.body.image,
			category: req.body.category,
			price: req.body.price,
			quantity: req.body.quantity,
			internalReference: req.body.internalReference,
			shellId: req.body.shellId,
			inventoryStatus: req.body.inventoryStatus,
			rating: req.body.rating
		};
		Object.assign(product, productData);

		try {
			const savedProduct = await this.productRepository.save(product);
			res.status(HttpCode.CREATED).json(savedProduct);
		} catch (error) {
			next(AppError.internalServer('Failed to create product ', 'PRODUCT_CREATE_FAILED'));
		}
	};

	update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const id = parseInt(req.params.id);
		const product = await this.productRepository.findById({ id });
		if (!product) {
			next(AppError.notFound('Product not found ', 'PRODUCT_NOT_FOUND'));
			return;
		}

		product.code = req.body.code || product.code;
		product.name = req.body.name || product.name;
		product.description = req.body.description || product.description;
		product.image = req.body.image || product.image;
		product.category = req.body.category || product.category;
		product.price = req.body.price || product.price;
		product.quantity = req.body.quantity || product.quantity;
		product.internalReference = req.body.internalReference || product.internalReference;
		product.shellId = req.body.shellId || product.shellId;
		product.inventoryStatus = req.body.inventoryStatus || product.inventoryStatus;
		product.rating = req.body.rating || product.rating;
		product.updatedAt = new Date();

		try {
			const updatedProduct = await this.productRepository.save(product);
			res.json(updatedProduct);
		} catch (error) {
			next(AppError.internalServer('Failed to update product', 'PRODUCT_UPDATE_FAILED'));
		}
	};

	delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const id = parseInt(req.params.id);
		try {
			const result = await this.productRepository.delete(id);
			if (result.affected === 0) {
				res.status(404).json({ error: 'Product not found' });
				next(AppError.notFound('Product not found', 'PRODUCT_NOT_FOUND'));

				return;
			}
			res.status(204).send();
		} catch (error) {
			next(AppError.internalServer('Failed to delete product', 'PRODUCT_DELETE_FAILED'));
		}
	};
}
