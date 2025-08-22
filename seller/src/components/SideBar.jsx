import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const menuItems = [
    { name: "Add Items", icon: assets.add_icon, path: "/add" },
    { name: "List Items", icon: assets.order_icon, path: "/list" },
    { name: "Orders", icon: assets.order_icon, path: "/orders" },
   
  ];

  return (
    <aside
      className={`bg-gradient-to-b from-blue-600 to-blue-500 text-white h-screen transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col items-center pt-6">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mb-8 text-white hover:text-gray-300 transition"
        >
          {collapsed ? "☰" : "✕"}
        </button>
        <nav className="flex flex-col gap-4 w-full">
          {menuItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-6 py-3 transition rounded-md ${
                  isActive ? "bg-white text-blue-600" : "hover:bg-blue-400/30"
                }`
              }
            >
              <img src={item.icon} className="w-5 h-5" alt={item.name} />
              {!collapsed && <span className="font-medium">{item.name}</span>}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default SideBar;
