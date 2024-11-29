import Cart from "../models/cart.model.js";

export const addToCart = async (req, res, next) => {
  const { userId, productId, quantity, price } = req.body;
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      const newCart = new Cart({
        userId,
        products: [{ productId, quantity, price }],
      });
      await newCart.save();
      return res.status(201).json(newCart);
    }

    const product = cart.products.find(
      (product) => product.productId === productId
    );

    if (product) {
      product.quantity += quantity;
      product.price += price;
    } else {
      cart.products.push({ productId, quantity, price });
    }

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  const { userid } = req.params;
  try {
    const cart = await Cart.findOne({ userId: userid });
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const plusQuantity = async (req, res, next) => {
  const { userId, productId, price } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    const product = cart.products.find(
      (product) => product.productId === productId
    );
    product.quantity += 1;
    product.price += price;
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const minusQuantity = async (req, res, next) => {
  const { userId, productId, price } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    const product = cart.products.find(
      (product) => product.productId === productId
    );
    product.quantity -= 1;
    product.price -= price;
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

export const removeFromCart = async (req, res, next) => {
  const { userId, productId } = req.body;
  try {
    const cart = await Cart.findOne({ userId });
    cart.products = cart.products.filter(
      (product) => product.productId !== productId
    );
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};