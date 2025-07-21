 // src/pages/Dashboard/Expense.jsx

// import React, { useState, useEffect } from "react";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import MainLayout from "../../components/Layouts/MainLayout";

// const Expense = () => {
//   const [expenses, setExpenses] = useState([]);
//   const [name, setName] = useState("");
//   const [amount, setAmount] = useState("");
//   const [category, setCategory] = useState("");
//   const [error, setError] = useState(null);

//   const [categories, setCategories] = useState([]);
//   const [showOtherInput, setShowOtherInput] = useState(false);
//   const [newCategory, setNewCategory] = useState("");

//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchCategories = async () => {
//       const res = await fetch("http://localhost:5000/api/category", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setCategories(data);
//     };
//     fetchCategories();
//   }, [token]);

//   const handleCategoryChange = (e) => {
//     if (e.target.value === "other") {
//       setShowOtherInput(true);
//       setCategory("");
//     } else {
//       setCategory(e.target.value);
//       setShowOtherInput(false);
//     }
//   };

//   const handleAddCategory = async () => {
//     if (!newCategory.trim()) return;

//     try {
//       const res = await fetch("http://localhost:5000/api/category", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ name: newCategory }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || "Failed to add category");
//       }

//       const newCat = await res.json();

//       // Avoid duplicates
//       const exists = categories.find((cat) => cat.name === newCat.name);
//       if (!exists) setCategories([...categories, newCat]);

//       // Set the category to newly added one
//       setCategory(newCat.name);
//       setNewCategory("");
//       setShowOtherInput(false);
//     } catch (err) {
//       console.error("Error adding category:", err.message);
//     }
//   };

//   // ✅ Fetch expenses from backend
//   const fetchExpenses = async () => {
//     try {
//       const res = await fetch("http://localhost:5000/api/expense", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) throw new Error("Failed to fetch expenses");
//       const data = await res.json();
//       setExpenses(data);
//     } catch (err) {
//       console.error(err);
//       setError("Error fetching expenses");
//     }
//   };

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   // ✅ Add new expense
//   // const addExpense = async () => {
//   //   if (showOtherInput && !category) {
//   //     setError("Please finish adding the category and select it.");
//   //     return;
//   //   }

//   //   if (!name || !amount || !category) {
//   //     setError("All fields are required.");
//   //     return;
//   //   }

//   //   if (isNaN(amount) || Number(amount) <= 0) {
//   //     setError("Amount must be a positive number.");
//   //     return;
//   //   }

//   //   try {
//   //     const res = await fetch("http://localhost:5000/api/expense", {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //         Authorization: `Bearer ${token}`,
//   //       },
//   //       body: JSON.stringify({ name, amount, category }),
//   //     });

//   //     if (!res.ok) throw new Error("Failed to add expense");

//   //     const newExpense = await res.json();
//   //     setExpenses([newExpense, ...expenses]);

//   //     // Clear form
//   //     setName("");
//   //     setAmount("");
//   //     setCategory("");
//   //     setError(null);
//   //   } catch (err) {
//   //     console.error(err);
//   //     setError("Failed to add expense");
//   //   }
//   // };

//   const addExpense = async () => {
//     if (showOtherInput && !category) {
//       setError("Please finish adding the category and select it.");
//       return;
//     }

//     if (!name || !amount || !category) {
//       setError("All fields are required.");
//       return;
//     }

//     if (isNaN(amount) || Number(amount) <= 0) {
//       setError("Amount must be a positive number.");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/expense", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ name, amount, category }),
//       });

//       if (!res.ok) throw new Error("Failed to add expense");

//       const newExpense = await res.json();
//       setExpenses([newExpense, ...expenses]);

//       // Clear form
//       setName("");
//       setAmount("");
//       setCategory("");
//       setNewCategory(""); // clear "other" input as well
//       setShowOtherInput(false); // Reset
//       setError(null);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to add expense");
//     }
//   };

//   // ✅ Delete expense
//   const deleteExpense = async (id) => {
//     try {
//       const res = await fetch(`http://localhost:5000/api/expense/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!res.ok) throw new Error("Failed to delete expense");

//       setExpenses(expenses.filter((exp) => exp._id !== id));
//     } catch (err) {
//       console.error(err);
//       setError("Failed to delete expense");
//     }
//   };

//   // ✅ Export to Excel
//   const exportToExcel = () => {
//     const ws = XLSX.utils.json_to_sheet(expenses);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, "Expenses");
//     const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     saveAs(
//       new Blob([buffer], { type: "application/octet-stream" }),
//       "expense_report.xlsx"
//     );
//   };

//   return (
//     <MainLayout>
//       <div className="p-6 max-w-2xl mx-auto">
//         <h1 className="text-2xl font-semibold text-[#875cf5] mb-6">
//           Expense Management
//         </h1>

//         {/* Form */}
//         <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
//           <div className="mb-3">
//             <label className="text-sm text-slate-700 font-medium">Name</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="input-box w-full"
//               placeholder="e.g. Groceries"
//             />
//           </div>
//           <div className="mb-3">
//             <label className="text-sm text-slate-700 font-medium">
//               Amount (₹)
//             </label>
//             <input
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               className="input-box w-full"
//               placeholder="e.g. 1500"
//             />
//           </div>
//           <div className="mb-3">
//             <label className="text-sm text-slate-700 font-medium">
//               Category
//             </label>
//             <select
//               value={category}
//               onChange={handleCategoryChange}
//               className="input-box w-full"
//             >
//               <option value="">Select category</option>
//               {categories.map((cat) => (
//                 <option key={cat._id} value={cat.name}>
//                   {cat.name}
//                 </option>
//               ))}
//               <option value="other">Other</option>
//             </select>

//             {showOtherInput && (
//               <div className="flex gap-2 mt-2">
//                 <input
//                   type="text"
//                   value={newCategory}
//                   onChange={(e) => setNewCategory(e.target.value)}
//                   placeholder="New category"
//                   className="input-box flex-1"
//                 />
//                 <button
//                   onClick={handleAddCategory}
//                   className="bg-[#875cf5] text-white px-3 py-1 rounded"
//                 >
//                   Add
//                 </button>
//               </div>
//             )}
//           </div>

//           {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//           <button
//             className="w-full mt-2 bg-[#875cf5] hover:bg-[#6c42e0] text-white py-2 px-4 rounded-lg transition"
//             onClick={addExpense}
//           >
//             + Add Expense
//           </button>
//         </div>

//         {/* List */}
//         <div className="mt-6">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-lg font-semibold text-slate-800">
//               Expense List
//             </h2>
//             {expenses.length > 0 && (
//               <button
//                 onClick={exportToExcel}
//                 className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
//               >
//                 Export to Excel
//               </button>
//             )}
//           </div>

//           {expenses.length === 0 ? (
//             <p className="text-slate-600 text-sm">No expenses added yet.</p>
//           ) : (
//             <ul className="space-y-3">
//               {expenses.map((exp) => (
//                 <li
//                   key={exp._id}
//                   className="relative bg-white border border-gray-100 p-4 rounded-lg shadow-sm group flex justify-between items-center"
//                 >
//                   <div>
//                     <p className="text-slate-800 font-medium">{exp.name}</p>
//                     <p className="text-xs text-slate-500">
//                       ₹{exp.amount} • {exp.category}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => deleteExpense(exp._id)}
//                     className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700 text-sm"
//                   >
//                     Delete
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </MainLayout>
//   );
// };

// export default Expense;

// src/pages/Dashboard/Expense.jsx
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import MainLayout from "../../components/Layouts/MainLayout";

const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState(null);

  const [categories, setCategories] = useState([]);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) fetchExpenses();
  }, [token]);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/expense", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch expenses");

      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error("Expense Fetch Error:", err.message);
      setError("Error fetching expenses");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("http://localhost:5000/api/category", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data);
    };
    if (token) fetchCategories();
  }, [token]);

  const handleCategoryChange = (e) => {
    if (e.target.value === "other") {
      setShowOtherInput(true);
      setCategory("");
    } else {
      setCategory(e.target.value);
      setShowOtherInput(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategory }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add category");
      }

      const newCat = await res.json();
      if (!categories.find((cat) => cat.name === newCat.name)) {
        setCategories([...categories, newCat]);
      }

      setCategory(newCat.name);
      setNewCategory("");
      setShowOtherInput(false);
    } catch (err) {
      console.error("Error adding category:", err.message);
    }
  };

  const addExpense = async () => {
    if (showOtherInput && !category) {
      setError("Please finish adding the category and select it.");
      return;
    }

    if (!name || !amount || !category) {
      setError("All fields are required.");
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title:name,
          amount: Number(amount),
          category,
        }),
      });

      if (!res.ok) {
        const errorMsg = await res.text();
        throw new Error(errorMsg || "Failed to add expense");
      }

      const newExpense = await res.json();
      setExpenses([newExpense, ...expenses]);
      setName("");
      setAmount("");
      setCategory("");
      setNewCategory("");
      setShowOtherInput(false);
      setError(null);
    } catch (err) {
      console.error("Add Expense Error:", err.message);
      setError("Failed to add expense");
    }
  };

  const deleteExpense = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/expense/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete expense");

      setExpenses(expenses.filter((exp) => exp._id !== id));
    } catch (err) {
      console.error("Delete Expense Error:", err.message);
      setError("Failed to delete expense");
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(expenses);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expenses");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      "expense_report.xlsx"
    );
  };

  return (
    <MainLayout>
      <div className="p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-[#875cf5] mb-6">
          Expense Management
        </h1>

        {/* Form */}
        <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
          <div className="mb-3">
            <label className="text-sm text-slate-700 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-box w-full"
              placeholder="e.g. Groceries"
            />
          </div>
          <div className="mb-3">
            <label className="text-sm text-slate-700 font-medium">
              Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-box w-full"
              placeholder="e.g. 1500"
            />
          </div>
          <div className="mb-3">
            <label className="text-sm text-slate-700 font-medium">
              Category
            </label>
            <select
              value={category}
              onChange={handleCategoryChange}
              className="input-box w-full"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
              <option value="other">Other</option>
            </select>

            {showOtherInput && (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category"
                  className="input-box flex-1"
                />
                <button
                  onClick={handleAddCategory}
                  className="bg-[#875cf5] text-white px-3 py-1 rounded"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          <button
            className="w-full mt-2 bg-[#875cf5] hover:bg-[#6c42e0] text-white py-2 px-4 rounded-lg transition"
            onClick={addExpense}
          >
            + Add Expense
          </button>
        </div>

        {/* List */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-800">
              Expense List
            </h2>
            {expenses.length > 0 && (
              <button
                onClick={exportToExcel}
                className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                Export to Excel
              </button>
            )}
          </div>

          {expenses.length === 0 ? (
            <p className="text-slate-600 text-sm">No expenses added yet.</p>
          ) : (
            <ul className="space-y-3">
              {expenses.map((exp) => (
                <li
                  key={exp._id}
                  className="relative bg-white border border-gray-100 p-4 rounded-lg shadow-sm group flex justify-between items-center"
                >
                  <div>
                    <p className="text-slate-800 font-medium">{exp.name}</p>
                    <p className="text-xs text-slate-500">
                      ₹{exp.amount} • {exp.category}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteExpense(exp._id)}
                    className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Expense;

