import Product from "../models/product.model.js";

export const createProduct = async (req, res, next) => {
    try {
        const { name, thumbnail, category, description, price, images } = req.body;
        const product = new Product({
            name,
            thumbnail,
            category,
            description,
            price,
            images,
        });
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
}

export const getProduct=async(req,res,next)=>{
    try{
        const product=await Product.find({
          status:{$ne:"deleted"},
        });
        res.status(200).json(product);
    }catch(error){
    next(error);
    }
}

export const deleteProduct = async (req, res, next) => {
    try {
      const { id } = req.params;
      const product = await Product.findById(id);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with id ${id} not found` });
      }
      product.status = "deleted";
      await product.save();
      res.status(200).json({ message: "Product deleted" });
    } catch (error) {
      next(error);
    }
  };
  export const editProduct = async (req, res, next) => {
    const { id } = req.params;
    const { name, thumbnail, category, price, images } = req.body;
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with id ${id} not found` });
      }
      product.name = name;
      product.thumbnail = thumbnail;
      product.category = category;
      product.price = price;
      product.images = images;
      await product.save();
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  };