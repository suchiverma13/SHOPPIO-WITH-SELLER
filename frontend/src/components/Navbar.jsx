import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { UserButton, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, cartItems, setCartItems, setUserOrders } =
    useContext(ShopContext);
  const navigate = useNavigate();
  const { user } = useUser(); // Clerk user info

  const getTotalCartItems = () => {
    let total = 0;
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) total += cartItems[itemId][size];
      }
    }
    return total;
  };

  
  return (
    <div className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md shadow-sm">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between py-3 px-4 sm:px-5">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={assets.logo} className="h-6 sm:h-5" alt="Logo" />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden sm:flex gap-8 text-sm font-medium text-gray-700 items-center">
          {["/", "/collections", "/about", "/contact"].map((path, idx) => (
            <NavLink
              key={idx}
              to={path}
              className={({ isActive }) =>
                `p-2 transition-colors duration-300 ${
                  isActive ? "text-blue-500" : "text-gray-600"
                }`
              }
            >
              {["HOME", "COLLECTION", "ABOUT", "CONTACT"][idx]}
            </NavLink>
          ))}
          <SignedIn>
            <Link
              to="/orders"
              className="text-gray-700 hover:text-blue-500 transition"
            >
              My Orders
            </Link>
          </SignedIn>
          <button
            onClick={() =>
              window.open("https://shoppio-2o-seller.vercel.app", "_blank")
            }
            className="p-2 border rounded-full px-5 font-medium text-white 
  bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 transition"
          >
            BECOME SELLER
          </button>
        </ul>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Search */}
          <img
            onClick={() => setShowSearch(true)}
            src={assets.search_icon}
            className="w-5 cursor-pointer"
            alt="Search Icon"
          />

          {/* Profile */}
          <div className="relative flex items-center">
            <SignedIn>
              <UserButton afterSignOutUrl="/login" />
            </SignedIn>
            <SignedOut>
              <button
                onClick={() => navigate("/login")}
                className="py-1 px-3 border rounded text-gray-700 hover:bg-gray-100 transition"
              >
                Login
              </button>
            </SignedOut>
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5" alt="Cart Icon" />
            {getTotalCartItems() > 0 && (
              <span className="absolute -right-2 -bottom-2 w-4 h-4 text-[8px] leading-4 bg-blue-500 text-white rounded-full flex items-center justify-center">
                {getTotalCartItems()}
              </span>
            )}
          </Link>

          {/* Mobile Menu Icon (sirf phone view me) */}
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            className="w-5 cursor-pointer sm:hidden"
            alt="Menu"
          />
        </div>
      </div>

      {/* Mobile Menu (sirf phone view me) */}
      {visible && (
        <div className="fixed top-0 right-0 h-[100] w-72 bg-white shadow-lg z-50 p-6 rounded-l-2xl flex flex-col sm:hidden">
          {/* Close */}
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-3 p-3 border-b border-gray-200 cursor-pointer"
          >
            <img
              className="h-4 rotate-180"
              src={assets.dropdown_icon}
              alt="Close"
            />
            <p className="font-bold">Close</p>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col mt-4 gap-3">
            {["/", "/collections", "/about", "/contact"].map((path, idx) => (
              <NavLink
                key={idx}
                onClick={() => setVisible(false)}
                to={path}
                className={({ isActive }) =>
                  `py-3 px-4 rounded transition-colors 
      ${
        isActive
          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
          : "bg-gray-50 hover:bg-gray-100"
      }`
                }
              >
                {["Home", "Collection", "About", "Contact"][idx]}
              </NavLink>
            ))}

            <SignedIn>
              <NavLink
                to="/orders"
                onClick={() => setVisible(false)}
                className={({ isActive }) =>
                  `py-3 px-4 rounded transition-colors 
      ${
        isActive
          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
          : "bg-gray-50 hover:bg-gray-100"
      }`
                }
              >
                My Orders
              </NavLink>
            </SignedIn>

            <button
              onClick={() =>
                window.open("https://shoppio-2o-seller.vercel.app", "_blank")
              }
              className="p-2 border rounded-full px-5 font-medium text-white 
  bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 transition"
            >
              BECOME SELLER
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Navbar;
