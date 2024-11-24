import express from 'express';
import { createCategory, deleteCategory, deleteChildCategory, editCategory, editChildCategory, getCategories, getChildCategories, getOneChildCategory } from '../controllers/category.controller.js';

const router=express.Router();

router.post("/create-category",createCategory);
router.get("/get-categories",getCategories);
router.delete("/delete-category/:id",deleteCategory);
router.get("/get-child-categories/:id",getChildCategories);
router.put("/edit-category/:id",editCategory);
router.delete("/delete-child-category/:id",deleteChildCategory);
router.put("/edit-child-category/:id",editChildCategory);
router.get("/get-one-child-category/:id", getOneChildCategory);
export default router;