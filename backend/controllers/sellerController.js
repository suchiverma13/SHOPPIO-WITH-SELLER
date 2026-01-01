import Seller from "../models/sellerModel.js";
import jwt from "jsonwebtoken";

// JWT token generate with role
const generateToken = (seller) =>
  jwt.sign(
    { id: seller._id, role: "seller" }, // role included
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

// Signup
export const signupSeller = async (req, res) => {
  const { name, shopName, gst, email, password } = req.body;
  try {
    const sellerExists = await Seller.findOne({ email });
    if (sellerExists) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }

    const seller = await Seller.create({
      name,
      shopName,
      gst,
      email,
      password,
      isApproved: false,
    });

    res.status(201).json({ success: true, message: "Seller registered successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const loginSeller = async (req, res) => {
  const { email, password } = req.body;
  try {
    const seller = await Seller.findOne({ email });
    if (seller && (await seller.matchPassword(password))) {
      if (!seller.isApproved) { // 👈 consistent
        return res.status(401).json({ success: false, message: "Wait for admin approval" });
      }
      res.json({ success: true, token: generateToken(seller) });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().sort({ createdAt: -1 });
    res.json({ success: true, sellers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSellerStatus = async (req, res) => {
  try {
    const { sellerId, isApproved } = req.body;
    await Seller.findByIdAndUpdate(sellerId, { isApproved });
    res.json({ success: true, message: "Seller status updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSeller = async (req, res) => {
  try {
    const { sellerId } = req.params; // 👈 ensure ye same name ho
    const seller = await Seller.findByIdAndDelete(sellerId);
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }
    res.json({ success: true, message: "Seller deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

