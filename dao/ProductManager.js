import Product from '../models/Product.js';

class ProductManager {
    async getProducts(filter = {}, options = {}) {
        return await Product.paginate(filter, options);
    }
    async getProductById(id) {
        return await Product.findById(id).lean();
    }
    async addProduct(product) {
        return await Product.create(product);
    }
    async updateProduct(id, update) {
        return await Product.findByIdAndUpdate(id, update, { new: true });
    }
    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }
}

export default new ProductManager();
