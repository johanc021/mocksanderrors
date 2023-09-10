import { ViewRepository } from '../daos/repositories/view.repository.js';
import { STATUS } from '../utils/constantes.js'
import { generateProducts } from '../utils/mocksProducts.js';

const viewRepository = new ViewRepository()

class ViewsController {

    async getHome(req, res) {
        res.render('home')
    }
    async getRegister(req, res) {
        res.render('register');
    }

    async getLogin(req, res) {
        res.render('login');
    }

    async getResetPassword(req, res) {
        res.render('resetPassword');
    }

    async getProfile(req, res) {
        res.render('profile', { user: req.user });
    }

    async getProducts(req, res) {
        const { page = 1 } = req.query;

        try {
            const result = await viewRepository.getAllProducts(page);
            const { docs, hasPrevPage, hasNextPage, prevPage, nextPage } = result;

            res.render('products', {
                products: docs,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCarts(req, res) {
        try {
            const carts = await viewRepository.getAllCarts();
            res.render('carts', { carts });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getChat(req, res) {
        try {
            const messages = await viewRepository.getAllmessages();
            res.render('chat', { messages });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async getCartById(req, res) {
        const cartId = req.params.cid;

        try {
            const cart = await viewRepository.getCartById(cartId);
            res.render('cart', { cart });
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    async createMokingProducts(req, res) {
        try {
            const total = +req.query.total || 500
            const products = Array.from({ length: total }, () => generateProducts())
            await viewRepository.generateUsers(products)
            res.json({ success: true, payload: products })
        } catch (error) {
            throw new Error(error)
        }
    }
}

export default new ViewsController();
