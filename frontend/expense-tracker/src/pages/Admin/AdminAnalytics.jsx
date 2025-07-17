import React, { useEffect, useState } from "react";
import AdminLayout from "/src/components/Layouts/AdminLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  const fetchAnalytics = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status}: ${text}`);
      }

      const data = await res.json();
      setStats(data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Failed to load analytics:", err);
      setError("Failed to load analytics data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const pieData = [
    { name: "Income", value: stats?.totalIncome || 0 },
    { name: "Expense", value: stats?.totalExpense || 0 },
  ];

  const pieColors = ["#00b894", "#d63031"];

  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-[#875cf5] mb-6">
          Admin Analytics Dashboard
        </h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 🧑 Top 5 Spenders (Raw List) */}
            <div className="bg-white rounded shadow p-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Top 5 Spenders
              </h2>
              {stats.topUsers?.length > 0 ? (
                <ul className="space-y-1">
                  {stats.topUsers.map((user, idx) => (
                    <li key={idx}>
                      {user.name} - ₹
                      {typeof user.totalExpense === "number"
                        ? user.totalExpense.toLocaleString()
                        : 0}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No data available</p>
              )}
            </div>

            {/* 💸 Top Expense Category */}
            <div className="bg-white rounded shadow p-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Top Expense Category
              </h2>
              <p>
                {stats.topCategory?.category || "N/A"} - ₹
                {typeof stats.topCategory?.amount === "number"
                  ? stats.topCategory.amount.toLocaleString()
                  : 0}
              </p>
            </div>

            {/* 📊 Bar Chart: Top 5 Spenders */}
            <div className="bg-white rounded shadow p-4 col-span-full">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Bar Chart: Top 5 Spenders
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.topUsers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="totalExpense" fill="#875cf5" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 🥧 Pie Chart: Income vs Expense */}
            <div className="bg-white rounded shadow p-4 col-span-full">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Pie Chart: Income vs Expense
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={pieColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 📊 Income vs Expense Summary */}
            <div className="bg-white rounded shadow p-4 col-span-full">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                Total Income vs Expense
              </h2>
              <p>
                Income: ₹
                {typeof stats.totalIncome === "number"
                  ? stats.totalIncome.toLocaleString()
                  : 0}
                <br />
                Expense: ₹
                {typeof stats.totalExpense === "number"
                  ? stats.totalExpense.toLocaleString()
                  : 0}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-red-500">No analytics data found</p>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
