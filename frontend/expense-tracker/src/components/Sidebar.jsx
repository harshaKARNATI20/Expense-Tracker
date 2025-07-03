import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaMoneyBillWave, FaChartPie, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <FaHome /> },
    { name: 'Income', path: '/dashboard/income', icon: <FaMoneyBillWave /> },
    { name: 'Expense', path: '/dashboard/expense', icon: <FaChartPie /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="h-screen bg-[#875cf5] text-white p-4 w-60 flex flex-col fixed top-0 left-0 z-10">
      <div className="text-2xl font-bold mb-8 tracking-wide">💸 Expense Tracker</div>

      <nav className="flex-1 space-y-2">
        {links.map(({ name, path, icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive ? 'bg-white text-[#875cf5] font-semibold' : 'hover:bg-[#7649d4]'
              }`
            }
          >
            {icon} {name}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition"
      >
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
