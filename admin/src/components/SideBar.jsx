import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Auto collapse for small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setCollapsed(true);
      else setCollapsed(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { name: "All Items", icon: assets.order_icon, path: "/list" },
    { name: "Approval", icon: assets.order_icon, path: "/sellers" },
  ];

  return (
    <aside
      className={`bg-gradient-to-b from-purple-600 via-pink-600 to-red-500 text-white min-h-screen shadow-xl transition-all duration-300 flex flex-col 
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Toggle Button (mobile only) */}
      <div className="flex justify-center p-4 lg:hidden">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white text-xl"
        >
          {collapsed ? "☰" : "✕"}
        </button>
      </div>

      {/* Dashboard Title */}
      {!collapsed && (
        <h2 className="text-2xl font-bold px-6 mt-5 mb-6">Dashboard</h2>
      )}

      {/* Menu */}
      <nav className="flex flex-col gap-2 w-full mt-2">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-3 rounded-lg transition-all duration-300 
              ${
                isActive
                  ? "bg-white text-purple-600 font-semibold shadow-md"
                  : "hover:bg-white/20"
              }`
            }
          >
            <img src={item.icon} className="w-5 h-5" alt={item.name} />
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SideBar;
