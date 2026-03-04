import { Router } from "express";
import passport from "passport";

import CartDAO from "../dao/mongo/CartDAO.js";
import CartRepository from "../repositories/CartRepository.js";

import CartService from "../services/cart.service.js";

import { authorize } from "../middlewares/authorization.middleware.js";

const router = Router();

const cartRepository = new CartRepository(new CartDAO());
const cartService = new CartService(cartRepository);


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

            const cart = await cartService.addProduct(
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

export default router;