import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle, RefreshCw, UserPlus, CheckCircle2 } from 'lucide-react';
import api from '../api';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/auth/register', {
        username: email,
        password: password
      });
      setSuccess('Account created successfully! Redirecting to login...');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-white-theme relative min-h-screen flex items-center justify-center px-4 py-12">
      {/* Background blobs */}
      <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[30%] right-[20%] w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-8 rounded-3xl border border-slate-200 shadow-2xl relative"
      >
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center mx-auto text-white shadow-lg shadow-blue-500/20">
            <UserPlus className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Support Account</h2>
          <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Secure Admin Registration</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Username / Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="partner@company.com"
                className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg py-2 px-3 pl-10 focus:outline-none focus:border-blue-500 text-sm transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg py-2 px-3 pl-10 focus:outline-none focus:border-blue-500 text-sm transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Verify your password"
                className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg py-2 px-3 pl-10 focus:outline-none focus:border-blue-500 text-sm transition"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-rose-600 text-xs p-3 rounded-lg bg-rose-50 border border-rose-100">
              <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center space-x-2 text-emerald-600 text-xs p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center space-x-2 disabled:bg-slate-200"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Register Account</span>
            )}
          </button>
        </form>

        {/* Navigation Footer */}
        <div className="mt-6 pt-4 border-t border-slate-250 text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#004AAD] hover:text-[#003c8a] transition">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
