import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product", // Product Model ka naam
                required: true,
            },
            size: { type: String },
            quantity: { type: Number, default: 1 },
        },
    ],
});

export default mongoose.model("Cart", cartSchema);
