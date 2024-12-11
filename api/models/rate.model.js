import mongoose from "mongoose";

const rateSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        products: {
            type: Array,
            required: true,
            default: [],
        },
        likes: {
            type: Array,
            default: [],
        }
    },
    { timestamps: true }
);

const Rate = mongoose.model("Rate", rateSchema);

export default Rate;