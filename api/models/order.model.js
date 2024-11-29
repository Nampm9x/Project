import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    products: [
      {
        productId: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      default: 0
    },
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;