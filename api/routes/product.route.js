import express from 'express';
import { createProduct, deleteProduct, editProduct, getProduct } from '../controllers/product.controller.js';

const router = express.Router();

router.post("/create-product", createProduct);
router.get("/get-product",getProduct);
router.put("/delete-product/:id",deleteProduct);
router.put("/edit-product/:id",editProduct);

export default router;