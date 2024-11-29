import Order from "../models/order.model.js";

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
    res.status(200).json(newOrder);
  } catch (error) {
    next(error);
  }
};