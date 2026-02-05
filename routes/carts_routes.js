import { Router } from "express";
import CartManager from "../dao/CartManager.js";

const router = Router();

router.post("/", async (req, res) => {
    const cart = await CartManager.createCart();
    res.status(201).json(cart);
});

router.get("/:cid", async (req, res) => {
    const cart = await CartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
});

router.post("/:cid/products/:pid", async (req, res) => {
    const cart = await CartManager.addProductToCart(
        req.params.cid,
        req.params.pid
    );
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
});

router.delete("/:cid/products/:pid", async (req, res) => {
    const cart = await CartManager.deleteProductFromCart(
        req.params.cid,
        req.params.pid
    );

    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart);
});

router.put("/:cid", async (req, res) => {
    const { products } = req.body;

    const cart = await CartManager.updateCart(req.params.cid, products);

    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart);
});

router.put("/:cid/products/:pid", async (req, res) => {
    const { quantity } = req.body;

    const cart = await CartManager.updateProductQuantity(
        req.params.cid,
        req.params.pid,
        quantity
    );

    if (!cart) {
        return res.status(404).json({ error: "Carrito o producto no encontrado" });
    }

    res.json(cart);
});

router.delete("/:cid", async (req, res) => {
    const cart = await CartManager.clearCart(req.params.cid);

    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart);
});

export default router;