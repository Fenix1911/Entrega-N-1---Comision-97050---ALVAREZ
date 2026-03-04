import Cart from '../models/Cart.js';

class CartDAO {

    async create() {
        return await Cart.create({ products: [] });
    }

    async getCartById(cid) {
        return await Cart.findById(cid).populate("products.product").lean();
    }

    async updateCart (id, data) {
        return await Cart.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );
    }

}

export default CartDAO;




