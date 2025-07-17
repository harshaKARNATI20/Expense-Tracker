// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import AdminSidebar from "../AdminSidebar";

// const AdminLayout = ({ children }) => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/admin/login");
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Sidebar */}
//       <aside className="w-64 bg-[#875cf5] text-white p-5">
//         <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
//         <nav className="flex flex-col space-y-4">
//           <Link to="/admin/dashboard" className="hover:underline">
//             User Management
//           </Link>
//           <Link to="/admin/analytics" className="hover:underline">
//             Analytics
//           </Link>
//           <button
//             onClick={handleLogout}
//             className="mt-6 bg-white text-[#875cf5] px-4 py-2 rounded hover:bg-gray-200"
//           >
//             Logout
//           </button>
//         </nav>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 bg-gray-50 p-6 overflow-auto">{children}</main>
//     </div>
//   );
// };

// export default AdminLayout;

""// src/components/Layouts/AdminLayout.jsx

// import React from "react";
// import AdminSidebar from "../AdminSidebar";

// const AdminLayout = ({ children }) => {
//   return (
//     <div className="min-h-screen flex bg-gray-100">
//       {/* Sidebar */}
//       <AdminSidebar />

//       {/* Main Content */}
//       <main className="flex-1 p-4 md:p-6 overflow-y-auto">
//         {children}
//       </main>
//     </div>
//   );
// };

// export default AdminLayout;

import React from "react";
import AdminSidebar from "../AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar (static width) */}
      <div className="hidden md:block w-60 h-full">
        <AdminSidebar />
      </div>

      {/* Main content with scrollable area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
