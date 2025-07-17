import React, { useEffect, useState } from "react";
import MainLayout from "/src/components/Layouts/MainLayout";
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
  LineChart,
  Line,
} from "recharts";
import { easeCubicOut } from "d3-ease";

const Home = () => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [incRes, expRes] = await Promise.all([
          fetch("http://localhost:5000/api/income", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:5000/api/expense", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        const incData = await incRes.json();
        const expData = await expRes.json();
        setIncomes(incData);
        setExpenses(expData);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [token]);

  const totalIncome = incomes.reduce((acc, cur) => acc + Number(cur.amount), 0);
  const totalExpense = expenses.reduce(
    (acc, cur) => acc + Number(cur.amount),
    0
  );
  const balance = totalIncome - totalExpense;

  const barData = [
    { name: "Income", amount: totalIncome },
    { name: "Expense", amount: totalExpense },
  ];

  const pieData = expenses.reduce((acc, curr) => {
    const found = acc.find((item) => item.name === curr.category);
    if (found) {
      found.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  const lineData = [
    { name: "Start", balance: 0 },
    { name: "Now", balance },
  ];

  const recentTransactions = [
    ...incomes.map((item) => ({ ...item, type: "income" })),
    ...expenses.map((item) => ({ ...item, type: "expense" })),
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <MainLayout>
      <div className="p-6 max-w-6xl mx-auto min-h-screen">
      {/* <div className="min-h-screen px-6 py-6"> */}

        <h1 className="text-2xl font-semibold text-[#875cf5] mb-6">
          Dashboard Overview
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <Card title="Total Balance" value={`₹${balance}`} color="#875cf5" />
          <Card title="Total Income" value={`₹${totalIncome}`} color="green" />
          <Card title="Total Expenses" value={`₹${totalExpense}`} color="red" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 w-full">
          <ChartBox title="Income vs Expense">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData} barCategoryGap={30}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="amount"
                  fill="#875cf5"
                  barSize={25}
                  animationBegin={0}
                  animationDuration={2000}
                  animationEasing="ease-in-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>

          <ChartBox title="Expenses by Category">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  animationBegin={0}
                  animationDuration={2000}
                  isAnimationActive={true}
                  animationEasing={easeCubicOut}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        ["#875cf5", "#f87171", "#34d399", "#fbbf24", "#60a5fa"][
                          index % 5
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartBox>

          <div className="md:col-span-2">
            <ChartBox title="Balance Over Time">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#875cf5"
                    strokeWidth={3}
                    animationBegin={0}
                    animationDuration={2000}
                    isAnimationActive={true}
                    animationEasing="ease-in-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartBox>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100 mt-10">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Recent Transactions
          </h2>
          {recentTransactions.length === 0 ? (
            <p className="text-slate-600 text-sm">No recent transactions.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentTransactions.map((txn, idx) => (
                <li
                  key={idx}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <p className="text-slate-700 font-medium">
                      {txn.type === "income" ? txn.source : txn.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {txn.type.toUpperCase()}
                    </p>
                  </div>
                  <span
                    className={`font-semibold ${
                      txn.type === "income" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    ₹{txn.amount}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;

const Card = ({ title, value, color }) => (
  <div className="bg-white p-5 rounded-lg shadow-md border border-gray-100 hover:scale-105 transition-transform duration-300">
    <h2 className="text-slate-700 text-sm">{title}</h2>
    <p
      className={`text-xl font-bold ${
        color === "green"
          ? "text-green-500"
          : color === "red"
          ? "text-red-500"
          : "text-[#875cf5]"
      } mt-1`}
    >
      {value}
    </p>
  </div>
);

const ChartBox = ({ title, children }) => (
  <div className="bg-white p-4 rounded-lg shadow-md border">
    <h3 className="text-slate-700 font-semibold text-lg mb-3">{title}</h3>
    {children}
  </div>
);
