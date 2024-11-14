import express from 'express';
import { createCategory, deleteCategory, getCategories } from '../controllers/category.controller.js';

const router=express.Router();

router.post("/create-category",createCategory);
router.get("/get-categories",getCategories);
router.delete("/delete-category/:id",deleteCategory);

export default router;