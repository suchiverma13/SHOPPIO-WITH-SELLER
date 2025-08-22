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

  // Toggle password visibility
  const togglePassword = () => setShowPassword(!showPassword);

  // Login handler
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
      console.error(err);
      // Check if backend sent a message
      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message); // show "Wait for admin approval"
      } else {
        alert("Something went wrong");
      }
    }
  };

  // Signup handler
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
        alert(
          "Signup request sent! Wait for admin approval before logging in."
        );
        setActiveTab("login");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        {/* Tabs */}
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 ${
              activeTab === "login"
                ? "border-b-2 border-blue-600 font-bold"
                : ""
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 ${
              activeTab === "signup"
                ? "border-b-2 border-blue-600 font-bold"
                : ""
            }`}
            onClick={() => setActiveTab("signup")}
          >
            Signup
          </button>
        </div>

        {/* Login Form */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-2 border rounded"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <span
                className="absolute right-2 top-2 cursor-pointer text-gray-500"
                onClick={togglePassword}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        )}

        {/* Signup Form */}
        {activeTab === "signup" && (
          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Owner Name"
              className="w-full p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Shop Name"
              className="w-full p-2 border rounded"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="GST Number"
              className="w-full p-2 border rounded"
              value={gst}
              onChange={(e) => setGst(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-2 border rounded"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
              />
              <span
                className="absolute right-2 top-2 cursor-pointer text-gray-500"
                onClick={togglePassword}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
