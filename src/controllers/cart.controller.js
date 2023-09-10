import { CartRepository } from '../daos/repositories/cart.repository.js';
import { STATUS } from '../utils/constantes.js'
import ticketModel from '../daos/schema/tickets.schema.js';
import { generateTicketCode, calculateTotalAmount } from '../utils.js';
import { UserRepository } from '../daos/repositories/user.repository.js';
import { ProductRepository } from '../daos/repositories/product.repository.js';

const cartRepository = new CartRepository()
const userRepository = new UserRepository()
const productRepository = new ProductRepository();

class CartController {
    async getAllCarts(req, res) {
        try {
            const carts = await cartRepository.getAllCarts();
            res.status(200).json({ carts });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCart(req, res) {
        try {
            const { cartId } = req.params;
            const cart = await cartRepository.getCart(cartId);
            res.status(200).json({ cart });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async deleteProductFromCart(req, res) {
        try {
            const { cartId, productId } = req.params;
            const updatedCart = await cartRepository.deleteProductFromCart(cartId, productId);
            res.status(200).json({ cart: updatedCart });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async saveProductToCart(req, res) {
        try {
            const { idProduct, idCart, quantity } = req.body;
            const cart = await cartRepository.saveProductToCart(idProduct, idCart, quantity);
            res.status(201).json({ cart });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateCart(req, res) {
        try {
            const { cartId } = req.params;
            const { products } = req.body;
            const updatedCart = await cartRepository.updateCart(cartId, products);
            res.status(200).json({ cart: updatedCart });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateProductQuantity(req, res) {
        try {
            const { cartId, productId } = req.params;
            const { quantity } = req.body;
            const updatedCart = await cartRepository.updateProductQuantity(cartId, productId, quantity);
            res.status(200).json({ cart: updatedCart });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteAllProductsFromCart(req, res) {
        try {
            const { cartId } = req.params;
            const cart = await cartRepository.deleteAllProductsFromCart(cartId);
            res.status(200).json({ cart });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async purchaseCart(req, res) {
        try {
            const { cid } = req.params;
            const { user } = req;

            // Obtener el carrito y usuario autorizado
            const cart = await cartRepository.getCart(cid);

            //obtener id del usuario
            /* const userIdAuthorized = await userRepository.getIdUserByEmail(user.email);
            userIdAuthorized._id.toString() */

            // Inicializar arreglos para productos comprados y no comprados
            const productsNotPurchased = [];
            const productsPurchased = [];

            let totalAmount = 0; // Inicializar el monto total en 0

            for (const productItem of cart.products) {
                const { product, quantity } = productItem;
                const availableProduct = await productRepository.getProductById(product)
                if (availableProduct && availableProduct.stock >= quantity) {
                    // Restar la cantidad comprada del stock del producto
                    const newStock = availableProduct.stock - quantity;
                    await productRepository.updateProductStock(product, newStock);
                    // Calcular el precio total para este producto y agregarlo al monto total
                    totalAmount += availableProduct.price * quantity;
                    productsPurchased.push(productItem); // Agregar al arreglo de productos comprados
                } else {
                    productsNotPurchased.push(productItem);
                }
            }

            // Crear el ticket con los productos comprados y el monto total
            const ticket = await ticketModel.create({
                code: generateTicketCode(),
                purchase_datetime: new Date(),
                amount: Number(totalAmount), // Usar el monto total calculado
                purchaser: user.email,
            });

            for (const productItem of productsPurchased) {
                const { product } = productItem;
                const productId = product._id.toString();
                await cartRepository.deleteProductFromCart(cid, productId);
            }

            console.log("Productos no comprados " + productsNotPurchased)
            res.status(200).json({ status: STATUS.SUCCESS })

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


}

export default new CartController();
