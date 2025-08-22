import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const SideBar = () => {
  const menuItems = [
    // { name: "Add Items", icon: assets.add_icon, path: "/add" },
    { name: "All Items ", icon: assets.order_icon, path: "/list" },
    { name: "Approval", icon: assets.order_icon, path: "/sellers" },
  ];

  return (
    <div className="w-64 min-h-screen bg-gray-50 border-r shadow-sm">
      <div className="flex flex-col pt-8">
        <h2 className="text-xl font-bold text-gray-800 px-6 mb-8">Dashboard</h2>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-3 text-gray-600 font-medium transition-all duration-200 
                ${
                  isActive
                    ? "bg-pink-500 text-white rounded-md shadow"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <img src={item.icon} className="w-5 h-5" alt={item.name} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
