// import React, { useEffect, useState } from "react";
// import AdminLayout from "/src/components/Layouts/AdminLayout"; // NEW layout for admin

// const AdminDashboard = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const token = localStorage.getItem("token");

//   const fetchUsers = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/admin/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || "Forbidden access");
//       }

//       const data = await res.json();
//       if (!Array.isArray(data)) throw new Error("Invalid user data format");
//       setUsers(data);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message || "Failed to fetch users");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const toggleBlockUser = async (id) => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/admin/block/${id}`, {
//         method: "PUT",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error("Failed to update user status");

//       const data = await res.json();
//       setUsers((prev) =>
//         prev.map((user) => (user._id === id ? { ...user, isBlocked: data.isBlocked } : user))
//       );
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const deleteUser = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this user?")) return;
//     try {
//       const res = await fetch(`http://localhost:5000/api/admin/delete/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to delete user");
//       setUsers((prev) => prev.filter((user) => user._id !== id));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <AdminLayout>
//       <div className="p-6 max-w-6xl mx-auto">
//         <h1 className="text-2xl font-semibold text-[#875cf5] mb-6">Admin Dashboard</h1>
//         {loading ? (
//           <p>Loading users...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : (
//           <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-100">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blocked</th>
//                   <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {users.map((user) => (
//                   <tr key={user._id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {user.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {user.isBlocked ? "Yes" : "No"}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
//                       <button
//                         onClick={() => toggleBlockUser(user._id)}
//                         className={`px-3 py-1 rounded text-white text-xs font-semibold transition ${
//                           user.isBlocked
//                             ? "bg-green-500 hover:bg-green-600"
//                             : "bg-yellow-500 hover:bg-yellow-600"
//                         }`}
//                       >
//                         {user.isBlocked ? "Unblock" : "Block"}
//                       </button>
//                       <button
//                         onClick={() => deleteUser(user._id)}
//                         className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-xs font-semibold"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </AdminLayout>
//   );
// };

// export default AdminDashboard;



import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // Fetch users on mount
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("❌ Failed to fetch users:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlockUser = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/block/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, isBlocked: data.blocked } : user
        )
      );
    } catch (err) {
      console.error("❌ Failed to toggle user block status:", err.message);
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:5000/api/admin/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.error("❌ Failed to delete user:", err.message);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-[#875cf5] mb-6">User Management</h1>

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden border">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-600">
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Blocked</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="text-sm">
                      <td className="px-6 py-3 font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-3">{user.email}</td>
                      <td className="px-6 py-3">{user.isBlocked ? "Yes" : "No"}</td>
                      <td className="px-6 py-3 text-right space-x-2">
                        <button
                          onClick={() => toggleBlockUser(user._id)}
                          className={`px-3 py-1 rounded text-white text-xs font-semibold ${
                            user.isBlocked ? "bg-green-500" : "bg-yellow-500"
                          } hover:opacity-90 transition`}
                        >
                          {user.isBlocked ? "Unblock" : "Block"}
                        </button>
                        <button
                          onClick={() => deleteUser(user._id)}
                          className="px-3 py-1 rounded bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
export default AdminDashboard;
