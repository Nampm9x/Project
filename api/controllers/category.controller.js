import Category from "../models/category.model.js";
import ChildCategory from "../models/childCategory.model.js";

export const createCategory = async (req, res, next) => {
  const { name, category } = req.body;
  try {
    if (!category) {
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
        return res.status(400).json({ message: "Danh mục đã tồn tại" });
      }
      const category = new Category({ name });
      await category.save();
      res.status(201).json(category);
    } else {
      const existingChildCategory = await ChildCategory.findOne({ name,parentCategory:category });
      
      if (existingChildCategory) {
        return res.status(400).json({message:"Danh mục con đã tồn tại"});
      }
      const childCategory = new ChildCategory({
        name,
        parentCategory: category,
      });
      await childCategory.save();
      res.status(201).json(childCategory);
    }
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

export const getChildCategories = async (req, res, next) => {
  const { id } = req.params;

  try {
    const childCategories = await ChildCategory.find({ parentCategory: id });
    if (!childCategories) {
      return res.status(404).json({ message: "Không tìm thấy danh mục " });
    }
    res.status(200).json(childCategories);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Xóa danh mục thành công" });
  } catch (error) {
    next(error);
  }
};

export const editCategory = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục" });
    }
    category.name = name;
    await category.save();

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const deleteChildCategory=async (req,res,next)=>{
  const { id } = req.params;
  try {
    await ChildCategory.findByIdAndDelete(id);
    res.status(200).json({ message: "Xóa danh mục con thành công" });
  } catch (error) {
    next(error);
  }
};

export const editChildCategory=async(req,res,next)=>{
  const { id } = req.params;
  const { name } = req.body;
  try {
    const category = await ChildCategory.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục con" });
    }
    category.name = name;
    await category.save();

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

export const getOneChildCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const childCategory = await ChildCategory.findById(id);
    if (!childCategory) {
      return res.status(404).json({ message: "Không tìm thấy danh mục con" });
    }
    res.status(200).json(childCategory);
  } catch (error) {
    next(error);
  }
};