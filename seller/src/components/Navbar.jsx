import React from "react";
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white shadow-lg sticky top-0 z-50 rounded-b-xl">
      <img src={assets.logo} className="w-28 sm:w-32" alt="Logo" />
      <button
        onClick={() => setToken("")}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-full transition shadow-md hover:shadow-lg"
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;
