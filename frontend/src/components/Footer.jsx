import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="container mx-auto px-6 sm:px-10 py-12 grid grid-cols-1 sm:grid-cols-3 gap-12 text-gray-700">
        
        {/* Logo & About */}
        <div>
          <img src={assets.logo} className="mb-5 w-36" alt="Forever Logo" />
          <p className="text-gray-600 leading-relaxed">
            Your go-to destination for premium fashion. Shop the latest trends with fast delivery and easy returns.
          </p>
        </div>

        {/* Company Links */}
        <div>
          <p className="text-lg font-semibold mb-4">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li><Link to="/" className="hover:text-pink-500 transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-pink-500 transition">About Us</Link></li>
            <li><Link to="/delivery" className="hover:text-pink-500 transition">Delivery</Link></li>
            <li><Link to="/privacy" className="hover:text-pink-500 transition">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <p className="text-lg font-semibold mb-4">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>📞 +91 8123456719</li>
            <li>📧 example@gmail.com</li>
            <li>📍 New Delhi, India</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 py-5 text-center text-sm text-gray-500">
        © 2024 Shoppio.com - All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
