import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const sellerSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    shopName: { type: String, required: true },
    gst: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isApproved: { type: Boolean, default: false }, // 👈 consistent naam
  },
  { timestamps: true }
);

// Password hashing
sellerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // ✅ return lagao
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});


// Password check
sellerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
