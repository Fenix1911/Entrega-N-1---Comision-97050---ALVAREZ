import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";

const router = Router();

/**
 * GET /api/products
 * Query params:
 * - limit
 * - page
 * - sort (asc | desc)
 * - query (category o status)
 */

router.get("/", async (req, res) => {
    try {
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
            page: Number(page),
            limit: Number(limit),
            lean: true
        };

        if (sort === "asc" || sort === "desc") {
            options.sort = { price: sort === "asc" ? 1 : -1 };
        }

        const result = await ProductManager.getProducts(filter, options);

        res.json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage
                ? `/api/products?page=${result.prevPage}`
                : null,
            nextLink: result.hasNextPage
                ? `/api/products?page=${result.nextPage}`
                : null
        });

    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const newProduct = await ProductManager.addProduct(req.body);

        res.status(201).json({
            status: "success",
            payload: newProduct
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const product = await ProductManager.getProductById(req.params.pid);
        if (!product) {
            return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        }
        res.json({ status: "success", payload: product });
    } catch (error) {
        res.status(400).json({ status: "error", error: "ID inválido" });
    }
});

router.put("/:pid", async (req, res) => {
    try {
        const updated = await ProductManager.updateProduct(req.params.pid, req.body);
        if (!updated) {
            return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        }
        res.json({ status: "success", payload: updated });
    } catch (error) {
        res.status(400).json({ status: "error", error: error.message });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const deleted = await ProductManager.deleteProduct(req.params.pid);
        if (!deleted) {
            return res.status(404).json({ status: "error", error: "Producto no encontrado" });
        }
        res.json({ status: "success", message: "Producto eliminado" });
    } catch (error) {
        res.status(400).json({ status: "error", error: error.message });
    }
});

export default router;