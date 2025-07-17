import React, { useState } from "react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      if (!data.user?.isAdmin) {
        setError("You are not authorized as admin.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/admin/dashboard";
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-[#875cf5] mb-6 text-center">
          Admin Login
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="input-box w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="input-box w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>

          <button type="submit" className="w-full btn-primary">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
