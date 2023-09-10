import { ProductRepository } from '../daos/repositories/product.repository.js';
import { STATUS } from '../utils/constantes.js'
import CustomError from '../utils/customErrors/customError.js';
import { generateProductError } from '../utils/customErrors/info.js'
import Error from '../utils/customErrors/enum.js';

const productRepository = new ProductRepository()


class ProductController {
    async getAllProducts(req, res) {
        try {
            const { page, limit } = req.query;
            const products = await productRepository.getAllProducts(page, limit);
            res.status(200).json({ products });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getProductById(req, res) {
        try {
            const { productId } = req.params;
            const product = await productRepository.getProductById(productId);
            res.status(200).json({ product });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async createProduct(req, res) {
        try {
            const product = req.body;
            if (!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category || !product.thumbnail) {
                CustomError.createError({
                    name: "Error al crear el usuario",
                    cause: generateProductError(product),
                    message: "Error al crear el producto",
                    code: Error.INVALID_TYPE_ERROR
                })
            }
            const createdProduct = await productRepository.createProduct(product);
            res.status(201).json({ createdProduct });
        } catch (error) {
            res.status(400).json({ error: error.message, code: error.code, cause: error.cause, status: STATUS.FAIL });
        }
    }

    async updateProduct(req, res) {
        try {
            const { productId } = req.params;
            const updatedProduct = req.body;
            const updated = await productRepository.updateProduct(productId, updatedProduct);
            res.status(200).json({ updated });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const { productId } = req.params;
            const deleted = await productRepository.deleteProduct(productId);
            res.status(200).json({ deleted });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new ProductController();
