import axios from "axios";
import { createContext, useEffect, useState } from "react";
import React from "react";

import { useAsyncError, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopeContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 49;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const addToCart = async (productId, size = "default") => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not logged in");

      const response = await axios.post(
        `${backendUrl}/api/cart/add`,
        { itemId: productId, size },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Added to cart:", response.data);

      // Update cartItems state
      setCartItems((prevCart) => {
        const updatedCart = structuredClone(prevCart);
        if (!updatedCart[productId]) updatedCart[productId] = {};
        if (!updatedCart[productId][size]) updatedCart[productId][size] = 0;
        updatedCart[productId][size] += 1;
        return updatedCart;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalCount;
  };
  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    if (quantity <= 0) {
      // Remove the size entry
      delete cartData[itemId][size];
      // If no more sizes exist for this product, remove the product entry
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (!itemInfo) continue; // <-- skip if product not found
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item]) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalAmount;
  };

  const getProductData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (tokenArg) => {
    const tokenToUse = tokenArg || localStorage.getItem("token");
    if (!tokenToUse) return;

    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { Authorization: `Bearer ${tokenToUse}` } }
      );
      if (response.data.success) setCartItems(response.data.cartData);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getProductData();
  }, []);

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      setToken(localToken);
      getUserCart(localToken);
    }
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
  };
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopeContextProvider;
