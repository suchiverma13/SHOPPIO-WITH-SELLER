import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import Add from "./pages/Add";
import List from "./pages/List";
import Orders from "./pages/Orders";
import SellerAuth from "./pages/SellerAuth";
import SellerCancelledOrders from "./pages/SellerCancelledOrders";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = "₹";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("sellerToken") || "");
  const [sellerId, setSellerId] = useState("");
  const [loadingSeller, setLoadingSeller] = useState(true);

  useEffect(() => {
    if (token) localStorage.setItem("sellerToken", token);
    else localStorage.removeItem("sellerToken");
  }, [token]);

  useEffect(() => {
    const fetchSellerId = async () => {
      if (!token) return setLoadingSeller(false);
      try {
        const response = await axios.get(`${backendUrl}/api/product/adminlist`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success && response.data.products.length > 0) {
          setSellerId(response.data.products[0].sellerId);
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      } finally {
        setLoadingSeller(false);
      }
    };
    fetchSellerId();
  }, [token]);

  if (!token)
    return (
      <>
        <ToastContainer />
        <Routes>
          <Route path="*" element={<SellerAuth />} />
        </Routes>
      </>
    );

  if (loadingSeller)
    return (
      <p className="text-gray-600 p-6 text-center">Loading seller info...</p>
    );

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <ToastContainer />
      <Navbar setToken={setToken} />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/add" />} />
            <Route path="/add" element={<Add token={token} />} />
            <Route
              path="/list"
              element={<List token={token} setSellerId={setSellerId} />}
            />
            <Route
              path="/orders"
              element={<Orders token={token} sellerId={sellerId} />}
            />
            <Route
              path="/cancelled-orders"
              element={
                <SellerCancelledOrders token={token} sellerId={sellerId} />
              }
            />
            <Route path="*" element={<Navigate to="/add" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
