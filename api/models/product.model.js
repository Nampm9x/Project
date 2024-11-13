import mongoose from "mongoose";

const productSchema =new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    images: {
        type: Array,
        required: true,
    }
},{ timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;