
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";

export const ShopContext = createContext();
const delivery_fee = 49;
const currency = "Rs.";
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const ShopContextProvider = ({ children }) => {
  const { getToken, isSignedIn } = useAuth();

  const [token, setToken] = useState("");
  const [cartItems, setCartItems] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");   // ✅ add this line
  const [products, setProducts] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  // Fetch Clerk token + user cart
  // ShopContext.jsx me useEffect ke andar
  useEffect(() => {
    const fetchCart = async () => {
      if (isSignedIn) {
        try {
          const clerkToken = await getToken(); // ✅ fixed
          setToken(clerkToken);
          await getUserCart(clerkToken);
        } catch (err) {
          console.error(err);
          setCartItems({});
          setLoadingCart(false);
        }
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "{}");
        setCartItems(guestCart);
        setLoadingCart(false);
      }
    };
    fetchCart();
  }, [isSignedIn, getToken]);

  // Fetch products
  const getProducts = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/product/list`);
      setProducts(data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products");
    }
  };

  // Fetch user cart
  const getUserCart = async (clerkToken) => {
    try {
      const res = await axios.get(`${backendUrl}/api/cart/get`, {
        headers: { Authorization: `Bearer ${clerkToken}` },
      });
      const cartData = res.data.cart?.products || [];
      const structuredCart = {};
      cartData.forEach((item) => {
        if (!structuredCart[item.productId._id])
          structuredCart[item.productId._id] = {};
        structuredCart[item.productId._id][item.size || "default"] =
          item.quantity;
      });
      setCartItems(structuredCart);
    } catch (err) {
      console.error("Error fetching cart:", err.response?.data || err.message);
      setCartItems({});
    } finally {
      setLoadingCart(false);
    }
  };

  // Add to cart
  const addToCart = async (productId, size = "default", quantity = 1) => {
    if (!token) {
      // Guest user
      const updated = structuredClone(cartItems);
      if (!updated[productId]) updated[productId] = {};
      updated[productId][size] = (updated[productId][size] || 0) + quantity;
      setCartItems(updated);
      localStorage.setItem("guestCart", JSON.stringify(updated));
      toast.success("Added to cart (Guest)");
      return;
    }
    try {
      await axios.post(
        `${backendUrl}/api/cart/add`,
        { productId, size, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems((prev) => {
        const updated = structuredClone(prev);
        if (!updated[productId]) updated[productId] = {};
        updated[productId][size] = (updated[productId][size] || 0) + quantity;
        return updated;
      });
    } catch (err) {
      console.error(err);
      toast.error("Error adding to cart");
    }
  };
  const removeFromCart = async (
    productId,
    size = "default",
    newQuantity = 0,
    removeAll = false
  ) => {
    if (!token) {
      // Guest logic
      const updated = structuredClone(cartItems);
      if (updated[productId]?.[size]) {
        if (removeAll || newQuantity <= 0) {
          delete updated[productId][size];
        } else {
          updated[productId][size] = newQuantity;
        }
        if (Object.keys(updated[productId]).length === 0)
          delete updated[productId];
      }
      setCartItems(updated);
      localStorage.setItem("guestCart", JSON.stringify(updated));
      return;
    }

    try {
      const qtyToUpdate = removeAll ? 0 : newQuantity;
      await axios.put(
        `${backendUrl}/api/cart/update`,
        { productId, size, quantity: qtyToUpdate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems((prev) => {
        const updated = structuredClone(prev);
        if (updated[productId]?.[size]) {
          if (removeAll || newQuantity <= 0) {
            delete updated[productId][size];
          } else {
            updated[productId][size] = newQuantity;
          }
          if (Object.keys(updated[productId]).length === 0)
            delete updated[productId];
        }
        return updated;
      });
    } catch (err) {
      console.error(err);
      toast.error("Error removing from cart");
    }
  };

  const getCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (product) {
        for (const size in cartItems[itemId]) {
          total += product.price * cartItems[itemId][size];
        }
      }
    }
    return total;
  };

  useEffect(() => {
    getProducts();
  }, []);

   return (
    <ShopContext.Provider
      value={{
        products,
        delivery_fee,
        cartItems,
        addToCart,
        removeFromCart,
        getCartAmount,
        loadingCart,
        token,
        setToken,
        setCartItems,
        currency,
        backendUrl,
        showSearch,
        setShowSearch,
        search,        // ✅ pass search
        setSearch,     // ✅ pass setSearch
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;