import { request } from "express";
import userModel from "../models/userModel.js";


// Add Products to user Cart
// Add Products to user Cart
const addToCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;        // frontend sends itemId (productId) and size
    const userId = req.userId;                // get from auth middleware

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Similar changes for updateCart and getUserCart

// update user Cart
const updateCart = async (req, res) => {
  try {
    const userId = req.userId; // use auth middleware
    const { itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    if (quantity === 0) {
      // Remove the size
      if (cartData[itemId]) {
        delete cartData[itemId][size];
        // Remove the product if no sizes left
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
    } else {
      // Update or add quantity
      if (!cartData[itemId]) cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart Updated" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//  get user Cart
// cartController.js
const getUserCart = async (req, res) => {
  try {
    const userId = req.userId; // ✅ matches auth middleware
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartData = user.cartData || {};

    res.json({ success: true, cartData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export {
  addToCart,
  updateCart,
  getUserCart,
}


