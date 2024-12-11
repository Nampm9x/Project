import express from "express";
import {
  createProduct,
  deleteProduct,
  editProduct,
  getProduct,
  getProductByID,
  getProductFeatured,
  getProductForUser,
  productsSold,
  searchProduct,
  searchProductForUsers,
  getProductByCategory,
} from "../controllers/product.controller.js";
import { verifyToken } from "../utils/verifyuser.js";
const router = express.Router();

router.post("/create-product", verifyToken, createProduct);
router.get("/get-product", getProduct);
router.put("/delete-product/:id", deleteProduct);
router.put("/edit-product/:id", editProduct);
router.get("/get-products-for-user", getProductForUser);
router.get("/get-product-by-id/:id", getProductByID);
router.get("/search-product/:search", searchProduct);
router.get("/get-products-featured", getProductFeatured);
router.get("/search-product-for-user/:search", searchProductForUsers);
router.get("/get-products-by-category/:id", getProductByCategory);
router.get("/get-products-sold", verifyToken, productsSold);
export default router;
