import express from "express";
import { createRate, getRates, likeRate } from "../controllers/rate.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create-rate", verifyToken, createRate);
router.get("/get-rates/:productid", getRates);
router.put("/like-rate/:id/:rateid", verifyToken, likeRate)

export default router;