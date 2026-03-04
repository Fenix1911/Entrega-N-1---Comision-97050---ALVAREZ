export default class PurchaseService {

  constructor(cartRepository, productRepository, ticketRepository) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
    this.ticketRepository = ticketRepository;
  }

 
  generateTicketCode() {
    return `TCK-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  }

  async purchaseCart(cid, purchaserEmail) {

    const cart = await this.cartRepository.getCartById(cid);
    if (!cart) throw new Error("Carrito no encontrado");

    let total = 0;
    const notProcessed = [];

    for (const item of cart.products) {

      const product = await this.productRepository.getProductById(item.product._id);

      if (product.stock >= item.quantity) {

        product.stock -= item.quantity;

        await this.productRepository.updateProduct(product._id, product);

        total += product.price * item.quantity;

      } else {

        notProcessed.push(item);

      }
    }

    if (total === 0) {
      return { status: "failed", notProcessed };
    }

    const ticket = await this.ticketRepository.createTicket({
      code: this.generateTicketCode(),
      purchase_datetime: new Date(),
      amount: total,
      purchaser: purchaserEmail
    });

    await this.cartRepository.updateCart(cid, { products: notProcessed });

    return {
      ticket,
      notProcessed
    };
  }
}