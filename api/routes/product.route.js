import express from 'express';
import { createProduct } from '../controllers/product.controller.js';

const router = express.Router();

router.post("/create-product", createProduct);

export default router;