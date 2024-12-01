import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import Product from './../models/product.model.js';

export const createOrder = async (req, res, next) => {
  const { user, name, phone, address, products, total } = req.body;
  const newOrder = new Order({
    user,
    receiver: name,
    phone,
    address,
    products,
    total,
  });
  try {
    await newOrder.save();
    const cart = await Cart.findOne({ userId: user });
    if(cart.products === products){
      cart.products = [];
    } else {
      products.forEach((product) => {
        cart.products = cart.products.filter(
          (item) => item.productId !== product.productId
        );
      });
    }

    await cart.save();

    products.forEach(async (product) => {
      const productInDB = await Product.findById(product.productId);
      productInDB.quantity -= product.quantity;
      await productInDB.save();
    });

    res.status(200).json(newOrder);
  } catch (error) {
    next(error);
  }
};
