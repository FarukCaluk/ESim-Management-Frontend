import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../api/auth';
import { Role } from '../../../types/roles';
import logo from '../../../assets/eSIMfly_logo.png';

const LoginPage: React.FC<{ onLogin?: (role: Role) => void }> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login({ email: username, password });
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', data.role);
      onLogin?.(data.role as Role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-[#252D52]/5 via-white to-[#EF6434]/10 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white/90 backdrop-blur p-8 shadow-xl">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-white ring-2 ring-[#252D52]/15 shadow-sm overflow-hidden">
            <img
              src={logo}
              alt="eSIMfly"
              className="max-h-full max-w-full object-contain select-none -translate-y-9"
              draggable={false}
            />
          </div>

          <h1 className="mt-6 text-center text-2xl font-bold tracking-tight text-[#252D52]">
            Manage Global Connectivity
          </h1>
          <p className="mt-2 text-center text-sm text-[#252D52]/70">
            Login to launch, refine, and oversee every eSIMfly plan & collection.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-[#252D52]">Username</label>
            <input
              className="block h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-[#252D52] focus:outline-none focus:ring-2 focus:ring-[#252D52]/30"
              type="text"
              autoComplete="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[#252D52]">Password</label>
            <input
              className="block h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm focus:border-[#252D52] focus:outline-none focus:ring-2 focus:ring-[#252D52]/30"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-[#252D52] px-4 text-sm font-medium text-white shadow hover:bg-[#1d2444] focus:ring-2 focus:ring-[#EF6434]/40"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
