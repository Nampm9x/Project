import express from 'express';
import { createProduct, getProduct } from '../controllers/product.controller.js';

const router = express.Router();

router.post("/create-product", createProduct);
router.get("/get-product",getProduct);

export default router;