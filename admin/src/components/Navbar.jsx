import React from "react";
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-gradient-to-r bg-amber-50 shadow-md sticky top-0 z-50">
      {/* Logo */}
      <img src={assets.logo} className="w-24 sm:w-32" alt="Logo" />

      {/* Logout Button */}
      <button
        onClick={() => setToken("")}
        className="cursor-pointer bg-white text-pink-600 px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow hover:shadow-lg transition duration-200"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;
