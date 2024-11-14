import Category from "../models/category.model.js";

export const createCategory=async (req,res,next)=>{
    const {name}=req.body;
    try{
        const existingCategory=await Category.findOne({name});
        if(existingCategory){
            return res.status(400).json({message:"Category already exist"});
        }
        const category=new Category({name});
        await category.save();
        res.status(201).json(category);
    }catch(error){
        next(error);
    }
};

export const getCategories=async(req,res,next)=>{
    try{
        const categories=await Category.find();
        res.status(200).json(categories);
    }catch(error){
        next(error);
    }
};
export const deleteCategory = async (req, res, next) => {
    const { id } = req.params;
    try {
      await Category.findByIdAndDelete(id);
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      next(error);
    }
  };