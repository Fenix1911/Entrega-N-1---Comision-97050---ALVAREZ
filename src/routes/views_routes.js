import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";
import CartManager from "../dao/CartManager.js";

const router = Router();

router.get("/products", async (req, res) => {
    const {
        limit = 10,
        page = 1,
        sort,
        query
    } = req.query;

    const filter = {};
    if (query) {
        if (query === "true" || query === "false") {
            filter.status = query === "true";
        } else {
            filter.category = query;
        }
    }

    const options = {
        limit: Number(limit),
        page: Number(page),
        lean: true
    };

    if (sort) {
        options.sort = { price: sort === "asc" ? 1 : -1 };
    }

    const result = await ProductManager.getProducts(filter, options);

    res.render("products", {
        products: result.docs,
        pagination: result
    });
});

router.get("/carts/:cid", async (req, res) => {
    try {
        const cart = await CartManager.getCartById(req.params.cid);

        if (!cart) {
            return res.status(404).send("Carrito no encontrado");
        }

        res.render("cart", {
            cartId: cart._id,
            products: cart.products
        });

    } catch (error) {
        res.status(500).send("Error al cargar el carrito");
    }
});

router.get("/products/:pid", async (req, res) => {
    try {
        const product = await ProductManager.getProductById(req.params.pid);

        if (!product) {
            return res.status(404).send("Producto no encontrado");
        }


        //Se utiliza un ID de carrito fijo para poder probar la funcionalidad de agregar al carrito desde la vista de detalle del producto.
        res.render("productDetail", {
            product,
            cartId: "6960296d8c507802b7c8fadb"
        });

    } catch (error) {
        res.status(500).send("Error al cargar el producto");
    }
});

export default router;