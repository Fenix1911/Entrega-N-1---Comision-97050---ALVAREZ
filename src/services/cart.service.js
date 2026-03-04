export default class CartService {

    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }

    async addProductToCart(cid, pid) {

        const cart = await this.cartRepository.getCartById(cid);

        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        const index = cart.products.findIndex(p => {

            if (!p.product) return false;

            const productId =
                p.product._id ? p.product._id.toString() : p.product.toString();

                return productId === pid;
            });

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

    async updateQuantity(cid, pid, quantity) {

        const cart = await this.cartRepository.getCartById(cid);

        if (!cart) {
            throw new Error("Carrito no encontrado");
        }

        const product = cart.products.find(p => {
            const productId =
                p.product._id ? p.product._id.toString() : p.product.toString();

            return productId === pid;
        });

        if (!product) {
            throw new Error("Producto no encontrado en el carrito");
        }

        product.quantity = quantity;

        await this.cartRepository.updateCart(cid, cart);

        return cart;
    }



}