export default class ProductRepository {

    constructor(dao) {
        this.dao = dao;
    }

    getProducts(filter = {}, options = {}) {
        return this.dao.getAll(filter, options);
    }

    getProductById(id) {
        return this.dao.getProductById(id);
    }

    createProduct(productData) {
        return this.dao.create(productData);
    }

    updateProduct(id, data) {
        return this.dao.update(id, data);
    }

    deleteProduct(id) {
        return this.dao.delete(id);
    }
}