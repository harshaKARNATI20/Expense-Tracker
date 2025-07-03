import React, { useState } from 'react';
import AuthLayout from '../../components/Layouts/AuthLayout';
import Input from '../../components/Inputs/Input';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    // TODO: Add sign-up API logic here
    console.log("Creating account with:", name, email, password);
    setError(null);
    // navigate('/login'); // optionally redirect
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to sign up
        </p>

        <form onSubmit={handleSignUp} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            placeholder="John Doe"
            type="text"
            value={name}
            onChange={({ target }) => setName(target.value)}
          />

          <Input
            label="Email Address"
            placeholder="john@example.com"
            type="email"
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="bg-[#875cf5] hover:bg-[#6c42e0] text-white font-medium py-2 px-4 rounded-lg transition duration-300 w-full mt-2">
            Sign Up
          </button>

          <p className="text-sm text-center mt-4">
            Already have an account?{' '}
            <span
              className="text-[#875cf5] cursor-pointer font-medium hover:underline"
              onClick={() => navigate('/login')}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
