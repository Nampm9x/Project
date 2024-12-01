import express from 'express';
import { createOrder, getOrder, getOrders } from '../controllers/order.controller.js';

const router = express.Router();

router.post("/create-order", createOrder);
router.get("/get-order/:id", getOrder);
router.get("/get-orders/:user", getOrders);

export default router;