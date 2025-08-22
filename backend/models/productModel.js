import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number },               // new field
    quantity: { type: Number, default: 0 },    // new field
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    bestseller: { type: Boolean },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'seller', required: true }, // new field
    date: { type: Number, required: true },
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;
