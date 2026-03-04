export default class CartRepository {

    constructor(dao) {
        this.dao = dao;
    }

    createCart() {
        return this.dao.create();
    }

    getCartById(id) {
        return this.dao.getCartById(id);
    }
    
    updateCart(id, data) {
        return this.dao.updateCart(id, data);
    }
}


