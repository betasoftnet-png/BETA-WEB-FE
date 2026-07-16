import React, { useState, useEffect, useContext, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { Shield, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import { AuthContext } from './context/AuthContext';
import api from './api';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Careers from './pages/Careers';
import Partners from './pages/Partners';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Support from './pages/Support';
import CliksBusinessDashboard from './pages/CliksBusinessDashboard';
import BnxMailDashboard from './pages/BnxMailDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Assessment from './pages/Assessment';
import ShareJob from './pages/ShareJob';
import { AuthProvider } from './context/AuthContext';

import ScrollToTop from './components/ScrollToTop';


function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithSSO, user, redirectToSSO } = useContext(AuthContext);
  const [verifyingSSO, setVerifyingSSO] = useState(false);
  const [ssoError, setSsoError] = useState('');

  const codeExchangeInProgress = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (code && !codeExchangeInProgress.current) {
      codeExchangeInProgress.current = true;
      
      // Clean the query parameters from URL immediately to prevent subsequent/race trigger runs
      window.history.replaceState({}, document.title, window.location.pathname);

      const exchangeCode = async () => {
        setVerifyingSSO(true);
        setSsoError('');
        try {
          // Step 1: Exchange Auth Code for JWT Token
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
          const profileResponse = await api.get('/api/users/me');

          if (!profileResponse.data || !profileResponse.data.success) {
            throw new Error(profileResponse.data?.message || 'Failed to retrieve user profile.');
          }

          const { username, accountType, email, fullName, firstName, lastName } = profileResponse.data.data;
          const role = accountType || 'ROLE_ADMIN';

          // Step 3: Set State in Context
          loginWithSSO(accessToken, username, role, email, fullName, firstName, lastName);

          // Redirect to target page or website home page
          const redirectTo = localStorage.getItem('sso_redirect_to') || '/';
          localStorage.removeItem('sso_redirect_to');
          navigate(redirectTo);
        } catch (error) {
          console.error('SSO Authentication Error:', error);
          localStorage.removeItem('beta_token');
          localStorage.removeItem('sso_redirect_to');
          setSsoError(error.response?.data?.message || error.message || 'SSO authentication failed.');
        } finally {
          setVerifyingSSO(false);
        }
      };

      exchangeCode();
    }
  }, [navigate, loginWithSSO]);

  // Don't render the site-wide navbar and footer on the admin dashboard, cliks business dashboard, bnx mail dashboard, or during SSO verification
  const isDashboardMode = location.pathname.startsWith('/adminofcarrer') || location.pathname.startsWith('/admincarrer') || location.pathname.startsWith('/cliks-business') || location.pathname.startsWith('/bnx-mail') || location.pathname.startsWith('/careers/assessment') || location.pathname.startsWith('/careers/task-assessment') || verifyingSSO || !!ssoError;

  if (verifyingSSO || ssoError) {
    return (
      <div className="auth-white-theme min-h-screen flex items-center justify-center px-4 py-12 bg-dark-900 text-slate-800 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[30%] right-[20%] w-[300px] h-[300px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md glass-card p-8 rounded-3xl border border-slate-200 shadow-2xl relative text-center">
          {ssoError ? (
            <div className="space-y-6 text-center">
              <div className="h-16 w-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-500 shadow-sm">
                <AlertCircle className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">SSO Authentication Failed</h2>
                <p className="text-slate-500 text-sm leading-relaxed">{ssoError}</p>
              </div>
              <button
                onClick={() => {
                  setSsoError('');
                  window.history.replaceState({}, document.title, window.location.pathname);
                  redirectToSSO('/');
                }}
                className="w-full py-2.5 rounded-lg bg-[#004AAD] hover:bg-[#003882] text-white text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/10 border-none outline-none cursor-pointer"
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
                  <span>Validating security signatures...</span>
                </div>
              </div>

              <p className="text-slate-400 text-xs max-w-xs mx-auto">
                Please do not refresh the page or click back. We are authenticating your session with B2Auth.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen ${isDashboardMode ? 'bg-[#f3f7f5]' : 'bg-dark-900 text-slate-800'} relative`}>
      {/* Dynamic Cosmic Background Blobs */}
      {!isDashboardMode && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full bg-blue-300/10 blur-[130px] animate-blob-1" />
          <div className="absolute top-[25%] right-[-15%] w-[50%] h-[50%] rounded-full bg-violet-300/10 blur-[130px] animate-blob-2" />
          <div className="absolute bottom-[-15%] left-[5%] w-[60%] h-[60%] rounded-full bg-indigo-300/10 blur-[130px] animate-blob-3" />
        </div>
      )}

      {!isDashboardMode && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Navigate to="/login" replace />} />
          <Route path="/support" element={<Support />} />
          <Route path="/adminofcarrer" element={<AdminDashboard />} />
          <Route path="/admincarrer" element={<AdminDashboard />} />
          <Route path="/cliks-business" element={<CliksBusinessDashboard />} />
          <Route path="/cliks-business/dashboard" element={<CliksBusinessDashboard />} />
          <Route path="/bnx-mail/dashboard" element={<BnxMailDashboard />} />
          <Route path="/careers/assessment" element={<Assessment />} />
          <Route path="/careers/task-assessment" element={<Careers />} />
          <Route path="/careers/saved-jobs" element={<Careers />} />
          <Route path="/share/jobs/:id" element={<ShareJob />} />
        </Routes>

      </main>
      {!isDashboardMode && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
