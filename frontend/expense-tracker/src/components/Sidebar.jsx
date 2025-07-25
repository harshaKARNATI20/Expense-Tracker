import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaHome,
  FaMoneyBillWave,
  FaChartPie,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // For mobile menu

  const links = [
    { name: "Dashboard", path: "/dashboard/home", icon: <FaHome /> },
    { name: "Income", path: "/dashboard/income", icon: <FaMoneyBillWave /> },
    { name: "Expense", path: "/dashboard/expense", icon: <FaChartPie /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-white bg-[#875cf5] p-2 rounded shadow"
        onClick={() => setIsOpen(true)}
      >
        <FaBars size={20} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-60 bg-[#875cf5] text-white p-4 flex flex-col justify-between z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:flex`}
      >
        {/* Mobile close icon */}
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setIsOpen(false)} className="text-white">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Brand */}
        <div className="text-2xl font-bold mb-8 tracking-wide">
          💸 Expense Tracker
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto">
          {links.map(({ name, path, icon }) => {
            const isActive = location.pathname === path;
            return (
              <NavLink
                key={name}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-white text-[#875cf5] font-semibold"
                    : "hover:bg-[#7649d4]"
                }`}
              >
                {icon} {name}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-3 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Background overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
