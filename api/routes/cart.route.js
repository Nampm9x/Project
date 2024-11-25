import express from "express";
import {
  addToCart,
  getCart,
  minusQuantity,
  plusQuantity,
  removeFromCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add-to-cart", addToCart);
router.get("/get-cart/:userId", getCart);
router.put("/plus-quantity", plusQuantity);
router.put("/minus-quantity", minusQuantity);
router.delete("/remove-from-cart", removeFromCart);

export default router;
