import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Auto collapse on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { name: "Add Items", icon: assets.add_icon, path: "/add" },
    { name: "List Items", icon: assets.order_icon, path: "/list" },
    { name: "Orders", icon: assets.order_icon, path: "/orders" },
  ];

  return (
  <aside
  className={`bg-gradient-to-b from-teal-500 via-cyan-500 to-blue-600 text-white min-h-screen transition-all duration-300 flex flex-col
  ${collapsed ? "w-20" : "w-64"}`}
>

      {/* Mobile toggle button */}
      <div className="flex justify-center p-4 lg:hidden">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:text-gray-300 transition"
        >
          {collapsed ? "☰" : "✕"}
        </button>
      </div>

      <nav className="flex flex-col gap-2 w-full mt-4">
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
            {!collapsed && (
              <span className="font-medium text-sm md:text-base">
                {item.name}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default SideBar;
