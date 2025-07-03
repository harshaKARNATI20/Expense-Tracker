import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

const Input = ({ value, onChange, placeholder, label, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-4">
      {label && <label className="text-sm text-slate-800">{label}</label>}
      <div className="relative flex items-center border border-gray-300 rounded-md px-3 py-2 mt-1">
        <input
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-sm"
          value={value}
          onChange={onChange}
        />
        {type === 'password' && (
          <span className="ml-2 cursor-pointer" onClick={toggleShowPassword}>
            {showPassword ? (
              <FaRegEye size={22} className="text-primary" />
            ) : (
              <FaRegEyeSlash size={22} className="text-slate-400 cursor-pointer"
              onClick={toggleShowPassword} />
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
