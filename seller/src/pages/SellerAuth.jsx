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
      const { data } = await axios.post(`${backendUrl}/api/seller/login`, {
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
      const { data } = await axios.post(`${backendUrl}/api/seller/signup`, {
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
      console.error("Signup Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center py-6 px-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-sm sm:text-base mt-2">
            Manage products, track orders & grow your business 🚀
          </p>
        </div>

        {/* Tabs */}
        <div className="flex">
          <button
            className={`flex-1 py-3 font-medium transition ${
              activeTab === "login"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-3 font-medium transition ${
              activeTab === "signup"
                ? "bg-green-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Signup
          </button>
        </div>

        {/* Forms */}
        <div className="p-6 sm:p-8">
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  onClick={togglePassword}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </button>
            </form>
          )}

          {activeTab === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <input
                type="text"
                placeholder="Owner Name"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Shop Name"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="GST Number"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  onClick={togglePassword}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Signup
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerAuth;
