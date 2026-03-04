import { Router } from "express";
import passport from "passport";

import ProductDAO from "../dao/ProductDAO.js";
import CartDAO from "../dao/CartDAO.js";
import CartRepository from "../repositories/CartRepository.js";

import CartService from "../services/cart.service.js";

import { authorize } from "../middlewares/authorization.middleware.js";

import ProductRepository from "../repositories/ProductRepository.js";
import TicketDAO from "../dao/TicketDAO.js";
import TicketRepository from "../repositories/TicketRepository.js";
import PurchaseService from "../services/purchase.service.js";


const router = Router();

const ticketRepository = new TicketRepository(new TicketDAO());
const productRepository = new ProductRepository(new ProductDAO());
const cartRepository = new CartRepository(new CartDAO());
const cartService = new CartService(cartRepository);
const purchaseService = new PurchaseService(cartRepository, productRepository, ticketRepository);





router.post("/", async (req, res) => {

    const cart = await cartRepository.createCart();

    res.status(201).json(cart);

});


router.get("/:cid", async (req, res) => {

    const cart = await cartRepository.getCartById(req.params.cid);

    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart);

});


router.post(
    "/:cid/products/:pid",
    passport.authenticate("jwt", { session: false }),
    authorize("user"),
    async (req, res) => {

        try {

            const cart = await cartService.addProductToCart(
                req.params.cid,
                req.params.pid
            );

            res.json(cart);

        } catch (error) {

            res.status(400).json({ error: error.message });

        }

    }
);


router.delete("/:cid/products/:pid", async (req, res) => {

    try {

        const cart = await cartService.removeProduct(
            req.params.cid,
            req.params.pid
        );

        res.json(cart);

    } catch (error) {

        res.status(400).json({ error: error.message });

    }

});


router.put("/:cid", async (req, res) => {

    const cart = await cartRepository.updateCart(
        req.params.cid,
        { products: req.body.products }
    );

    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart);

});


router.put("/:cid/products/:pid", async (req, res) => {

    try {

        const cart = await cartService.updateQuantity(
            req.params.cid,
            req.params.pid,
            req.body.quantity
        );

        res.json(cart);

    } catch (error) {

        res.status(400).json({ error: error.message });

    }

});

router.delete("/:cid", async (req, res) => {

    const cart = await cartRepository.updateCart(
        req.params.cid,
        { products: [] }
    );

    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart);

});

router.post("/:cid/purchase",passport.authenticate("jwt", { session: false }), async (req, res) => {

    try {

        const result = await purchaseService.purchaseCart(
            req.params.cid,
            req.user.email
        );

        res.json(result);
    } catch (error) {

        res.status(400).json({
        error: error.message
    });
    }
});

export default router;