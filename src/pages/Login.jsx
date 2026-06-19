import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle, RefreshCw, Shield } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/adminofcarrer');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(username, password);
      if (res.success) {
        navigate('/adminofcarrer');
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Connection to security server failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSSOLogin = () => {
    const clientId = import.meta.env.VITE_CLIENT_ID || 'beta_website';
    const redirectUri = import.meta.env.VITE_REDIRECT_URI || 'http://localhost:5173/auth';
    const b2authUrl = import.meta.env.VITE_B2AUTH_URL || 'https://b2auth.com';
    const state = Math.random().toString(36).substring(2, 15);
    
    window.location.href = `${b2authUrl}/?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
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
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Admin Portal</h2>
          <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Secure Gatekeeping</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Username / Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@betasoftnet.com"
                className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg py-2 px-3 pl-10 focus:outline-none focus:border-blue-500 text-sm transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
              <a href="#" className="text-xs font-semibold text-[#004AAD] hover:text-[#003c8a] transition">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                className="w-full bg-white text-slate-900 placeholder-slate-400 border border-slate-200 rounded-lg py-2 px-3 pl-10 focus:outline-none focus:border-blue-500 text-sm transition"
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember_me"
              name="remember_me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-350 rounded bg-white cursor-pointer"
            />
            <label htmlFor="remember_me" className="ml-2 block text-xs text-slate-500 cursor-pointer select-none">
              Remember my session
            </label>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-rose-400 text-xs p-3 rounded-lg bg-rose-950/20 border border-rose-900/30">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center space-x-2 disabled:bg-slate-800"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Login to Dashboard</span>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 font-bold text-slate-400 select-none">Or secure access via</span>
          </div>
        </div>

        {/* SSO Button */}
        <button
          type="button"
          onClick={handleSSOLogin}
          className="w-full py-2.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#004AAD] text-xs font-bold transition flex items-center justify-center space-x-2 border border-blue-200 cursor-pointer shadow-sm"
        >
          <Shield className="h-4 w-4 text-[#004AAD] animate-pulse" />
          <span>Sign in with B2Auth SSO</span>
        </button>

        {/* Credentials Tip */}
        <div className="mt-6 pt-4 border-t border-slate-200 text-center">
          <p className="text-xs text-slate-500 leading-normal">
            Demo Credentials:<br />
            <span className="font-semibold text-slate-700">admin@betasoftnet.com</span> / <span className="font-semibold text-slate-700">admin123</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
