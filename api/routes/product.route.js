import express from 'express';
import { createProduct, deleteProduct, getProduct } from '../controllers/product.controller.js';

const router = express.Router();

router.post("/create-product", createProduct);
router.get("/get-product",getProduct);
router.put("/delete-product/:id",deleteProduct);

export default router;