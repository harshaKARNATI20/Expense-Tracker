import React, { useState } from "react";
import AuthLayout from "../../components/Layouts/AuthLayout";
import Input from "../../components/Inputs/Input";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login: saveTokenToContext } = useAuth();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user?.isAdmin) {
      navigate("/admin/dashboard");
    } else if (token) {
      navigate("/dashboard/home");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        saveTokenToContext(res.data.token);

        if (res.data.user.isAdmin) {
          navigate("/admin/dashboard");
        } else {
          navigate("/dashboard/home");
        }
      } else {
        setError("Invalid login response");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-[#1e1e1e]">Welcome Back</h3>
        <p className="text-xs text-slate-600 mt-[5px] mb-6">
          Please enter your details to login
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            placeholder="john@example.com"
            type="text"
            value={email}
            onChange={({ target }) => setEmail(target.value)}
          />

          <Input
            label="Password"
            placeholder="********"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />

          {error && <p className="text-red-500 text-sm mt-[-8px]">{error}</p>}

          <button
            type="submit"
            className="bg-[#875cf5] hover:bg-[#6c42e0] text-white py-2 px-4 rounded-lg transition w-full mt-2"
          >
            Login
          </button>

          {/* <p className="text-sm text-center mt-4 text-slate-700">
            Don’t have an account?{" "}
            <span
              className="text-[#875cf5] font-semibold hover:underline cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p> */}

          <div className="flex flex-col gap-2 mt-4">
            <button
              className="text-sm text-[#875cf5] font-semibold hover:underline"
              onClick={() => navigate("/admin/login")}
            >
              Login as Admin
            </button>

            <p className="text-sm text-center text-slate-700">
              Don’t have an account?{" "}
              <span
                className="text-[#875cf5] font-semibold hover:underline cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </p>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
