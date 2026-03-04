import { Router } from "express";
import passport from "passport";

import ProductDAO from "../dao/ProductDAO.js";
import ProductRepository from "../repositories/ProductRepository.js";
import ProductService from "../services/product.service.js";

import { authorize } from "../middlewares/authorization.middleware.js";

const router = Router();

const productRepository = new ProductRepository(new ProductDAO());
const productService = new ProductService(productRepository);


router.get("/", async (req, res) => {

    const result = await productService.getProducts(req.query);

    res.json(result);

});


router.get("/:pid", async (req, res) => {

    const product = await productService.getProductById(req.params.pid);

    res.json(product);

});


router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    async (req, res) => {

        const product = await productService.createProduct(req.body);

        res.status(201).json(product);

    }
);


router.put(
    "/:pid",
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    async (req, res) => {

        const product = await productService.updateProduct(
            req.params.pid,
            req.body
        );

        res.json(product);

    }
);


router.delete(
    "/:pid",
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    async (req, res) => {

        await productService.deleteProduct(req.params.pid);

        res.json({ message: "Producto eliminado" });

    }
);

export default router;