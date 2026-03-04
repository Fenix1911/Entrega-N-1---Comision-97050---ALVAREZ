export default class CartService {

    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }

    async addProductToCart(cid, pid) {

        const cart = await this.cartRepository.getCartById(cid);

        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        const index = cart.products.findIndex(
            p => p.product._id.toString() === pid
        );

        if (index !== -1) {
            cart.products[index].quantity++;
        } else {
            cart.products.push({
                product: pid,
                quantity: 1
            });
        }

        await this.cartRepository.updateCart(cid, cart);

        return cart;
    }

    async removeProduct(cid, pid) {

        const cart = await this.cartRepository.getCartById(cid);

        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        cart.products = cart.products.filter(
            p => p.product._id.toString() !== pid
        );

        await this.cartRepository.updateCart(cid, cart);

        return cart;
    }

}