import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";

const SellerAuth = () => {
  const [activeTab, setActiveTab] = useState("login"); // login / signup
  const [showPassword, setShowPassword] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [gst, setGst] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/seller/login`, {
        email: loginEmail,
        password: loginPassword,
      });

      if (data.success) {
        localStorage.setItem("sellerToken", data.token);
        alert("Login successful");
        window.location.href = "/seller/dashboard";
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${backendUrl}/seller/signup`, {
        name,
        shopName,
        gst,
        email: signupEmail,
        password: signupPassword,
      });

      if (data.success) {
        alert("Signup request sent! Wait for admin approval.");
        setActiveTab("login");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-0">
      {/* Welcome Message */}
      <div className="w-full max-w-md text-center mb-4 sm:mb-6 p-4 sm:p-6 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-md">
        <h1 className="text-xl sm:text-2xl font-bold">Welcome to Seller Dashboard!</h1>
        <p className="text-sm sm:text-base mt-1">Manage products, track orders & grow your business.</p>
      </div>

      {/* Login/Signup Box */}
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 sm:p-8">
        {/* Tabs */}
        <div className="flex mb-4 sm:mb-6">
          <button
            className={`flex-1 py-2 sm:py-3 ${
              activeTab === "login" ? "border-b-2 border-blue-600 font-bold" : ""
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 sm:py-3 ${
              activeTab === "signup" ? "border-b-2 border-blue-600 font-bold" : ""
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Signup
          </button>
        </div>

        {/* Login Form */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 sm:p-3 border rounded"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-2 sm:p-3 border rounded"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <span
                className="absolute right-2 top-2 sm:top-3 cursor-pointer text-gray-500"
                onClick={togglePassword}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            <button
              type="submit"
              className="w-full py-2 sm:py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
        )}

        {/* Signup Form */}
        {activeTab === "signup" && (
          <form onSubmit={handleSignup} className="space-y-3 sm:space-y-4">
            <input
              type="text"
              placeholder="Owner Name"
              className="w-full p-2 sm:p-3 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Shop Name"
              className="w-full p-2 sm:p-3 border rounded"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="GST Number"
              className="w-full p-2 sm:p-3 border rounded"
              value={gst}
              onChange={(e) => setGst(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 sm:p-3 border rounded"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-2 sm:p-3 border rounded"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
              <span
                className="absolute right-2 top-2 sm:top-3 cursor-pointer text-gray-500"
                onClick={togglePassword}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            <button
              type="submit"
              className="w-full py-2 sm:py-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Signup
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SellerAuth;
