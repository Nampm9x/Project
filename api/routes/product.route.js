import express from 'express';
import { createProduct, deleteProduct, editProduct, getProduct, getProductByID, getProductForUser } from '../controllers/product.controller.js';

const router = express.Router();

router.post("/create-product", createProduct);
router.get("/get-product",getProduct);
router.put("/delete-product/:id",deleteProduct);
router.put("/edit-product/:id",editProduct);
router.get("/get-products-for-user",getProductForUser);
router.get("/get-product-by-id/:id",getProductByID);

export default router;