import Cart from '../models/Cart.js';

class CartManager {

    async createCart() {
        return await Cart.create({ products: [] });
    }

    async getCartById(cid) {
        return await Cart.findById(cid).populate("products.product").lean();
    }

    async addProductToCart(cid, pid) {
        const cart = await Cart.findById(cid);
        if (!cart) return null;

        const existingProduct = cart.products.find(
            p => p.product.toString() === pid
        );

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        return cart;
    }

    async deleteProductFromCart(cid, pid) {
        const cart = await Cart.findById(cid);
        if (!cart) return null;

        cart.products = cart.products.filter(
            p => p.product.toString() !== pid
        );

        await cart.save();
        return cart;
    }

    async updateCart(cid, products) {
        return await Cart.findByIdAndUpdate(
            cid,
            { products },
            { new: true }
        );
    }

    async updateProductQuantity(cid, pid, quantity) {
        const cart = await Cart.findById(cid);
        if (!cart) return null;

        const product = cart.products.find(
            p => p.product.toString() === pid
        );
        if (!product) return null;

        product.quantity = quantity;
        await cart.save();
        return cart;
    }

    async clearCart(cid) {
        return await Cart.findByIdAndUpdate(
            cid,
            { products: [] },
            { new: true }
        );
    }
}

export default new CartManager();




