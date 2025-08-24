import Product from "../models/productModel.js"; // ✅ correct import
import Cart from "../models/cartModel.js";
// correct path check kare   // agar cart schema alag file me hai

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    const authData = req.auth();   // ✅
    const userId = authData.userId;

    const { productId, size, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    // Check if product already exists in cart
    const existingProduct = cart.products.find(
      (item) =>
        item.productId.toString() === productId &&
        item.size === size
    );

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({ productId, size, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

export const getUserCart = async (req, res) => {
  try {
    // Use req.auth() instead of req.auth
    const auth = req.auth(); // function call
    const userId = auth.userId; // ya auth.user.id, Clerk docs ke according

    if (!userId) return res.status(400).json({ message: "User ID missing" });

    const cart = await Cart.findOne({ userId }).populate("products.productId");
    res.json({ cart });
  } catch (err) {
    console.error("Cart error:", err);
    res.status(500).json({ message: err.message });
  }
};
// Update Cart (quantity change)
export const updateCart = async (req, res) => {
  try {
    const authData = req.auth();
    const userId = authData.userId;
    const { productId, size, quantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.products.find(
      (p) => p.productId.toString() === productId && p.size === size
    );

    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    if (quantity > 0) {
      item.quantity = quantity; // update quantity
    } else {
      // Remove item if quantity <= 0
      cart.products = cart.products.filter(
        (p) => !(p.productId.toString() === productId && p.size === size)
      );
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    res.status(500).json({ message: "Error updating cart", error });
  }
};
