import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: { type: String }, // Clerk userId as _id
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
