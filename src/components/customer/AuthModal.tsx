import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, CheckCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register } = useStore();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'login') {
      if (!email.trim()) {
        setErrorMsg('Please enter your email.');
        return;
      }
      const success = login(email);
      if (!success) {
        setErrorMsg('Login failed.');
      }
    } else if (mode === 'register') {
      if (!name.trim() || !email.trim() || !phone.trim()) {
        setErrorMsg('All fields are required.');
        return;
      }
      const success = register(name, email, phone);
      if (!success) {
        setErrorMsg('Email already in use.');
      }
    } else if (mode === 'forgot') {
      setErrorMsg('Password reset link sent to your registered email.');
      setTimeout(() => {
        setMode('login');
        setErrorMsg('');
      }, 2500);
    }
  };

  const handleQuickLogin = (quickEmail: string, role: 'customer' | 'admin') => {
    login(quickEmail, role);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-[#FAF5ED] p-6 space-y-5">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tabs */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#292824]">
              Style<span className="text-[#C9684B]">Nest</span>
            </span>
          </div>

          <div className="flex border-b border-gray-100 text-sm font-semibold pt-2">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 transition-colors cursor-pointer border-b-2 ${
                mode === 'login'
                  ? 'border-[#173B32] text-[#173B32]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMsg('');
              }}
              className={`flex-1 py-2.5 transition-colors cursor-pointer border-b-2 ${
                mode === 'register'
                  ? 'border-[#173B32] text-[#173B32]'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {mode === 'register' && (
            <div>
              <label className="font-bold text-[#292824] block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Farhana Akter"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#173B32]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="font-bold text-[#292824] block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#173B32]"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="font-bold text-[#292824] block mb-1">Phone Number (BD)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#173B32]"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-bold text-[#292824]">Password</label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-[#C9684B] hover:underline"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required={mode !== 'forgot'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF5ED]/50 border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#173B32]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#173B32] hover:bg-[#122E27] text-white py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-xs cursor-pointer"
          >
            {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
          </button>
        </form>

        {/* Quick Demo Logins for Pair Programming Testing */}
        <div className="pt-3 border-t border-gray-100">
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block text-center mb-2">
            Quick Test Accounts (One-Click)
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickLogin('admin@stylenest.com', 'admin')}
              className="p-2 border border-[#173B32] bg-[#E1ECE7]/60 hover:bg-[#E1ECE7] text-[#173B32] font-semibold rounded-lg text-center cursor-pointer flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Profile</span>
            </button>
            <button
              onClick={() => handleQuickLogin('rahim@gmail.com', 'customer')}
              className="p-2 border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-lg text-center cursor-pointer"
            >
              Customer Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
