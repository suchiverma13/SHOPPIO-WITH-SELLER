import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { UserButton, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, cartItems, setCartItems, setUserOrders } = useContext(ShopContext);
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

  const logout = () => {
    setCartItems({});
    setUserOrders([]);
    navigate("/login");
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
          <button
            onClick={() =>
              window.open("https://shoppio-2o-seller.vercel.app", "_blank")
            }
            className="p-2 border rounded-full px-5 text-gray-900 hover:bg-gray-100 transition"
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

          {/* Orders */}
          <SignedIn>
            <Link
              to="/orders"
              className="hidden sm:block text-gray-700 hover:text-blue-500 transition"
            >
              My Orders
            </Link>
          </SignedIn>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <img src={assets.cart_icon} className="w-5" alt="Cart Icon" />
            {getTotalCartItems() > 0 && (
              <span className="absolute -right-2 -bottom-2 w-4 h-4 text-[8px] leading-4 bg-blue-500 text-white rounded-full flex items-center justify-center">
                {getTotalCartItems()}
              </span>
            )}
          </Link>

          {/* Mobile Menu */}
          <img
            onClick={() => setVisible(true)}
            src={assets.menu_icon}
            className="w-5 cursor-pointer sm:hidden"
            alt="Menu"
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {visible && (
        <>
          <div
            onClick={() => setVisible(false)}
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          ></div>
          <div className="fixed top-0 right-0 h-[60vh] w-70 md:w-96 bg-white/80 backdrop-blur-md z-50 shadow-lg p-6 rounded-l-2xl flex flex-col">
            <div
              onClick={() => setVisible(false)}
              className="flex items-center gap-3 p-3 border-b border-gray-200 cursor-pointer"
            >
              <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="Close" />
              <p className="font-bold">Close</p>
            </div>

            <nav className="flex flex-col mt-4 gap-3">
              {["/", "/collections", "/about", "/contact"].map((path, idx) => (
                <NavLink
                  key={idx}
                  onClick={() => setVisible(false)}
                  to={path}
                  className="py-3 px-4 hover:bg-gray-100 rounded transition-colors"
                >
                  {["Home", "Collection", "About", "Contact"][idx]}
                </NavLink>
              ))}
              <button
                onClick={() =>
                  window.open("https://shoppio-2o-seller.vercel.app", "_blank")
                }
                className="p-2 border rounded-full px-5 text-gray-900 hover:bg-gray-100 transition"
              >
                BECOME SELLER
              </button>
            </nav>

            <div className="mt-auto">
              <SignedIn>
                <button
                  onClick={logout}
                  className="w-full py-3 rounded-xl bg-gray-900 text-white font-medium"
                >
                  Logout
                </button>
              </SignedIn>
              <SignedOut>
                <button
                  onClick={() => {
                    setVisible(false);
                    navigate("/login");
                  }}
                  className="w-full py-3 rounded-xl border border-gray-300 font-medium"
                >
                  Login
                </button>
              </SignedOut>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
