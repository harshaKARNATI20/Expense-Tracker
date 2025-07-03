import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  // ✅ Fetch Incomes from API
  const fetchIncomes = async () => {
    try {
      const res = await fetch('/api/income', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setIncomes(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  // ✅ Add new income
  const addIncome = async () => {
    if (!source || !amount) {
      setError('Please fill in all fields.');
      return;
    }

    if (isNaN(amount) || Number(amount) <= 0) {
      setError('Amount must be a positive number.');
      return;
    }

    try {
      const res = await fetch('/api/income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ source, amount }),
      });

      if (!res.ok) throw new Error('Failed to add income');

      const newIncome = await res.json();
      setIncomes([newIncome, ...incomes]);
      setSource('');
      setAmount('');
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to add income');
    }
  };

  // ✅ Delete income
  const deleteIncome = async (id) => {
    try {
      await fetch(`/api/income/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIncomes(incomes.filter((inc) => inc._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(incomes);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Income');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'income_report.xlsx');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-[#875cf5] mb-6">Income Management</h1>

      {/* Form */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
        <div className="mb-3">
          <label className="text-sm text-slate-700 font-medium">Source</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="input-box w-full"
            placeholder="e.g. Freelancing"
          />
        </div>
        <div className="mb-3">
          <label className="text-sm text-slate-700 font-medium">Amount (₹)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input-box w-full"
            placeholder="e.g. 3000"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          className="w-full mt-2 bg-[#875cf5] hover:bg-[#6c42e0] text-white py-2 px-4 rounded-lg transition"
          onClick={addIncome}
        >
          + Add Income
        </button>
      </div>

      {/* List */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Income List</h2>
          {incomes.length > 0 && (
            <button
              onClick={exportToExcel}
              className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
            >
              Export to Excel
            </button>
          )}
        </div>

        {incomes.length === 0 ? (
          <p className="text-slate-600 text-sm">No income records yet.</p>
        ) : (
          <ul className="space-y-3">
            {incomes.map((inc) => (
              <li
                key={inc._id}
                className="relative bg-white border border-gray-100 p-4 rounded-lg shadow-sm group flex justify-between items-center"
              >
                <div>
                  <p className="text-slate-800 font-medium">{inc.source}</p>
                  <p className="text-xs text-slate-500">₹{inc.amount}</p>
                </div>
                <button
                  onClick={() => deleteIncome(inc._id)}
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
  );
};

export default Income;
