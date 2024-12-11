import Rate from "../models/rate.model.js";

export const createRate = async (req, res, next) => {
    try {
        const { comment, products, owner } = req.body;
        const rate = new Rate({
            comment,
            owner,
            products,
        });
        await rate.save();
        res.status(201).json(rate);
    } catch (error) {
        next(error);
    }
};

export const getRates = async (req, res, next) => {
    const { productid } = req.params;
    try {
        const rates = await Rate.find({
            products: { $in: [productid] },
        }).populate({
            path: "owner",
            select: "name email _id",
        });
        res.status(200).json(rates);
    } catch (error) {
        next(error);
    }
};

export const likeRate = async (req, res, next) => {
    const { id, rateid } = req.params;

    try {
        const rate = await Rate.findById(rateid);
        if (!rate) {
            return res.status(404).json({ message: "Không tìm thấy dánh giá" });
        }
        const userIndex = rate.likes.indexOf(id);
        if (userIndex === -1) {
            rate.likes.push(id);
        } else {
            rate.likes.splice(userIndex, 1);
        }
        await rate.save();
        res.status(200).json(rate.likes);
    } catch (error) {
        next(error);
    }
};