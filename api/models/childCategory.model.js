import mongoose from "mongoose";

const childCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    parentCategory: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const ChildCategory = mongoose.model("ChildCategory", childCategorySchema);

export default ChildCategory;
