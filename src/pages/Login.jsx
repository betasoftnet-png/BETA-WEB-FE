import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'ROLE_ADMIN') {
        navigate('/adminofcarrer');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleSSOLogin = () => {
    const clientId = import.meta.env.VITE_CLIENT_ID || 'beta_website';
    const redirectUri = import.meta.env.VITE_REDIRECT_URI || window.location.origin;
    const b2authUrl = import.meta.env.VITE_B2AUTH_URL || 'https://b2auth.com';
    const state = Math.random().toString(36).substring(2, 15);
    
    // Parse redirect path and store in localStorage
    const params = new URLSearchParams(window.location.search);
    const redirectTo = params.get('redirect') || '/';
    localStorage.setItem('sso_redirect_to', redirectTo);
    
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
        className="w-full max-w-md glass-card p-8 rounded-3xl border border-slate-200 shadow-2xl relative text-center space-y-6"
      >
        {/* Header */}
        <div className="space-y-2">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center mx-auto text-white shadow-lg shadow-blue-500/20 relative">
            <Shield className="h-7 w-7 text-white" />
            <div className="absolute inset-0 rounded-2xl border border-white/20 animate-ping pointer-events-none" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign In</h2>
          <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Secure Gatekeeping</p>
        </div>

        <p className="text-slate-500 text-xs leading-normal">
          Single Sign-On (SSO) and Multi-Factor Authentication are enforced via B2Auth Security.
        </p>

        {/* SSO Button */}
        <button
          type="button"
          onClick={handleSSOLogin}
          className="w-full py-3 rounded-xl bg-[#004AAD] hover:bg-[#003882] text-white text-xs font-bold transition flex items-center justify-center space-x-2.5 cursor-pointer shadow-lg shadow-blue-500/20 border-none outline-none"
        >
          <Shield className="h-4.5 w-4.5 text-white animate-pulse" />
          <span>Continue with B2Auth SSO</span>
        </button>

        <div className="pt-2 border-t border-slate-150 text-[10px] text-slate-400">
          Powered by Beta Softnet B2Auth Identity Provider.
        </div>
      </motion.div>
    </div>
  );
}
