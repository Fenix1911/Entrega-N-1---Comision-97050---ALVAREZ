import { Router } from "express";
import passport from "passport";

import ProductDAO from "../dao/ProductDAO.js";
import ProductRepository from "../repositories/ProductRepository.js";

import {authorize} from "../middlewares/auth.middleware.js";


const router = Router();
const productRepository = new ProductRepository(new ProductDAO);



router.get("/", async (req, res) => {
    
    const result = await productRepository.getAll({}, {limit: 10, page: 1, lean: true})

    res.json(result);
});

router.post("/", passport.authenticate("jwt", { session: false }), authorize(["admin"]), async (req, res) => {
    const product = await productRepository.create(req.body);
    res.json(product);
});

router.delete(
    "/:pid",
    passport.authenticate("jwt", { session: false }),
    authorize("admin"),
    async (req, res) => {

        await productRepository.deleteProduct(req.params.pid);

        res.json({
            message: "Producto eliminado"
        });

    }
);

export default router;
