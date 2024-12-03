import express from 'express';
import { cancelOrder, createOrder, getOrder, getOrders, getOrdersForAdmin, updateOrderStatus } from '../controllers/order.controller.js';

const router = express.Router();

router.post("/create-order", createOrder);
router.get("/get-order/:id", getOrder);
router.get("/get-orders/:user", getOrders);
router.put("/cancel-order/:id", cancelOrder);
router.get("/get-orders-for-admin", getOrdersForAdmin);
router.put("/update-status/:id", updateOrderStatus);

export default router;