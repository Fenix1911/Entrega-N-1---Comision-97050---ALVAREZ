import Product from '../models/Product.js';

class ProductDAO {
    async getAll(filter = {}, options = {}) {
        return await Product.paginate(filter, options);
    }
    async getProductById(id) {
        return await Product.findById(id).lean();
    }
    async create (productData) {
        return await Product.create(productData);
    }
    async update(id, data) {
        return await Product.findByIdAndUpdate(id, data, { new: true });
    }
    async delete(id) {
        return await Product.findByIdAndDelete(id);
    }
}

export default ProductDAO;

