import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Careers from './pages/Careers';
import Partners from './pages/Partners';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Support from './pages/Support';
import OAuthCallback from './pages/OAuthCallback';
import CliksBusinessDashboard from './pages/CliksBusinessDashboard';
import BnxMailDashboard from './pages/BnxMailDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';


function AppContent() {
  const location = useLocation();
  // Don't render the site-wide navbar and footer on the admin dashboard, cliks business dashboard, bnx mail dashboard, or auth callback page
  const isDashboardMode = location.pathname.startsWith('/adminofcarrer') || location.pathname.startsWith('/cliks-business') || location.pathname.startsWith('/bnx-mail') || location.pathname === '/auth';

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
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth" element={<OAuthCallback />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/support" element={<Support />} />
          <Route path="/adminofcarrer" element={<AdminDashboard />} />
          <Route path="/cliks-business" element={<CliksBusinessDashboard />} />
          <Route path="/cliks-business/dashboard" element={<CliksBusinessDashboard />} />
          <Route path="/bnx-mail/dashboard" element={<BnxMailDashboard />} />
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
