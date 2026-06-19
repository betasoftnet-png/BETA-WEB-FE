import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithSSO } = useContext(AuthContext);
  
  const [status, setStatus] = useState('initializing'); // initializing, exchanging, profile, success, error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const exchangeCode = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');

      if (!code) {
        setStatus('error');
        setErrorMessage('Authorization code is missing from the callback URL.');
        return;
      }

      try {
        // Step 1: Exchange Auth Code for JWT Token
        setStatus('exchanging');
        const tokenResponse = await api.post('/api/oauth/token', {
          grantType: 'authorization_code',
          code,
          clientId: import.meta.env.VITE_CLIENT_ID || 'beta_website',
          clientSecret: import.meta.env.VITE_CLIENT_SECRET || 'secure-beta-secret-2026'
        });

        if (!tokenResponse.data || !tokenResponse.data.success) {
          throw new Error(tokenResponse.data?.message || 'Token exchange failed.');
        }

        const accessToken = tokenResponse.data.data.access_token;
        
        // Save token temporarily so subsequent requests capture it
        localStorage.setItem('beta_token', accessToken);

        // Step 2: Fetch User Profile
        setStatus('profile');
        const profileResponse = await api.get('/api/users/me');

        if (!profileResponse.data || !profileResponse.data.success) {
          throw new Error(profileResponse.data?.message || 'Failed to retrieve user profile.');
        }

        const { username, accountType } = profileResponse.data.data;
        const role = accountType || 'ROLE_ADMIN';

        // Step 3: Set State in Context
        loginWithSSO(accessToken, username, role);
        setStatus('success');

        // Redirect to admin dashboard
        setTimeout(() => {
          navigate('/adminofcarrer');
        }, 1200);

      } catch (error) {
        console.error('SSO Authentication Error:', error);
        setStatus('error');
        // Clean up any partial token setup
        localStorage.removeItem('beta_token');
        setErrorMessage(
          error.response?.data?.message || 
          error.message || 
          'An unexpected error occurred during SSO authentication.'
        );
      }
    };

    exchangeCode();
  }, [searchParams, loginWithSSO, navigate]);

  return (
    <div className="auth-white-theme min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[30%] right-[20%] w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card p-8 rounded-3xl border border-slate-200 shadow-2xl relative text-center"
      >
        {status === 'error' ? (
          <div className="space-y-6">
            <div className="h-16 w-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-500 shadow-sm">
              <AlertCircle className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">SSO Authentication Failed</h2>
              <p className="text-slate-500 text-sm leading-relaxed">{errorMessage}</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/10"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Sign In</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center mx-auto text-white shadow-lg shadow-blue-500/20 relative">
              <Shield className="h-7 w-7 animate-pulse" />
              <div className="absolute inset-0 rounded-2xl border-2 border-cyan-300/30 animate-ping pointer-events-none" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">SSO Gateway</h2>
              <div className="flex items-center justify-center space-x-2 text-slate-500 text-xs uppercase tracking-widest font-bold">
                <RefreshCw className="h-3 w-3 animate-spin text-[#004AAD]" />
                {status === 'initializing' && <span>Initializing gateway...</span>}
                {status === 'exchanging' && <span>Exchanging security credentials...</span>}
                {status === 'profile' && <span>Setting up user session...</span>}
                {status === 'success' && <span className="text-emerald-600">Verification successful!</span>}
              </div>
            </div>

            <p className="text-slate-400 text-xs max-w-xs mx-auto">
              Please do not refresh the page or click back. We are validating your security signatures with B2Auth.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
