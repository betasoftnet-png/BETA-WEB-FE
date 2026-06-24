import React, { useState, useContext, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Box, LogOut, LayoutDashboard, LogIn, ChevronDown, ChevronRight, Mail, Shield, User, Briefcase, Search, UserPlus, Lock, CheckCircle2, AlertCircle, HelpCircle, MessageSquare, Download, Phone, Activity, MapPin, Check, Copy, Clock, Send, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../api';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownCategoryOpen, setIsDropdownCategoryOpen] = useState(true);
  const [isDropdownPublicOpen, setIsDropdownPublicOpen] = useState(true);
  const [isDropdownBusinessOpen, setIsDropdownBusinessOpen] = useState(true);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(true);
  const [isMobilePublicOpen, setIsMobilePublicOpen] = useState(true);
  const [isMobileBusinessOpen, setIsMobileBusinessOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Tiruvallur');
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isMobileLocationOpen, setIsMobileLocationOpen] = useState(false);
  const locationRef = useRef(null);
  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);
  const cities = ['Tiruvallur', 'Vellore'];
  const { user, logout, redirectToSSO } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState(null);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setDetectionError("Geolocation is not supported by your browser.");
      return;
    }

    setIsDetecting(true);
    setDetectionError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (!response.ok) throw new Error("Failed to fetch location data");
          const data = await response.json();
          const detectedCity = data.city || data.locality || data.principalSubdivision || "Unknown City";
          setSelectedCity(detectedCity);
          setIsDetecting(false);
          setIsLocationOpen(false);
          setIsMobileLocationOpen(false);
        } catch (error) {
          console.error("Error detecting city:", error);
          setDetectionError("Failed to resolve city name.");
          setIsDetecting(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMsg = "Permission denied or location unavailable.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permission denied.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = "Location position unavailable.";
        } else if (error.code === error.TIMEOUT) {
          errorMsg = "Location detection timed out.";
        }
        setDetectionError(errorMsg);
        setIsDetecting(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const profileRef = useRef(null);
  const productsDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (productsDropdownRef.current && !productsDropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setIsLocationOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      setSearchQuery('');
      if (query.includes('mail') || query.includes('smtp') || query.includes('imap')) {
        navigate('/products#bnx-mail');
      } else if (query.includes('auth') || query.includes('security') || query.includes('sso') || query.includes('mfa')) {
        navigate('/products#b2auth-security');
      } else if (query.includes('personal') || query.includes('note') || query.includes('task') || query.includes('clik')) {
        if (query.includes('business')) {
          navigate('/cliks-business/dashboard');
        } else {
          navigate('/products#cliks');
        }
      } else if (query.includes('business') || query.includes('team') || query.includes('project') || query.includes('chat')) {
        navigate('/cliks-business/dashboard');
      } else if (query.includes('about') || query.includes('vision') || query.includes('mission') || query.includes('story')) {
        navigate('/about');
      } else if (query.includes('career') || query.includes('job') || query.includes('apply') || query.includes('work')) {
        navigate('/careers');
      } else if (query.includes('contact') || query.includes('sales') || query.includes('enquiry') || query.includes('phone') || query.includes('partner') || query.includes('partnership')) {
        navigate('/partners');
      } else if (query.includes('login') || query.includes('admin') || query.includes('dashboard') || query.includes('portal')) {
        navigate('/login');
      } else {
        navigate('/products');
      }
    }
  };

  const navLinks = [
    { name: 'Products', path: '/products' },
    { name: 'Partners', path: '/partners' },
    { name: 'Careers', path: '/careers' },
    { name: 'About', path: '/about' },
    { name: 'Support', path: '/support' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e2f0e8] shadow-sm text-slate-800">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center ml-4 sm:ml-12 space-x-2 flex-1 justify-start">
            <Link to="/" className="flex items-center select-none">
              <img src="/logo.png" alt="Beta Logo" className="h-12 w-auto object-contain" />
            </Link>

            <div className="relative animate-fadeIn ml-0" ref={locationRef}>
              <button
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 hover:bg-slate-200/60 transition duration-300 text-xs font-bold text-slate-700 cursor-pointer focus:outline-none"
              >
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-slate-700">{selectedCity}</span>
                <ChevronDown className={`h-3 w-3 text-slate-400 transform transition-transform ${isLocationOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLocationOpen && (
                <div className="absolute left-0 mt-2 w-44 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 text-left text-slate-800">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-3 py-1.5 border-b border-slate-100">
                    Select Location
                  </div>
                  <div className="py-1 max-h-60 overflow-y-auto">
                    {/* Current Location Option */}
                    <button
                      onClick={handleCurrentLocation}
                      disabled={isDetecting}
                      className="w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center space-x-1.5 hover:bg-slate-50 text-slate-700 hover:text-emerald-750 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDetecting ? (
                        <RefreshCw className="h-3.5 w-3.5 text-emerald-600 animate-spin" />
                      ) : (
                        <MapPin className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
                      )}
                      <span>{isDetecting ? "Detecting Location..." : "Current Location"}</span>
                    </button>
                    {detectionError && (
                      <div className="px-3 py-1 text-[10px] text-rose-500 font-semibold leading-tight animate-fadeIn">
                        {detectionError}
                      </div>
                    )}
                    <div className="my-1.5 border-t border-slate-100/80" />

                    {/* Cities List */}
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city);
                          setIsLocationOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-between ${selectedCity === city
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'hover:bg-slate-50 text-slate-700 hover:text-[#004AAD]'
                          }`}
                      >
                        <span>{city}</span>
                        {selectedCity === city && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Nav Links (Centered) */}
          <div className="hidden md:flex items-center justify-center flex-1 z-20">
            {/* Desktop Nav Links */}
            <div className="flex items-center space-x-0.5 bg-slate-100/90 p-1 rounded-full border border-slate-200/80 shadow-inner nav-pill-container">
              {navLinks.map((link) => {
                if (link.name === 'Products') {
                  return (
                    <div
                      key={link.name}
                      ref={productsDropdownRef}
                      className=""
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setIsDropdownOpen(!isDropdownOpen);
                        }}
                        className={`flex items-center space-x-1 focus:outline-none cursor-pointer ${isActive('/products') || isDropdownOpen ? 'active-pill' : ''}`}
                      >
                        <span>Products</span>
                        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {isDropdownOpen && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-[640px] rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-50 text-left text-slate-800">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-emerald-50 border-b border-emerald-100/30 text-emerald-800 text-xs uppercase tracking-wider font-extrabold select-none">
                                <th
                                  className="py-2.5 px-4 rounded-l-lg text-emerald-800 w-1/5 select-none"
                                >
                                  <div className="flex items-center space-x-1">
                                    <span>Category</span>
                                  </div>
                                </th>
                                <th
                                  className="py-2.5 px-4 text-emerald-800 w-2/5 select-none"
                                >
                                  <div className="flex items-center space-x-1">
                                    <span>Public</span>
                                  </div>
                                </th>
                                <th
                                  className="py-2.5 px-4 rounded-r-lg text-emerald-800 w-2/5 select-none"
                                >
                                  <div className="flex items-center space-x-1">
                                    <span>Business</span>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-750 text-xs">
                              {/* Row 1: Base */}
                              <tr className="bg-yellow-50/85 hover:bg-yellow-100/40 transition-colors">
                                <td className="py-3 px-2 align-top pt-3 w-1/5">
                                  {isDropdownCategoryOpen && (
                                    <div
                                      className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-extrabold uppercase tracking-widest select-none text-left"
                                    >
                                      Base
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-4 align-top w-2/5 border-r border-slate-200">
                                  {/* Public Products */}
                                  {isDropdownPublicOpen && (
                                    <div className="flex flex-col gap-3 pt-1 pb-1">
                                      <a
                                        href="https://www.bnxmail.com/login"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2.5 p-1.5 rounded-lg transition group hover:bg-white/95 hover:shadow-sm cursor-pointer text-left block"
                                      >
                                        <div className="h-7 w-7 flex-shrink-0 flex items-center justify-center">
                                          <img src="/bnx_mail_logo.png" alt="BNX Mail" className="h-full w-full object-contain" />
                                        </div>
                                        <div>
                                          <p className="font-bold text-slate-800 text-sm">BNX MAIL</p>
                                          <p className="text-xs text-slate-450 font-medium">Collaborative group inbox</p>
                                        </div>
                                      </a>

                                      <a
                                        href="https://www.b2auth.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2.5 p-1.5 rounded-lg transition group hover:bg-white/95 hover:shadow-sm cursor-pointer text-left block"
                                      >
                                        <div className="h-7 w-7 flex-shrink-0 flex items-center justify-center">
                                          <img src="/b2auth_logo.png" alt="B2Auth Security" className="h-full w-full object-contain" />
                                        </div>
                                        <div>
                                          <p className="font-bold text-slate-800 text-sm">B2AUTH SECURITY</p>
                                          <p className="text-xs text-slate-450 font-medium">MFA & SSO Gateway</p>
                                        </div>
                                      </a>

                                      <a
                                        href="https://bittool.beta-softnet.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2.5 p-1.5 rounded-lg transition group hover:bg-white/95 hover:shadow-sm cursor-pointer text-left block"
                                      >
                                        <div className="h-7 w-7 flex-shrink-0 flex items-center justify-center">
                                          <img src="/bit_tool_logo.png" alt="Bit Tool" className="h-full w-full object-contain" />
                                        </div>
                                        <div>
                                          <p className="font-bold text-slate-800 text-sm">BIT TOOL</p>
                                          <p className="text-xs text-slate-450 font-medium">Developer utility assistant</p>
                                        </div>
                                      </a>

                                      <a
                                        href="https://cliks.beta-softnet.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2.5 p-1.5 rounded-lg transition group hover:bg-white/95 hover:shadow-sm cursor-pointer text-left block"
                                      >
                                        <div className="h-7 w-7 flex-shrink-0 flex items-center justify-center">
                                          <img src="/cliks_logo.png" alt="Cliks" className="h-full w-full object-contain" />
                                        </div>
                                        <div>
                                          <p className="font-bold text-slate-800 text-sm">CLIKS</p>
                                          <p className="text-xs text-slate-450 font-medium">Notes & calendars</p>
                                        </div>
                                      </a>
                                    </div>
                                  )}
                                </td>
                                <td className="py-3 px-4 align-top w-2/5">
                                  {/* Business Products */}
                                  {isDropdownBusinessOpen && (
                                    <div className="flex flex-col gap-3 pt-1 pb-1">
                                      <a
                                        href="https://www.cliksbusiness.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2.5 p-1.5 rounded-lg transition group hover:bg-white/95 hover:shadow-sm cursor-pointer text-left block"
                                      >
                                        <div className="h-7 w-7 flex-shrink-0 flex items-center justify-center">
                                          <img src="/cliks_business_logo.png" alt="Cliks Business" className="h-full w-full object-contain" />
                                        </div>
                                        <div>
                                          <p className="font-bold text-slate-800 text-sm">CLIKS BUSINESS</p>
                                          <p className="text-xs text-slate-450 font-medium">Team project chats</p>
                                        </div>
                                      </a>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                }


                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={isActive(link.path) ? 'active-pill' : ''}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Desktop Search, Profile & Auth CTA */}
          <div className="hidden md:flex items-center justify-end space-x-4 flex-1 z-20">

            {/* Header Search Bar */}
            <div ref={searchContainerRef} className="mr-2 flex items-center justify-center">
              {isSearchExpanded ? (
                <div className="relative w-36 lg:w-44 xl:w-52 nav-search-container animate-fadeIn">
                  <button
                    type="button"
                    onClick={() => setIsSearchExpanded(false)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200/30 rounded-full transition cursor-pointer z-10 flex items-center justify-center border-none bg-transparent"
                    title="Close Search"
                  >
                    <Search className="h-4 w-4 text-blue-305 nav-search-icon" />
                  </button>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    placeholder="Search..."
                    className="w-full bg-[#002b5c]/60 border border-blue-800/40 rounded-full py-1.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-white focus:bg-[#002b5c]/90 transition shadow-inner nav-search-input"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchExpanded(true)}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition duration-300 focus:outline-none cursor-pointer flex items-center justify-center"
                  title="Search"
                >
                  <Search className="h-5 w-5 text-slate-650 hover:text-[#004AAD]" />
                </button>
              )}
            </div>
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100/95 border border-slate-200/80 hover:bg-slate-200/60 transition duration-300 cursor-pointer text-slate-700 focus:outline-none"
                >
                  <div className="h-6 w-6 rounded-full bg-[#004AAD] flex items-center justify-center text-white font-semibold text-xs select-none">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-semibold tracking-wide pr-1 text-slate-700">
                    {user.fullName || user.firstName || (user.username ? user.username.split('@')[0] : 'User')}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transform transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl p-5 z-50 text-left text-slate-800">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Logged In As</p>
                      <p className="text-sm font-extrabold text-slate-900 truncate">{user.fullName || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username)}</p>
                      <p className="text-xs text-slate-500 font-medium truncate">{user.email || user.username}</p>
                    </div>

                    <div className="border-b border-slate-100 my-4" />

                    <div className="space-y-4">
                      <Link
                        to="/adminofcarrer"
                        onClick={() => setIsProfileOpen(false)}
                        className="block text-sm font-semibold text-slate-700 hover:text-[#004AAD] transition"
                      >
                        Account Profile
                      </Link>

                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-slate-700">Language</span>
                        <span className="text-slate-400 font-medium">English</span>
                      </div>

                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-slate-700">Currency</span>
                        <span className="text-slate-400 font-medium">INR (₹)</span>
                      </div>

                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-slate-700">Country</span>
                        <span className="text-slate-400 font-medium">India</span>
                      </div>
                    </div>

                    <div className="border-b border-slate-100 my-4" />

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left text-sm font-bold text-red-500 hover:text-red-600 transition border-none bg-transparent cursor-pointer p-0"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={() => redirectToSSO(location.pathname)}
                  className="flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#004AAD] border border-[#004AAD] text-white hover:bg-[#003882] hover:border-[#003882] transition duration-300 text-xs font-bold cursor-pointer header-signin-btn whitespace-nowrap flex-shrink-0 shadow-md shadow-blue-950/20"
                >
                  <LogIn className="h-3.5 w-3.5 text-white flex-shrink-0" />
                  <span className="text-white whitespace-nowrap">Sign In</span>
                </button>
              </div>
            )}
            <div className="h-6 w-px bg-slate-300 self-center" />
            <a
              href="https://bittool.beta-softnet.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 rounded-xl hover:bg-slate-100 transition duration-300 focus:outline-none cursor-pointer flex items-center justify-center border-none bg-transparent ml-2"
              title="Bit Tool"
            >
              <img src="/bit_tool_logo.png" alt="Bit Tool" className="h-7 w-7 object-contain rounded-lg shadow-sm" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-[#004AAD] hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-[#e2f0e8] shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {/* Mobile Location Selector */}
            <div className="px-3 py-1.5 border-b border-slate-100 mb-2">
              <div className="relative">
                <button
                  onClick={() => setIsMobileLocationOpen(!isMobileLocationOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md bg-slate-50 border border-slate-150 text-sm font-medium text-slate-700 focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span className="font-bold">{selectedCity}</span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transform transition-transform ${isMobileLocationOpen ? 'rotate-180' : ''}`} />
                </button>
                {isMobileLocationOpen && (
                  <div className="mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50 p-1 text-left">
                    {/* Current Location Option */}
                    <button
                      onClick={handleCurrentLocation}
                      disabled={isDetecting}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition hover:bg-slate-50 text-slate-700 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isDetecting ? (
                        <RefreshCw className="h-3.5 w-3.5 text-emerald-600 animate-spin" />
                      ) : (
                        <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                      )}
                      <span>{isDetecting ? "Detecting..." : "Current Location"}</span>
                    </button>
                    {detectionError && (
                      <div className="px-3 py-1 text-[10px] text-rose-500 font-semibold leading-tight">
                        {detectionError}
                      </div>
                    )}
                    <div className="my-1 border-t border-slate-100" />

                    {/* Cities List */}
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city);
                          setIsMobileLocationOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition cursor-pointer ${selectedCity === city
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'hover:bg-slate-50 text-slate-700'
                          }`}
                      >
                        <span>{city}</span>
                        {selectedCity === city && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {navLinks.map((link) => {
              if (link.name === 'Products') {
                return (
                  <div key={link.name} className="space-y-1">
                    <button
                      onClick={() => {
                        setIsMobileProductsOpen(!isMobileProductsOpen);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-[#004AAD] focus:outline-none cursor-pointer"
                    >
                      <span>Products</span>
                      <ChevronDown className={`h-4 w-4 text-slate-400 transform transition-transform ${isMobileProductsOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isMobileProductsOpen && (
                      <div className="pl-4 pr-3 py-2 space-y-2 bg-slate-50 border border-slate-150/80 rounded-lg text-left">                        {/* Mobile Category */}
                        <div className="space-y-2 px-3 py-1 text-left">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</p>
                          <div className="py-1 pl-1">
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-extrabold uppercase tracking-widest select-none">
                              Base
                            </span>
                          </div>
                        </div>

                        {/* Mobile Public */}
                        <div className="space-y-2.5 border-t border-slate-100 pt-3 px-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Public</p>
                          <div className="space-y-2.5 pl-1">
                            <a
                              href="https://www.bnxmail.com/login"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2.5 text-slate-700 text-xs py-1 hover:text-[#004AAD] transition cursor-pointer text-left block"
                            >
                              <img src="/bnx_mail_logo.png" alt="BNX Mail" className="h-4 w-4 object-contain" />
                              <span className="font-bold">BNX Mail</span>
                            </a>
                            <a
                              href="https://www.b2auth.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2.5 text-slate-700 text-xs py-1 hover:text-[#004AAD] transition cursor-pointer text-left block"
                            >
                              <img src="/b2auth_logo.png" alt="B2Auth Security" className="h-4 w-4 object-contain" />
                              <span className="font-bold">B2Auth Security</span>
                            </a>
                            <a
                              href="https://cliks.beta-softnet.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2.5 text-slate-700 text-xs py-1 hover:text-[#004AAD] transition cursor-pointer text-left block"
                            >
                              <img src="/cliks_logo.png" alt="Cliks" className="h-4 w-4 object-contain" />
                              <span className="font-bold">Cliks</span>
                            </a>
                          </div>
                        </div>

                        {/* Mobile Business */}
                        <div className="space-y-2.5 border-t border-slate-100 pt-3 px-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-left">Business</p>
                          <div className="space-y-2.5 pl-1">
                            <a
                              href="https://www.cliksbusiness.com/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2.5 text-slate-700 text-xs py-1 hover:text-[#004AAD] transition cursor-pointer text-left block"
                            >
                              <img src="/cliks_business_logo.png" alt="Cliks Business" className="h-4 w-4 object-contain" />
                              <span className="font-bold">Cliks Business</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive(link.path)
                      ? 'bg-blue-50 text-[#004AAD] font-semibold'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-[#004AAD]'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="border-t border-slate-100 my-2 pt-2">
              {user ? (
                <div className="space-y-2 px-3">
                  <div className="flex items-center space-x-3 py-2 border-b border-slate-100 mb-2">
                    <div className="h-8 w-8 rounded-full bg-[#004AAD] flex items-center justify-center text-white font-semibold select-none">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Account</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.fullName || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.username)}</p>
                      {user.email && <p className="text-xs text-slate-500 truncate">{user.email}</p>}
                    </div>
                  </div>
                  <Link
                    to="/adminofcarrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-100 hover:text-[#004AAD]"
                  >
                    <LayoutDashboard className="h-5 w-5 text-slate-400" />
                    <span>Admin Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 text-left border-none bg-transparent cursor-pointer"
                  >
                    <LogOut className="h-5 w-5 text-red-500" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2 px-3">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      redirectToSSO(location.pathname);
                    }}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#004AAD] border border-[#004AAD] text-white hover:bg-[#003882] hover:border-[#003882] transition duration-300 cursor-pointer mobile-signin-btn shadow-md shadow-blue-950/20"
                  >
                    <LogIn className="h-4 w-4 text-white" />
                    <span className="text-white">Sign In</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}



    </nav>
  );
}
